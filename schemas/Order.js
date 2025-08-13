import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    // product: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'Product',
    // },
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
}, { _id: false });

// const paymentResultSchema = new mongoose.Schema({
//     id: { type: String },
//     status: { type: String },
//     update_time: { type:String },
//     email_address: { type: String },
// }, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
        type: String,
        required: true,
        enum: ['card', 'stripe'],
        default: 'card',
    },
    // paymentResult: paymentResultSchema,
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isDeliver: {
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
    stripePaymentIntentId: {
        type: String,
    },
    stripeSessionId: {
        type: String,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

orderSchema.index({ user: 1 });
orderSchema.index({ isPaid: 1 });
orderSchema.index({ isDelivered: 1 });
orderSchema.index({ createdAt: -1 });

orderSchema.virtual('orderNumber').get(function(){
    return `ORDER-${this._id.toString().substring(18, 24).toUpperCase()}`;
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
