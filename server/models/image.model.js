import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    caption: {
        required: true,
        type: String
    },
    createdAt: {
        default: Date.now(),
        type: Date
    }
})

let Image = mongoose.model('image', imageSchema);

export default Image;