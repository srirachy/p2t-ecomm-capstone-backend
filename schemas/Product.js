import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    category: {
        type: String,
        required: true,
        enum: ['Single Card', 'Full Deck', `Collector's Item`]
    },
    images: [{
        url: String,
        altText: String,
    }],
    shortDescription: { type: String, maxlength: 160 },
    longDescription: { type: String },
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema);

export default Product;
