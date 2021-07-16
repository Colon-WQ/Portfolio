import mongoose from 'mongoose';


const PageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    directory: { type: String, default: "/"},
    //Need to convert directories at each page into array first. will have to convert back later.
    directories: { type: Map, of: {type: mongoose.Schema.Types.ObjectId, ref: 'page'} },
    portfolio: {type: mongoose.Schema.Types.ObjectId, ref: 'portfolio'},
    entries: [{type: mongoose.Schema.Types.ObjectId, ref: 'entry'}],
    backgroundColour: { type: String, default: "#fff"},
})

let Page = mongoose.model('page', PageSchema);

export default Page;