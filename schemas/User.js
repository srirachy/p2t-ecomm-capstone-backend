import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {},
    email: {},
    password: {},
    isAdmin: {},
},
    {
        timestamps: true
    },
);

const User = mongoose.model('User', userSchema);

export default User;