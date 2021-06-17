import express, { request } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Portfolio from '../models/portfolio.model.js';
import Page from '../models/page.model.js';
import Entry from '../models/entry.model.js';
import Image from '../models/image.model.js';
import connect from '../server.js';


const router = express.Router();

/**
 * String of objectId of portfolio required. Get using objectId.valueOf()
 */
export const getPortfolio = async (req, res) => {
    const portfolio_id = req.params.id;
    //console.log(portfolio_id);

    

    await Portfolio.findById(portfolio_id).populate({ 
        path: "pages", 
        populate: [
            { path: 'entries' }, 
            { path: 'directories.$*', 
                populate: [
                    {path: 'entries'}, 
                    {path: 'directories.$*'}
                ]
            }
        ] 
    }).then(portfolio => {
        if (portfolio == null) {
            return res.status(404).send("portfolio _id not found");
        } else {
            console.log("portfolio found. Pages populated");
            console.log(portfolio);
            console.log(portfolio.pages.entries);
            console.log(portfolio.pages.directories);
            return res.status(200).json({ portfolio: portfolio });
        }
    }).catch(err => {
        console.log(err);
        return res.status(400).send("error encountered");
    })
}

export const updatePortfolio = async (req, res) => {
    const portfolio = req.body.portfolio;
    await Portfolio.findByIdAndUpdate(portfolio._id, portfolio)
    .then(update => {
        console.log("portfolio updated");
        return res.status(200).json({ message: "portfolio updated" });
    }).catch(err => {
        console.log(err);
        return res.status(400).send("error encountered");
    })
}


/**
 * THIS IS IDEALLY FOR THE SAVE BUTTON WITHIN EACH PORTFOLIO.
 * req object should take user and portfolio object
 * user object requires _id, name, avatar, gravatar_id variables.
 * portfolio object requires id, name, pages (pages is an array)
 * 
 * Each element (object) of pages array must be of form { directory: string, entries: [entry, entry, ... ] }
 * 
 * Each element (object) of entries array must be of form 
 * { width: string, height: string, fonts: obj, colours: obj, images: obj, texts: obj, sections: array of obj }
 * 
 * Note: Upsert option set to true ensures that document, if not existing, will be created. Otherwise it will be updated.
 */
