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
    Portfolio.findById(portfolio_id).populate({ path: "pages", populate: { path: 'entries' } }).exec((err, portfolio) => {
        if (err) {
            console.log(err);
            return res.status(400).send("error encountered");
        } else {
            if (portfolio == null) {
                return res.status(404).send("portfolio _id not found");
            } else {
                console.log("portfolio found. Pages populated");
                console.log(portfolio);
                return res.status(200).json({ portfolio: portfolio });
            }
        }
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

    const user = new User({
        _id: requestUser.id,
        name: requestUser.name,
        avatar: requestUser.avatar,
        gravatar_id: requestUser.gravatar_id
    })

    await User.findById(requestUser.id).exec()
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
        portfolio._id = new mongoose.Types.ObjectId();
        portfolio.isNew = true;
    } else {
        await (Portfolio.findById(portfolio._id)).exec()
        .then(isExist => {
            if (err) console.log(err);
            if (isExist === null) {
                //Just In Case
                portfolio.isNew = true;
            } else {
                portfolio.isNew = false;
                portfolio.pages = isExist.pages;
            }
        }).catch(err => {
            console.log(err);
        })
        
    }


    user.portfolios.push(portfolio._id);
    //user.portfolios = [portfolio._id]; Need to manually add the arrays

    user.markModified("portfolios"); //Need to mark to enact changes to array contents.

    const pages = []; //temp array for storing pages to be saved. Stored as such => [page, entries]
    
    const pages_id = []; //temp array for storing _id of pages for variable pages of portfolio model.

    for (let pageObj of requestPortfolio.pages) {

        const entries = []; //temp array for storing entries to be saved.
        const entries_id = []; //temp array for storing _id of entries for variable entries of page model.

        const page = new Page({
            _id: pageObj._id,
            directory: pageObj.directory,
            portfolio: portfolio._id
        });

        if (page._id === undefined) {
            page._id = new mongoose.Types.ObjectId();
            page.isNew = true;
        } else {
            await (Page.findById(page._id)).exec()
            .then(isExist => {
                if (err) console.log(err);
                if (isExist === null) {
                    //Just In Case
                    page.isNew = true;
                } else {
                    page.isNew = false;
                    page.entries = isExist.entries;
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

            entries.push(entry);
            entries_id.push(entry._id);
        }

        for (let entryId of entries_id) {
            page.entries.push(entryId);
        }
        page.markModified("entries"); //Need to mark to enact changes to array contents.


        // page.entries = entries_id; //Need to manually update refs

        pages.push([page, entries]); //new entries for each page is pushed to temp pages array
        pages_id.push(page._id);
    }
    
    for (let pageId of pages_id) {
        portfolio.pages.push(pageId);
    }
    //portfolio.pages = pages_id;  //Need to manually add to refs

    portfolio.markModified("pages"); //Need to mark to enact changes to array contents.
    
    //Mongoose will still throw a duplicate key error with error code E11000 even if isNew is specified manually. Need to resolve.
    user.save((err) => {
        if (err && err.code !== 11000) return res.status(400).send(err);
            
        portfolio.save((err) => {
            if (err && err.code !== 11000) return res.status(400).send(err);

            for (let page of pages) {
                //first element will be the page to be saved, second element is the entries to be saved for that page
                page[0].save((err) => {
                    if (err && err.code !== 11000) return res.status(400).send(err);

                    for (let entry of page[1]) {
                        entry.save((err) => {
                            if (err && err.code !== 11000) return res.status(400).send("error encountered");

                            console.log("entry saved/updated")
                        });
                    }
                })
            }
        })

        return res.status(200).json({ message: "user created and portfolio created for newly created user."});
    })
    
}

/**
 * getPortfolios will get an array of ObjectIds from mongodb representing the portfolios
 * request requires query param id that is the user's unique github id.
 */
export const getPortfolios = async (req, res) => {
    const gh_id = req.query.id;
    User.findById(gh_id).populate("portfolios").exec((err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).send("error encountered");
        } else {
            if (user == null) {
                console.log("user id not found");
                return res.status(404).send("User id not found");
            } else {
                console.log("user portfolios found");
                return res.status(200).json({ portfolios: user.portfolios });
            }
        }
    })
}

/**
 * The request params should contain _id of portfolio to be deleted as id
 */
export const deletePortfolio = async (req, res) => {
    
    const id = req.params.id;

    Portfolio.findByIdAndDelete(id, (err, deleted) => {
        if (err) {
            console.log(err)
            return res.status(400).send("error encountered");
        } else {
            console.log("deleted: ", deleted);
            return res.status(200).json({ message: `Successfully deleted Portfolio by id ${id}`, deleted: deleted })
        }
    });
}

export default router;