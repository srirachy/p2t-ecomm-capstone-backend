import mongoose from 'mongoose';

export const PRODUCT_CATEGORIES = ['Single Card', 'Full Deck', `Collector's Item`];

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    categories: {
        type: [String],
        required: true,
        validate: {
            validator: function(categories) {
                return categories.length > 0 && categories.every(category => PRODUCT_CATEGORIES.includes(category));
            },
            message: props => `Invalid categories: ${props.value}`,
        }
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
