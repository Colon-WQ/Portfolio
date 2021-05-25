import mongoose from 'mongoose';

//TODO: Add image to mongodb schema
const PortfolioSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    pages: [{type: mongoose.Schema.Types.ObjectId, ref: 'page'}]
})

let Portfolio = mongoose.model('portfolio', PortfolioSchema);

export default Portfolio;