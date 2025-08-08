import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
}, { _id: false });

const paymentResultSchema = new mongoose.Schema({
    id: { type: String },
    status: { type: String },
    update_time: { type:String },
    email_address: { type: String },
}, { _id: false });

const Order = mongoose.model('Order', orderSchema);

export default Order;
