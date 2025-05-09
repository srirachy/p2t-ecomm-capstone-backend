import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    idAuth0: {type: String, required: true, unique: true}, 
    email: {type: String, unique: true},
    name: String,
    profilePic: String,
    shippingAddresses: [{
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        isDefault: Boolean,
    }],
    phoneNum: String,
    paymentMethods: [{
        provider: String,   // 'stripe'
        tokenId: String,    // payment method ID from stripe
    }],
    lastActive: Date,
},
    {
        timestamps: true
    },
);

const User = mongoose.model('User', userSchema);

export default User;
