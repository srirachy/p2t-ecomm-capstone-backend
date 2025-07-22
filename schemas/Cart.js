import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
});

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    guestId: { type: String, required: false },
    items: [cartItemSchema],
    createdAt: { type: Date, default: Date.now, expires: '30d' },
});

cartSchema.index({ user: 1 }, { unique: true, partialFilterExpression: { user: { $exists: true }}});
cartSchema.index({ guestId: 1 }, { unique: true, partialFilterExpression: { guestId: { $exists: true }}});

module.exports = mongoose.model('Cart', cartSchema);
