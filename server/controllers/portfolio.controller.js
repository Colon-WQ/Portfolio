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
 * user object requires id, name, login, avatar, gravatar_id variables.
 * portfolio object requires name, pages (pages is an array)
 * 
 * Each element (object) of pages array must be of form { route: string, entries: [entry, entry, ... ] }
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
        login: requestUser.login,
        avatar: requestUser.avatar,
        gravatar_id: requestUser.gravatar_id
    })

    const portfolio = new Portfolio({
        _id: new mongoose.Types.ObjectId(),
        name: requestPortfolio.name,
        user: requestUser.id
    })

    user.portfolios = [portfolio._id]; 

    const pages = []; //temp array for storing pages to be saved. Stored as such => [page, entries]
    
    const pages_id = []; //temp array for storing _id of pages for variable pages of portfolio model.

    for (let pageObj of requestPortfolio.pages) {

        const entries = []; //temp array for storing entries to be saved.
        const entries_id = []; //temp array for storing _id of entries for variable entries of page model.

        const page = new Page({
            _id: new mongoose.Types.ObjectId(),
            route: pageObj.route,
            portfolio: portfolio._id
        });

        for (let entryObj of pageObj.entries) {
            const entry = new Entry({
                _id: new mongoose.Types.ObjectId(),
                page: page._id,
                width: entryObj.width,
                height: entryObj.height,
                fonts: entryObj.fonts,
                colours: entryObj.colours,
                images: entryObj.images,
                texts: entryObj.texts,
                sections: entryObj.sections
            });

            entries.push(entry);
            entries_id.push(entry._id);
        }

        page.entries = entries_id;

        pages.push([page, entries]);
        pages_id.push(page._id);
    }
    
    portfolio.pages = pages_id;
    
    user.setOptions({ upsert: true }).update((err) => {
        if (err) return res.status(400).send("error encountered");
            
        portfolio.setOptions({ upsert: true }).update((err) => {
            if (err) return res.status(400).send("error encountered");

            for (let page of pages) {
                //first element will be the page to be saved, second element is the entries to be saved for that page
                page[0].setOptions({ upsert: true }).update((err) => {
                    if (err) return res.status(400).send("error encountered");

                    for (let entry of page[1]) {
                        entry.setOptions({ upsert: true }).update((err) => {
                            if (err) return res.status(400).send("error encountered");
                            continue;
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
    User.findOne({ _id: gh_id }).exec((err, user) => {
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