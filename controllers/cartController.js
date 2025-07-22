import Cart from '../schemas/Cart.js';

const getOrCreateCart = async (userId, guestId) => {
    let cart;

    if (userId) {
        cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
            return await cart.save();
        }
    } else if (guestId) {
        cart = await Cart.findOne({ guestId });
        if (!cart) {
            cart = new Cart({ guestId, items: [] });
            return await cart.save();
        }
    } else {
        throw new Error('Either userId or guestId must be provided');
    }

    return null;
}

export const getCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const guestId = req.cookies.guestId;

        let cart;

        if (userId) {
            cart = await Cart.findOne({ user: userId }).populate('items.product');
        } else if (guestId) {
            cart = await Cart.findOne({ guestId }).populate('items.product');
        }

        res.json(cart || { items: [] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: `Server error: ${err}` });
    }
};

export const addCartProduct = async (req, res) => {
    try{

        const { productId, quantity } = req.body;
        const userId = req.user?._id;
        const guestId = req.cookies.guestId || req.body.guestId;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const cart = await getOrCreateCart(userId, guestId);

        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            cart.items.push({ product: productId, quantity: quantity || 1 });
        }

        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.product');

        if (!userId && !req.cookies.guestId) {
            res.cookie('guestId', guestId, {
                maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
                httpOnly: true
            });
        }

        res.json(populatedCart);

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: `Server error: ${err}`})
    }
};

export const updateCartProduct = async (req, res) => {
    try{

        const { productId, quantity } = req.body;
        const userId = req.user?._id;
        const guestId = req.cookies.guestId || req.body.guestId;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const cart = await getOrCreateCart(userId, guestId);

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

export const clearCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const guestId = req.cookies.guestId;

        const cart = await getOrCreateCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = [];
        await cart.save();

        res.json({ message: 'Cart cleared successfully' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: `Server error: ${err} `});
    }
};

export const mergeCarts = async (userId, guestId) => {
    try {
        const guestCart = await Cart.findOne({ guestId }).populate('items.product');
        const userCart = await Cart.findOne({ user: userId }).populate('items.product');

        if (guestCart && guestCart.items.length > 0) {
            if(userCart) {
                for (const guestItem of guestCart.items) {
                    const existingItem = userCart.items.find(
                        item => item.product_id.toString() === guestItem.product._id.toString()
                    );

                    if(existingItem) {
                        existingItem.quantity += guestItem.quantity;
                    } else {
                        userCart.items.push(guestItem);
                    }
                }

                await userCart.save();
                await Cart.deleteOne({ guestId });
                return userCart;
            } else {
                guestCart.user = userId;
                guestCart.guestId = undefined;
                await guestCart.save();
                return guestCart;
            }
        }

        return userCart || guestCart;
    } catch (err) {
        console.error('Error merging carts:', err);
        throw err;
    }
}