export const upsertPortfolio = async (req, res) => {

    console.log("save request begins");
    const requestUser = req.body.user;
    const requestPortfolio = req.body.portfolio;

    if (requestPortfolio.name === "") {
        return res.status(400).send("Portfolio Name cannot be empty");
    }

    const user = new User({
        _id: requestUser.id,
        name: requestUser.name,
        avatar: requestUser.avatar,
        gravatar_id: requestUser.gravatar_id
    })

    await User.findById(requestUser.id)
    .then(isExist => {
            if (isExist === null) {
                user.isNew = true;
            } else {
                console.log(isExist)
                console.log(isExist.portfolios);
                user.isNew = false;
                user.portfolios = isExist.portfolios;
            }
        }
    ).catch(err => {
        console.log(err);
    })

    const portfolio = new Portfolio({
        _id: requestPortfolio._id,
        name: requestPortfolio.name,
        user: requestUser.id
    })

    //If id doesn't exist, obj is new
    if (portfolio._id === undefined) {

        //This will handle duplicate names chosen before anything is actually saved.
        await Portfolio.findOne({ name: portfolio.name })
        .then(isExist => {
            if (isExist === null) {
                portfolio._id = new mongoose.Types.ObjectId();
                portfolio.isNew = true;
                user.portfolios.push(portfolio._id); //If portfolio is new, then add it in user's ref
            } else {
                return res.status(400).send("Duplicate Portfolio Name Chosen");
            }
        }).catch(err => {
            console.log(err);
            return res.status(400).send(err);
        })
        
    } else {
        await Portfolio.findById(portfolio._id)
        .then(async isExist => {
            if (isExist === null) {
                //Just In Case
                portfolio.isNew = true;
                user.portfolios.push(portfolio._id); //If portfolio is new, then add it in user's ref
            } else {
                portfolio.isNew = false;

                /**
                 * The below process checks existing page documents with the newly incoming ones and allows us to determine which page documents are no longer needed.
                 * 
                 * Note: Any form of saving cannot be done in this process since the _id of existing page documents are stored in nested directories maps. Doing so will
                 * lead to page documents being orphaned with no logic to clean those up.
                 */

                //add all incoming page ids into a set
                const incomingPageIds = new Set();
                console.log("incoming", requestPortfolio.pages.directories);
                console.log("incoming keys", Object.keys(requestPortfolio.pages.directories));
                /**
                 * CollectIncoming recursively collects page ids from (nested?) directories map and places them in a Set.
                 * Note: new pages could be created in an existing Portfolio, so need to check for undefined.
                 */
                const collectIncoming = (obj) => {
                    console.log(obj);
                    if (Object.keys(obj).length !== 0) {
                        for (let key of Object.keys(obj)) {
                            
                            if (obj[key]._id !== undefined) {
                                incomingPageIds.add(obj[key]._id.valueOf());
                                console.log("added " + obj[key]._id.valueOf());
                            }
                            //undefined page could still be linked to previously created page. Still need to check to the very end.
                            collectIncoming(obj[key].directories);
                        }
                    }
                }

                collectIncoming(requestPortfolio.pages.directories);

                console.log(incomingPageIds);

                //What lean() does is that it returns a plain JS object and not a mongoose document.
                //Gets the existing directories of the root page to start off recursive process on.
                const currentDir = await Page.findById(isExist.pages._id).lean()
                .then(page => {
                    console.log("found",page)
                    return page.directories;
                }).catch(err => {
                    console.log(err);
                })
                
                //for some reason this gives [ '$__parent', '$__path', '$__schemaType' ] which is 3 keys without anything in the map if lean() is not used.
                //Furthermore, you cannot access properties not declared in schema
                /**
                 * collectExisting fetches from mongodb each subsequent nested directories if any and checks if the pages that they are
                 * referencing should be deleted by comparing with the Set formed above ^.
                 */
                const collectExisting = async (obj) => {
                    if (Object.keys(obj).length !== 0) {
                        for (let key of Object.keys(obj)) {
                            //What lean() does is that it returns a plain JS object and not a mongoose document.
                            //need to recursively go thru all the page directories first and check each _id
                            let directories = await Page.findById(obj[key]._id).lean()
                            .then(page => {
                                if (!page) return res.status(400).send("error encountered");
                                return page.directories;
                            }).catch(err => {
                                console.log(err);
                            })

                            await collectExisting(directories);

                            //only if it does not belong in set, then delete at the end, after checking thru all the existing page _ids in current page's directories
                            if (!incomingPageIds.has(obj[key]._id.valueOf().toString())) {
                                //delete attached entry documents first
                                await Page.findById(obj[key]._id)
                                .then(async page => {
                                    for (entryId of page.entries) {
                                        await Entry.findByIdAndDelete(entryId).then(deletedEntry => console.log(`${deletedEntry._id} entry deleted`)).catch(err => console.log(err));
                                    }
                                }).catch(err => console.log(err));
                                //Then delete the page document
                                await Page.findByIdAndDelete(obj[key]._id).then(deletedPage => console.log(`${deletedPage._id} page deleted`)).catch(err => console.log(err));
                            }
                            
                        }
                    }
                }

                await collectExisting(currentDir).then(() => console.log("cleaning done")).catch(err => console.log(err));

            }
        }).catch(err => {
            console.log(err);
        })
        
    }


    //page documents are stored in pages in the KVP form ===> page._id + page.directory : [page document, [entry documents...]]
    //E.g. the root page will be stored as 123456789012/ : [root page document, [entry documents for root page]]
    const pages = {}

    //The below 2 data structures will allow orphaned/deleted entries to be cleaned up.
    //Store incoming entries
    const incomingEntries = new Set();
    //store existing entries
    const existingEntries = [];

    
    /**
     * upsertPage will execute in 3 phases.
     * 
     * 1st phase: It constructs the page document and checks if the page already exists depending on existence of its _id.
     * 
     * 2nd phase: adds incoming entries to incomingEntriesSet and existing entries to existingEntries array for comparison to delete later.
     * 
     * 3rd phase: It generates the entry documents and stores the page documents along with the entry documents in the higher level pages map
     * as specified directly above ^.
     */
    const upsertPage = async (requestPage) => {
        const page = new Page({
            _id: requestPage._id,
            directory: requestPage.directory,
            portfolio: portfolio._id,
            // directories: requestPage.directories. Shldn't set to this, need to reset it.
            directories: {}
        });

        //new entries array for requestPage for ids
        const entries = [];
        //new array for entry objs to be saved.
        const entryObjs = [];

        if (requestPage._id === undefined) {
            page._id = new mongoose.Types.ObjectId();
            page.isNew = true;

        } else {
            /**
             * although this may seem unnecessary since we have already performed the check for pages in the phase above, we
             * still need to fetch the same page document since the _id of entries are stored in entries array in the page documents.
             * 
             * The entry documents have yet to be checked for deletion.
             */
            await Page.findById(requestPage._id)
            .then(async isExist => {
                if (isExist === null) {
                    page.isNew = true;
                }
                page.isNew =  false;
                page.entries = [];

                

                //Compare and remove unnecessary existing entries. This prevents orphaned entry documents.
                for (let requestEntry of requestPage.entries) {
                    if (requestEntry._id !== undefined) {
                        console.log(requestEntry._id.valueOf() + " added to incoming entries set");
                        incomingEntries.add(requestEntry._id.valueOf());
                    }
                }
                
                for (let existingEntry of isExist.entries) {
                    existingEntries.push(existingEntry._id.valueOf().toString());
                }
            }).catch(err => console.log(err));
        }

        //regardless of new or not, need to set up entry objects either for updating or saving.
        for (let requestEntry of requestPage.entries) {
            const entry = new Entry({
                _id: requestEntry._id,
                page: page._id,
                type: requestEntry.type,
                style: requestEntry.style,
                width: requestEntry.width,
                height: requestEntry.height,
                fonts: requestEntry.fonts,
                colours: requestEntry.colours,
                images: requestEntry.images,
                texts: requestEntry.texts,
                sections: requestEntry.sections
            });

            if (entry._id === undefined) {
                entry._id = new mongoose.Types.ObjectId();
                entry.isNew = true;
            } else {
                entry.isNew = false;
            }

            entries.push(entry._id);
            entryObjs.push(entry);
        }

        page.entries = entries;
        pages[page._id.valueOf() + requestPage.directory] = [page, entryObjs];
        //returns the objectId of the current page for use in populating directories ref array.
        return page._id.valueOf();
    }

    //pages in portfolio document has to be upserted first and foremost.
    //Need to set the portfolio pages to _id of the root page document.
    const rootPage_id = await upsertPage(requestPortfolio.pages);
    portfolio.pages = rootPage_id;

    
    //recursePages takes the _id of the parent page document to allow the _id of child page documents to be added to parent page's directories map.
    const recursePages = async (obj, prev_id) => {
        console.log("recurse", obj.directories);
        const directories = obj.directories
        if (Object.keys(directories).length !== 0) {

            for (let key of Object.keys(directories)) {
                const current_id = await upsertPage(directories[key]);
                //obj.directory would allow us to refer to page that is supposed to be parent directory.
                //We need to then prepend the _id string of the parent page
                
                //parentDir is the directory of the prev page
                const parentDir = obj.directory;
                const parentKey = prev_id + parentDir;
                //childDir is the directory of this current page.
                const childDir = directories[key].directory;
                const childKey = current_id + childDir;
                //
                
                pages[parentKey][0].directories.set(childDir, pages[childKey][0]._id);
                // pages[parentKey][0].directories[childDir] = pages[childKey][0];
                console.log("directories changed", pages[parentKey][0].directories);

                await recursePages(directories[key], current_id);
            }

        }
    }


    //go thru all directories in all related page documents.
    await recursePages(requestPortfolio.pages, rootPage_id);

    //Need to clean up entries here
    for (let entryId of existingEntries) {
        if (!incomingEntries.has(entryId)) {
            await Entry.findByIdAndDelete(entryId)
            .then(deleted => {
                console.log("deleted unwanted entry " + deleted._id);
            }).catch(err => {
                console.log(err);
            })
        }
    }


    console.log("save log", pages);
    for (let key of Object.keys(pages)) {
        console.log(key);
        console.log("directories", pages[key][0].directories);
    }

    
    await user.save()
    .then(async () => {   
        await portfolio.save()
        .then(async () => {

            // for (let page of pages) {
            for (let key of Object.keys(pages)) {

                const page = pages[key];
                //first element will be the page to be saved, second element is the entries to be saved for that page
                await page[0].save()
                .then(async () => {

                    for (let entry of page[1]) {
                        await entry.save()
                        .then(() => {
                            console.log("entry saved/updated")
                        }).catch(err => {
                            return res.status(400).send(err);
                        });
                    }

                    
                }).catch(err => {
                    return res.status(400).send(err);
                })
            }
        }).catch(err => {
            return res.status(400).send(err);      
        })

    }).catch(err => {
        return res.status(400).send(err);
    })

    return res.status(200).json({ message: "user created and portfolio created for user.", _id: portfolio._id });
}

