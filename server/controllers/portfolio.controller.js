import express from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Portfolio from '../models/portfolio.model.js';
import Page from '../models/page.model.js';
import Entry from '../models/entry.model.js';


const router = express.Router();

/**
 * String of objectId of portfolio required. Get using objectId.valueOf()
 */
export const getPortfolio = async (req, res) => {
    const portfolio_id = req.params.id;
    console.log(portfolio_id);
    await Portfolio.findById(portfolio_id).populate({ path: "pages", populate: { path: 'entries' } }).exec()
    .then(portfolio => {
        if (portfolio == null) {
            return res.status(404).send("portfolio _id not found");
        } else {
            console.log("portfolio found. Pages populated");
            return res.status(200).json({ portfolio: portfolio });
        }
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
        .then(isExist => {
            if (isExist === null) {
                //Just In Case
                portfolio.isNew = true;
                user.portfolios.push(portfolio._id); //If portfolio is new, then add it in user's ref
            } else {
                portfolio.isNew = false;
                
                portfolio.pages = []; //Somehow this is necessary to make sure there are no duplicated page _id in pages.
                //I suspect that by setting isNew to false, mongoose just decides to add to contents of the pages array to the already existing pages array.

                //Have to delete pages that are not supposed to exist anymore.
                const dict = new Set();
                for (let requestPage of requestPortfolio.pages) {
                    if (requestPage._id !== undefined) {
                        dict.add(requestPage._id.valueOf());
                    }
                }
                
                for (let existingPage of isExist.pages) {
                    if (!dict.has(existingPage._id.valueOf().toString())) {
                        Page.findByIdAndDelete(existingPage._id)
                        .then(deleted => {
                            console.log("deleted page " + deleted._id);
                        }).catch(err => {
                            console.log(err);
                        })
                    }
                }
            }
        }).catch(err => {
            console.log(err);
        })
        
    }

    //user.markModified("portfolios"); //Need to mark to enact changes to array contents.

    const pages = []; //temp array for storing pages to be saved. Stored as such => [page, entries]
    
    for (let pageObj of requestPortfolio.pages) {

        const entries = []; //temp array for storing entries to be saved.

        const page = new Page({
            _id: pageObj._id,
            directory: pageObj.directory,
            portfolio: portfolio._id
        });

        if (page._id === undefined) {
            page._id = new mongoose.Types.ObjectId();
            page.isNew = true;
        } else {
            await Page.findById(page._id)
            .then(isExist => {
                if (isExist === null) {
                    //Just In Case
                    page.isNew = true;
                } else {
                    page.isNew = false;
                    page.entries = []; //Somehow this is necessary to make sure there are no duplicated entry _id in entries as well.
                    //I suspect that by setting isNew to false, mongoose just decides to add to contents of the entries array to the already existing entries array.

                    //Have to delete entries that are not supposed to exist anymore.
                    const dict = new Set();
                    for (let requestEntry of pageObj.entries) {
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
                }
            }).catch(err => {
                console.log(err);
            })
        }

        for (let entryObj of pageObj.entries) {
            const entry = new Entry({
                _id: entryObj._id,
                page: page._id,
                type: entryObj.type,
                style: entryObj.style,
                width: entryObj.width,
                height: entryObj.height,
                fonts: entryObj.fonts,
                colours: entryObj.colours,
                images: entryObj.images,
                texts: entryObj.texts,
                sections: entryObj.sections
            });

            if (entry._id === undefined) {
                entry._id = new mongoose.Types.ObjectId();
                entry.isNew = true;
            } else {
                entry.isNew = false;
            }

            //Regardless of whether the page's entries are new or not new, we want to add it in the order it was given to us into page refs.
            //Furthermore, this will allow us to handle deleted entries.
            page.entries.push(entry._id) 

            entries.push(entry);
        }
        //page.markModified("entries"); //Need to mark to enact changes to array contents.

        pages.push([page, entries]); //new entries for each page is pushed to temp pages array

        //Regardless of whether the page is new or not new, we want to add it in the order it was given to us into page refs
        //Furthermore, this will allow us to handle deleted pages.
        portfolio.pages.push(page._id); 
    }

    //portfolio.markModified("pages"); //Need to mark to enact changes to array contents.
    
    //Mongoose will still throw a duplicate key error with error code E11000 even if isNew is specified manually. Need to resolve.
    await user.save()
    .then(async () => {   
        await portfolio.save()
        .then(async () => {

            for (let page of pages) {
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

export default router;