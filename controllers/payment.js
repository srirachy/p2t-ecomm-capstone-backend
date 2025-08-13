import Stripe from 'stripe';
import { getUserIdSanitized } from '../utils/index.js';

const stripe = Stripe(process.env.STRIPE_SK);

export const createCheckoutSession = async (req, res) => {
            

    try {
        const { items } = req.body;
        const userId = getUserIdSanitized(req.auth?.payload?.sub);

        if (userId) {
            const lineItems = items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.product.name,
                        // metadata: {
                        //     productId: item.product._id.toString(),
                        // }
                    },
                    unit_amount: item.product.price * 100,
                },
                quantity: item.quantity,
            }));

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URI}/success?session_id={CHECKOUT_SESSION_ID}&user_id=${userId}`,
                cancel_url: `${process.env.FRONTEND_URI}/cancel`,
                shipping_address_collection: {
                    allowed_countries: ['US'],
                },
                billing_address_collection: 'required',
                // metadata: {
                //     orderId: order._id.toString(),
                // },
            });

            // console.log(lineItems[0].price_data.product_data.metadata);
            res.json({ id: session.id });
        }

        return !userId && res.status(404).json({ error: 'User not found. Failed to checkout.'});
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};