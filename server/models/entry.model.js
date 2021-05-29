import mongoose from 'mongoose';

const EntrySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    page: {type: mongoose.Schema.Types.ObjectId, ref: 'page'},
    width: String,
    height: String,
    fonts: {type: Map, of: String},
    colours: {type: Map, of: String},
    images: {type: Map, of: String},
    texts: {type: Map, of: String},
    sections: [{
        images: {type: Map, of: String},
        texts: {type: Map, of: String}
    }]
})

let Entry = mongoose.model('entry', EntrySchema);

export default Entry;