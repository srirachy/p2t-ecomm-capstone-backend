import Cart from '../schemas/Cart.js';
import Product from '../schemas/Product.js';
import { getUserIdSanitized } from '../utils/index.js';

const getOrCreateCart = async (userId) => {
    if (userId) {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
            return await cart.save();
        }
        return cart;
    } else {
        throw new Error('userId must be provided');
    }
}

export const getCart = async (req, res) => {
    try {
        let cart;
        const userId = getUserIdSanitized(req.auth?.payload?.sub);

        if (userId) {
            cart = await Cart.findOne({ user: userId }).populate('items.product');
        } 
        res.json(cart || { items: [] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: `Server error: ${err}` });
    }
};

export const addCartProduct = async (req, res) => {
    try{
        const userId = getUserIdSanitized(req.auth?.payload?.sub);
        const { productId, quantity } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const cart = await getOrCreateCart(userId);

        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            cart.items.push({ product: productId, quantity: quantity || 1 });
        }

        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.product');

        res.json(populatedCart);

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: `Server error: ${err}`})
    }
};

export const updateCartProduct = async (req, res) => {
    try{
        const userId = getUserIdSanitized(req.auth?.payload?.sub);
        const { id: productId , quantity } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const cart = await getOrCreateCart(userId);

        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        item.quantity = quantity;

        if (item.quantity <= 0) {
            cart.items = cart.items.filter(i => i.product.toString() !== productId);
        }

        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.product');
        res.json(populatedCart);

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: `Server error: ${err}`})
    }
};

export const removeCartProduct = async (req, res) => {
     try {
        const { id } = req.params;
        const userId = getUserIdSanitized(req.auth?.payload?.sub);

        const userCart = await Cart.findOne({ user: userId });
        if (!userCart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const initialItemCount = userCart.items.length;
        userCart.items = userCart.items.filter(item => !item.product.equals(id));
        
        if (userCart.items.length === initialItemCount) {
        return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        userCart.total = userCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        userCart.updatedAt = new Date();

        await userCart.save();

        res.json({
            success: true,
            message: 'Item removed from cart successfully',
            cart: {
                total: userCart.total,
                itemCount: userCart.items.length
            }
        });

    } catch (error) {
        console.error('Remove item error:', error);
        res.status(500).json({
        success: false,
        message: 'Server error removing item',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = getUserIdSanitized(req.auth?.payload?.sub);

        const cart = await getOrCreateCart(userId);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = [];
        await cart.save();

        res.json({ message: 'Cart cleared successfully' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: `Server error: ${err} `});
    }
};
