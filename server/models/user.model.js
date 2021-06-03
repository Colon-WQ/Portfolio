import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    _id: Number,
    name: String,
    avatar: String,
    gravatar_id: String,
    portfolios: [{type: mongoose.Schema.Types.ObjectId, ref: 'portfolio'}]
})

let User = mongoose.model('user', UserSchema);

export default User;