/**
 * getPortfolios will get an array of ObjectIds from mongodb representing the portfolios
 * request requires query param id that is the user's unique github id.
 */
export const getPortfolios = async (req, res) => {
    const gh_id = req.query.id;
    await User.findById(gh_id).populate("portfolios")
    .then(user => {
        if (user == null) {
            console.log("user id not found");
            return res.status(404).send("User id not found");
        } else {
            console.log("user portfolios found");
            console.log(user.portfolios);
            return res.status(200).json({ portfolios: user.portfolios });
        }
    }).catch(err => {
        console.log(err);
        return res.status(400).send("error encountered");
    })
}

/**
 * The request params should contain _id of portfolio to be deleted as id
 */
export const deletePortfolio = async (req, res) => {
    
    const id = req.params.id;

    await Portfolio.findByIdAndDelete(id)
    .then(async (deletedPortfolio) => {
        console.log("deleted portfolio");

        await User.findById(deletedPortfolio.user)
        .then(async (user) => {
            console.log(id)
            console.log(user.portfolios)
            const temp = [];
            for (let portfolioId of user.portfolios) {
                if (portfolioId != id) {
                    temp.push(portfolioId);
                }
            }
            console.log("new user refs:", temp)
            
            await user.updateOne({ portfolios: temp })
            .then(() => {
                console.log("portfolio id removed from user refs");
            }).catch(err => {
                console.log(err)
                return res.status(400).send("error encountered");
            })
        }).catch(err => {
            console.log(err)
            return res.status(400).send("error encountered");
        })

        //fully recurse through all the directories, then start deleting pages and their attached entries.
        const recurseDelete = async (pageId) => {
            await Page.findById(pageId).lean()
            .then(async page => {
                //what lean() does is that it returns a plain js object. This object has no save() or any other document method.
                const directories = page.directories;
                
                for (let key of Object.keys(directories)) {
                    await recurseDelete(directories[key]);
                }
                await Page.findByIdAndDelete(pageId)
                .then(async deletedPage => {
                    console.log(`${deletedPage._id.valueOf()} page deleted`);
                    for (let entryId of deletedPage.entries) {
                        await Entry.findByIdAndDelete(entryId)
                        .then(deletedEntry => {
                            console.log(`${deletedEntry._id.valueOf()} entry deleted`);
                        }).catch(err => {
                            console.log(err);
                            return res.status(400).send("error encountered");
                        })
                    }
                }).catch(err => {
                    console.log(err);
                    return res.status(400).send("error encountered");
                })
            }).catch(err => console.log(err));
  
        }

        //At this pt, deletedPortfolio is not populated, so pages is an ObjectId.
        await recurseDelete(deletedPortfolio.pages);

        return res.status(200).json({ message: `Successfully deleted Portfolio by id ${id}` });
        

    }).catch(err => {
        console.log(err)
        return res.status(400).send("error encountered");
    })

    
}



