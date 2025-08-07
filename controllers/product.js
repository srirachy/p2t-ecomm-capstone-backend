import { v2 as cloudinary } from 'cloudinary';
import Product, { PRODUCT_CATEGORIES } from '../schemas/Product.js';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getProducts = async (req, res) => {
    try {
        const { categories } = req.query;
        const filter = {};

        if (categories) filter.categories = categories;

        const products = await Product.find(filter);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const createProduct = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No images uploaded' });
        }
        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'capstone' },
                    (error, result) => {
                        if (error) reject (error);
                        else resolve({
                            url: result.secure_url,
                            altText: file.originalname
                        });
                    }
                );

                stream.end(file.buffer);
            });
        });

        const uploadImages = await Promise.all(uploadPromises);
        const shortDesc = req.body.longDescription.length < 157 ? req.body.longDescription : `${req.body.longDescription.substring(0, 157)}...`;
        const product = new Product({
            ...req.body,
            images: uploadImages,
            shortDescription: shortDesc,
        });
        console.log(product);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if(!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getCategory = async (_req, res) => {
    try {
        res.status(200).json(PRODUCT_CATEGORIES);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}