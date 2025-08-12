import Order from '../schemas/Order.js';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SK);

export const createOrder = async (req, res) => {
    try {
        // console.log(req.params);
        const sessionId = req.params.id;
        const session = await stripe.checkout.sessions.retrieve(
            sessionId,
        );

        const line_items = await stripe.checkout.sessions.listLineItems(
            sessionId
        );

        if (session && line_items) {
            const items = line_items.data;
        }

        const address = session.customer_details.address;
        console.log(session);
        console.log(address);
        console.log(line_items);
        res.json('yo');
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: `Server error: ${err}`})
    }
//     const session = await stripe.checkout.sessions.retrieve(
//     sessionId,
//   { expand: ['customer', 'shipping_details'] }
// );
    
};

export const getUserOrders = () => {};

export const getOrderById = () => {};

export const getAllOrders = () => {};

export const updateOrderPay = () => {};

export const updateOrderShip = () => {};

// const session = await stripe.checkout.sessions.retrieve(
//   sessionId,
//   { expand: ['customer', 'shipping_details'] }
// );

// const shippingAddress = session.shipping_details.address;