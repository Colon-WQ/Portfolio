import mongoose from 'mongoose';

const PageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    directory: { type: String, default: "/"},
    portfolio: {type: mongoose.Schema.Types.ObjectId, ref: 'portfolio'},
    entries: [{type: mongoose.Schema.Types.ObjectId, ref: 'entry'}]
})

let Page = mongoose.model('page', PageSchema);

export default Page;