/**
 * Should take in id as a string from url params.
 * Needs to take in formData with file and label fields
 * Checks if image already exists
 */
export const postImage = async (req, res) => {

    const portfolioId = req.params.id;
    //Check if image exists already
    await Image.findOne({ portfolio: new mongoose.Types.ObjectId(portfolioId), label: req.body.label })
    .then(async image => {
        if (image) return res.status(400).send("image with same label already exists");
        //Check if portfolio exists. There could be an error with delete.
        await Portfolio.findById(portfolioId)
        .then(portfolio => {
            if (!portfolio) return res.status(400).send(`portfolio ${portfolioId} does not exist`);
            const newImage = new Image({
                _id: new mongoose.Types.ObjectId(),
                label: req.body.label,
                filename: req.file.filename,
                fileId: req.file.id,
                portfolio: new mongoose.Types.ObjectId(portfolioId)
            });
            //Once Image is saved, it's time to update images ref in portfolio
            newImage.save()
            .then(async image => {
                const images = portfolio.images;
                if (images.filter(img => img == image._id).length !== 0) return res.status(400).send("duplicate image objectId")

                const imagesCopy = [...images];

                imagesCopy.push(image._id);
                portfolio.images = imagesCopy;
                portfolio.markModified("images");
                //save when called on a document will instead update if changes are made.
                await portfolio.save();

                return res.status(200).json({ message: `image with label: ${req.body.label} has been successfully saved with portfolio image refs updated accordingly` })
            }).catch(err => {
                console.log(err);
                return res.status(400).send("error encountered");
            })
        }).catch(err => {
            console.log(err);
            return res.status(400).send("error encountered");
        })       
    }).catch(err => {
        console.log(err);
        return res.status(400).send("error encountered");
    })
}

/**
 * Should take in id as a string from url params.
 * Needs to take in formData with file and label fields
 * Checks if image already exists
 */
