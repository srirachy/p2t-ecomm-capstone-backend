import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    idAuth0: {type: String, required: true, unique: true}, //from auth0
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
        provider: String,   // 'stripe', 'paypal'
        tokenId: String,    // payment method ID from provider
    }],
    lastActive: Date,
},
    {
        timestamps: true
    },
);

const User = mongoose.model('User', userSchema);

export default User;
