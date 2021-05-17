import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: String,
    login: String,
    id: String,
    avatar: String,
    gravatar_id: String
    // TODO: might add portfolio as part of user
})

let User = mongoose.model('User', userSchema);

export default User;