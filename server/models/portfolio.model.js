import mongoose from 'mongoose';

//TODO: Add image to mongodb schema
const PortfolioSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, unique: true},
    user: {type: Number, ref: 'user'},
    pages: [{type: mongoose.Schema.Types.ObjectId, ref: 'page'}],
    images: [{type: mongoose.Schema.Types.ObjectId, ref: 'image'}]
})

let Portfolio = mongoose.model('portfolio', PortfolioSchema);

export default Portfolio;