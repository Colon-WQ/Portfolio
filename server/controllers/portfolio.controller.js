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

    /**
     * Since pages are stored in nested directories maps there are two options here. Create a route to populate each page when we visit them.
     * OR
     * recursively populate the entire thing into an object then send back the completed thing.
     */
    await Portfolio.findById(portfolio_id).populate({ path: "pages", populate: { path: 'entries' } }).exec()
    .then(portfolio => {
        if (portfolio == null) {
            return res.status(404).send("portfolio _id not found");
        } else {
            console.log("portfolio found. Pages populated");
            console.log(portfolio);
            console.log(portfolio.pages.entries);
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
                
                // portfolio.pages = []; //Somehow this is necessary to make sure there are no duplicated page _id in pages.
                // //I suspect that by setting isNew to false, mongoose just decides to add to contents of the pages array to the already existing pages array.

                //Have to delete pages that are not supposed to exist anymore.
                // const dict = new Set();
                // for (let requestPage of requestPortfolio.pages) {
                //     if (requestPage._id !== undefined) {
                //         dict.add(requestPage._id.valueOf());
                //     }
                // }

                //pages is just a page. If id is undefined, then it is a new page.
                
                
                // for (let existingPage of isExist.pages) {
                //     if (!dict.has(existingPage._id.valueOf().toString())) {
                //         Page.findByIdAndDelete(existingPage._id)
                //         .then(deleted => {
                //             console.log("deleted page " + deleted._id);
                //         }).catch(err => {
                //             console.log(err);
                //         })
                //     }
                // }


                /**
                 * The below process checks existing page documents with the newly incoming ones and allows us to determine which page documents are no longer needed.
                 * 
                 * Note: Any form of saving cannot be done in this process since the _id of existing page documents are stored in nested directories maps. Doing so will
                 * lead to page documents being orphaned with no logic to clean those up.
                 */

                //add all incoming page ids into a set
                const incomingPageIds = new Set();
                
                /**
                 * CollectIncoming recursively collects page ids from (nested?) directories map and places them in a Set.
                 * Note: If portfolio is not new, it simply won't have anything in directories, so no need to check for Undefined.
                 */
                const collectIncoming = (obj) => {
                    if (Object.keys(obj).length !== 0) {
                        for (let key in Object.keys(obj)) {
                            incomingPageIds.add(obj[key]._id.valueOf());
                            

                            collectIncoming(obj[key].directories);
                        }
                    }
                }

                collectIncoming(requestPortfolio.pages.directories);

                //Gets the existing directories of the root page to start off recursive process on.
                const currentDir = await Page.findById(isExist.pages)
                .then(page => {
                    return page.directories;
                }).catch(err => {
                    console.log(err);
                })

                /**
                 * collectExisting fetches from mongodb each subsequent nested directories if any and checks if the pages that they are
                 * referencing should be deleted by comparing with the Set formed above ^.
                 */
                const collectExisting = async (obj) => {
                    if (Object.keys(obj).length !== 0) {
                        for (let key of Object.keys(obj)) {
                            //need to recursively go thru all the page directories first and check each _id
                            let directories = await Page.findById(obj[key]._id)
                            .then(page => {
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

    
    /**
     * upsertPage will execute in 3 phases.
     * 
     * 1st phase: It constructs the page document and checks if the page already exists depending on existence of its _id.
     * 
     * 2nd phase: If page exists, it checks if the existing page has entries that should be deleted, then deletes them.
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

        if (requestPortfolio.pages._id === undefined) {
            page._id = new mongoose.Types.ObjectId();
            page.isNew = true;

        } else {
            /**
             * although this may seem unnecessary since we have already performed the check for pages in the phase above, we
             * still need to fetch the same page document since the _id of entries are stored in entries array in the page documents.
             * 
             * The entry documents have yet to be checked for deletion.
             */
            await Page.findById(requestPortfolio.pages._id)
            .then(isExist => {
                if (isExist === null) {
                    page.isNew = true;
                }
                page.isNew =  false;
                page.entries = [];

                const dict = new Set();

                //Compare and remove unnecessary existing entries. This prevents orphaned entry documents.
                for (let requestEntry of requestPage.entries) {
                    if (requestEntry._id !== undefined) {
                        console.log(requestEntry._id.valueOf() + " added to set");
                        dict.add(requestEntry._id.valueOf());
                    }
                }
                console.log(dict)
                for (let existingEntry of isExist.entries) {
                    if (!dict.has(existingEntry._id.valueOf().toString())) {
                        Entry.findByIdAndDelete(existingEntry._id)
                        .then(deleted => {
                            console.log("deleted entry " + deleted._id);
                        }).catch(err => {
                            console.log(err);
                        })
                    }
                }
            })
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
    portfolio.pages = await upsertPage(requestPortfolio.pages);

    
    //recursePages takes the _id of the parent page document to allow the _id of child page documents to be added to parent page's directories map.
    const recursePages = async (obj, prev_id) => {
        const directories = obj.directories
        if (Object.keys(directories).length !== 0) {
            //This happens in two phases. This ensures that even when 2 higher level directories are pointing at a lower level one, there will
            //be a page document already created for both the higher level directories for the program to refer to.

            //First phase, we create page documents for all directories along the same level.
            for (let key of Object.keys(directories)) {
                const current_id = await upsertPage(directories[key]);
                //obj.directory would allow us to refer to page that is supposed to be parent directory.
                //We need to then prepend the _id string of the parent page
                if (prev_id !== null) {
                    //parentDir is the directory of the prev page
                    const parentDir = obj.directory;
                    const parentKey = prev_id + parentDir;
                    //childDir is the directory of this current page.
                    const childDir = directories[key].directory;
                    const childKey = current_id + childDir;
                    //
                    pages[parentKey][0].directories[childDir] = pages[childKey][0];
                }
                
            }

            //Second phase, we then recurse onto the next lower level of directories.
            for (let key of Object.keys(directories)) {
                await recursePages(directories[key], current_id);
            }

        }
    }



    //go thru all directories in all related page documents.
    await recursePages(requestPortfolio.pages, null);

    console.log(pages);

    

    //user.markModified("portfolios"); //Need to mark to enact changes to array contents.

    // const pages = []; //temp array for storing pages to be saved. Stored as such => [page, entries]
    
    // for (let pageObj of requestPortfolio.pages) {

    //     const entries = []; //temp array for storing entries to be saved.

    //     const page = new Page({
    //         _id: pageObj._id,
    //         directory: pageObj.directory,
    //         portfolio: portfolio._id
    //     });

    //     if (page._id === undefined) {
    //         page._id = new mongoose.Types.ObjectId();
    //         page.isNew = true;
    //     } else {
    //         await Page.findById(page._id)
    //         .then(isExist => {
    //             if (isExist === null) {
    //                 //Just In Case
    //                 page.isNew = true;
    //             } else {
    //                 page.isNew = false;
    //                 page.entries = []; //Somehow this is necessary to make sure there are no duplicated entry _id in entries as well.
    //                 //I suspect that by setting isNew to false, mongoose just decides to add to contents of the entries array to the already existing entries array.

    //                 //Have to delete entries that are not supposed to exist anymore.
    //                 const dict = new Set();
    //                 for (let requestEntry of pageObj.entries) {
    //                     if (requestEntry._id !== undefined) {
    //                         console.log(requestEntry._id.valueOf() + " added to set");
    //                         dict.add(requestEntry._id.valueOf());
    //                     }
    //                 }
    //                 console.log(dict)
    //                 for (let existingEntry of isExist.entries) {
    //                     if (!dict.has(existingEntry._id.valueOf().toString())) {
    //                         Entry.findByIdAndDelete(existingEntry._id)
    //                         .then(deleted => {
    //                             console.log("deleted entry " + deleted._id);
    //                         }).catch(err => {
    //                             console.log(err);
    //                         })
    //                     }
    //                 }
    //             }
    //         }).catch(err => {
    //             console.log(err);
    //         })
    //     }

    //     for (let entryObj of pageObj.entries) {
    //         const entry = new Entry({
    //             _id: entryObj._id,
    //             page: page._id,
    //             type: entryObj.type,
    //             style: entryObj.style,
    //             width: entryObj.width,
    //             height: entryObj.height,
    //             fonts: entryObj.fonts,
    //             colours: entryObj.colours,
    //             images: entryObj.images,
    //             texts: entryObj.texts,
    //             sections: entryObj.sections
    //         });

    //         if (entry._id === undefined) {
    //             entry._id = new mongoose.Types.ObjectId();
    //             entry.isNew = true;
    //         } else {
    //             entry.isNew = false;
    //         }

    //         //Regardless of whether the page's entries are new or not new, we want to add it in the order it was given to us into page refs.
    //         //Furthermore, this will allow us to handle deleted entries.
    //         page.entries.push(entry._id) 

    //         entries.push(entry);
    //     }
    //     //page.markModified("entries"); //Need to mark to enact changes to array contents.

    //     pages.push([page, entries]); //new entries for each page is pushed to temp pages array

    //     //Regardless of whether the page is new or not new, we want to add it in the order it was given to us into page refs
    //     //Furthermore, this will allow us to handle deleted pages.
    //     portfolio.pages.push(page._id); 
    // }

    //portfolio.markModified("pages"); //Need to mark to enact changes to array contents.
    
    //Mongoose will still throw a duplicate key error with error code E11000 even if isNew is specified manually. Need to resolve.
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
                            return res.status(400).send("error encountered");
                        });
                    }

                    return res.status(200).json({ message: "user created and portfolio created for user.", _id: portfolio._id });
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
        
        for (let pageId of deletedPortfolio.pages) {
            await Page.findByIdAndDelete(pageId)
            .then(async (deletedPage) => {
                console.log("deleted page");
                for (let pageId of deletedPage.entries) {
                    await Entry.findByIdAndDelete(pageId)
                    .then((deletedEntry) => {
                        console.log("deleted entry");
                    }).catch(err => {
                        console.log(err);
                        return res.status(400).send("error encountered");
                    })
                }

                return res.status(200).json({ message: `Successfully deleted Portfolio by id ${id}` });
            }).catch(err => {
                console.log(err)
                return res.status(400).send("error encountered");
            })
        }

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