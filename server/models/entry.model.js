import mongoose from 'mongoose';

const EntrySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    page: {type: mongoose.Schema.Types.ObjectId, ref: 'page'},
    text: String,
    img1: String,
    img2: String,
    img3: String,
    img4: String,
    primaryColour: String,
    secondaryColour: String,
    backgroundColour: String,
    link1: String,
    link2: String,
    link3: String,
    link4: String,
    primaryFontFamily: String,
    secondaryFontFamily: String
})

let Page = mongoose.model('page', PageSchema);

export default Page;