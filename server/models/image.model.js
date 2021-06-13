import mongoose from 'mongoose';

const ImageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    filename: { type: String, required: true },
    fileId: { type: String, required: true },
    label: { type: String, required: true },
    portfolio: {type: mongoose.Schema.Types.ObjectId, ref: 'portfolio'},
    createdAt: { default: Date.now(), type: Date }
})

let Image = mongoose.model('image', ImageSchema);

export default Image;