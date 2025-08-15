import Order from '../schemas/Order.js';
import Stripe from 'stripe';
import { getUserIdSanitized } from '../utils/index.js';

const stripe = Stripe(process.env.STRIPE_SK);

export const createOrder = async (req, res) => {
    try {
        const sessionId = req.params.sessionid;
        const userId = req.params.userid;
        const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
        
        if (existingOrder) {
            return res.status(409).json({ message: 'Order already exists' });
        }

        const session = await stripe.checkout.sessions.retrieve(
            sessionId,
        );

        const line_items = await stripe.checkout.sessions.listLineItems(
            sessionId
        );

        if (session && line_items) {
            const items = line_items.data;
            const address = session.collected_information.shipping_details.address;
            const paymentType = session.payment_method_types[0];
            const itemsPrice = session.amount_subtotal;
            const taxPrice = session.total_details.amount_tax;
            const shippingPrice = session.total_details.amount_shipping;
            const isPaid = session.payment_status === 'paid' ? true : false;
            const paidAt = session.created;
            const isDeliver = false;
            const stripePaymentIntentId = session.payment_intent;
            const totalPrice = itemsPrice + taxPrice + shippingPrice;

            const order = new Order({
                user: userId,
                orderItems: items.map(item => ({
                    name: item.description,
                    price: item.price.unit_amount / 100,
                    quantity: item.quantity,
                })),
                shippingAddress: {
                    address: address.line2 === null ? `${address.line1}` : `${address.line1} ${address.line2}`,
                    city: address.city,
                    postalCode: address.postal_code,
                    country: address.country,
                },
                paymentMethod: paymentType,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                isPaid,
                paidAt,
                isDeliver,
                deliveredAt: isDeliver ? new Date() : undefined,
                stripePaymentIntentId,
                stripeSessionId: sessionId,
            });

            const newOrder = await order.save(); 
            res.json(newOrder);
        } else {
            res.status(400).json({ message: 'Invalid session or no order items' });
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: `Server error: ${err}`})
    }
};

export const getUserOrders = async (req, res) => {
    const userId = getUserIdSanitized(req.auth?.payload?.sub);

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.json(orders);
};

export const getOrderById = async (req, res) => {
    const { 
        // orderId,
        orderNum, 
        isAdmin 
    } = req.body
    // const order = await Order.findById(orderId).populate('user', 'name email');
    const order = await Order.find({ orderNumber: orderNum }).populate('user', 'name email');

    if (order) {
        if(order.user._id.toString === orderId.toString() || isAdmin) {
            res.json(order);
        } else {
            res.status(401).json('Not authorized to view this order');
        }
    } else {
        res.status(404).json('Order not found');
    }
};

export const getAllOrders = async (_req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
};

export const updateOrderDeliver = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const order = await Order.findById(sessionId);

        if (order) {
            order.isDeliver = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json('Order not found');
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: `Server error: ${err}`})
    }
};