export const updateImage = async (req, res) => {
    const gfs = new mongoose.mongo.GridFSBucket(connect.db, { bucketName: "uploads" });

    const portfolioId = req.params.id;
    const label = req.body.label;
    await Image.findOne({ portfolio: new mongoose.Types.ObjectId(portfolioId), label: label})
    .then(async image => {
        if (!image) return res.status(404).send(`image with label ${label} does not exist`);
        const fileIdToDelete = image.fileId;
        //Need to first delete the currently stored file
        await gfs.delete(new mongoose.Types.ObjectId(fileIdToDelete))
        .then(async () => {
            //Note: Does not matter if file is really deleted since this is update.
            console.log(`file by id ${fileIdToDelete} deleted`);
            //Then update the filename and fileId in image document.
            image.fileId = req.file.id;
            image.filename = req.file.filename;
            await image.save()
            .then(() => {
                return res.status(200).json({ message: `successfully updated file for image with label ${label}`})
            }).catch(err => {
                console.log("first", err);
                return res.status(400).send("error encountered");
            })

        }).catch(err => {
            console.log("first", err);
            return res.status(400).send("error encountered");
        })

        
    }).catch(err => {
        console.log("second", err);
        return res.status(400).send("error encountered");
    })
}

/**
 * Needs to take label as query params.
 * Needs to take portfolio objectId as string in url params.
 */
export const getImage = async (req, res) => {
    const gfs = new mongoose.mongo.GridFSBucket(connect.db, { bucketName: "uploads" });

    const portfolioId = req.params.id;
    const label = req.query.label;

    await Image.findOne({ portfolio: new mongoose.Types.ObjectId(portfolioId), label: label })
    .then(image => {
        if (!image) {
            return res.status(404).send("image with label could not be found for the requested portfolio");
        } else {
            gfs.find({ _id: new mongoose.Types.ObjectId(image.fileId) }).toArray()
            .then(files => {
                if (files[0] === null || files.length === 0) return res.status(400).send("error encountered");

                const file = files[0];
    
                if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                    gfs.openDownloadStream(file._id).pipe(res);
                    // const readStream = gfs.createReadStream(file._id);
                    // readStream.pipe(res);
                } else {
                    return res.status(200).json({ file: file, message: "not an image" });
                }
                
            }).catch(err => {
                console.log(err);
                return res.status(400).send("error encountered");
            })
        }
    }).catch(err => {
        console.log(err);
        return res.status(400).send("error encountered");
    })
    
    
}

//This simply populates the images ref array of portfolio. You need to get the images one by one using the array from frontend.
export const getImages = async (req, res) => {
    
    const portfolioId = req.params.id;

    await Portfolio.findById(portfolioId).populate("images")
    .then(portfolio => {
        if (!portfolio) return res.status(404).send("portfolio does not exist");
        return res.status(200).json({ message: "successfully fetched images ref array", images: portfolio.images })
    }).catch(err => {
        console.log(err);
        return res.status(400).send("error encountered");
    })

}

export const deleteImage = async (req, res) => {
    const gfs = new mongoose.mongo.GridFSBucket(connect.db, { bucketName: "uploads" });

    const portfolioId = req.params.id;
    const label = req.body.label;

    await Image.findOne({ portfolio: new mongoose.Types.ObjectId(portfolioId), label: label })
    .then(async image => {
        if (!image) return res.status(404).send(`image with label ${label} does not exist`);
        console.log("deleting fileId " + image.fileId);
        
        await gfs.delete(new mongoose.Types.ObjectId(image.fileId))
        .then(async () => {
            // if (!deletedFile) return res.status(404).send(`file ${image.fileId} does not exist`);

            await Image.deleteOne({ portfolio: new mongoose.Types.ObjectId(portfolioId), label: label })
            .then(async deletedImage => {
                if (!deletedImage) return res.status(404).send(`image with label ${label} does not exist`);

                await Portfolio.findById(portfolioId)
                .then(async portfolio => {
                    if (!portfolio) return res.status(404).send(`portfolio ${portfolioId} does not exist`);
                    const images = portfolio.images;
                    const imagesCopy = images.filter(img => img._id != deleteImage._id);
                    portfolio.images = imagesCopy;
                    portfolio.markModified("images");
                    await portfolio.save()
                    .then(() => {
                        return res.status(200).json({ message: `image with label ${label} has been successfully deleted and portfolio refs have been successfully updated` });
                    }).catch(err => {
                        console.log(err);
                        return res.status(400).send("error encountered");
                    })
                    
                }).catch(err => {
                    console.log(err);
                    return res.status(400).send("error encountered");
                })

            }).catch(err => {
                console.log(err);
                return res.status(400).send("error encountered");
            })

        }).catch(err => {
            console.log(err);
            return res.status(400).send("error encountered");
        })

    }).catch(err => {
        console.log(err);
        return res.status(400).send("error encountered");
    })
}


export default router;