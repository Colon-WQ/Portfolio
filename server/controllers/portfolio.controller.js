import express from 'express';
import mongoose from 'mongoose';
import FormData from 'form-data';
import axios from 'axios';
import User from '../models/user.model.js';
import Portfolio from '../models/portfolio.model.js';
import Page from '../models/page.model.js';
import Entry from '../models/entry.model.js';


const router = express.Router();

export const postPortfolio = async (req, res) => {}
export const savePortfolio = async (req, res) => {}
export const getPortfolio = async (req, res) => {
    // const user = await User.findOne({ _id: 12345}).populate('portfolios');
    // console.log(user.populated('portfolios'))
    // console.log(user)
    // Portfolio.findOne({ name: "hello" }).populate('user').exec(function(err, portfolio) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log(portfolio);
    //     console.log(portfolio.user.login);
    // });

    User.findOne({ _id: 12345 }).populate('portfolios').exec(function(err, user) {
        if (err) console.log(err);
        console.log(user);
        console.log(user.portfolios);
    })
    
}
export const createPortfolio = async (req, res) => {
    const user = new User({
        _id: 12345,
        name: "hello",
        login: "hello",
        avatar: "hello",
        gravatar_id: "hello"
    })
    

    const portfolio = new Portfolio({
        _id: new mongoose.Types.ObjectId(),
        name: "hello",
        user: user._id
    })

    user.portfolios = [portfolio._id];


    const page = new Page({
        _id: new mongoose.Types.ObjectId(),
        route: "/",
        portfolio: portfolio._id
    })

    portfolio.pages = [page._id];

    const entry = new Entry({
        _id: new mongoose.Types.ObjectId(),
        page: page._id,
        width: "hello",
        height: "hello",
        fonts: {one: "hello", two: "hello"},
        colours: {one: "hello", two: "hello"},
        images: {one: "hello", two: "hello"},
        texts: {one: "hello", two: "hello"},
        sections: [{
            images: {one: "hello", two: "hello"},
            texts: {one: "hello", two: "hello"}
        }]
    })

    page.entries = [entry._id];

    user.save(function(err) {
        if (err) console.log(err);
        portfolio.save(function(err) {
            if (err) console.log(err);
            page.save(function(err) {
                if (err) console.log(err);
                entry.save(function(err) {
                    if (err) console.log(err);
                    console.log("successfully saved");
                })
            })
        })
    
    })
}
export const getPortfolios = async (req, res) => {}
export const deletePortfolio = async (req, res) => {}

export default router;