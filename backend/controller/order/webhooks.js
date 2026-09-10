// backend/controller/order/webhooks.js
const stripe = require('../../config/stripe');
const orderModel = require('../../models/orderProductModel');
const addToCartModel = require('../../models/cartProduct');

const webhooks = async (request, response) => {
    try {
        const { sessionId } = request.body;

        if(!sessionId){
            return response.status(400).json({ message: "Session ID is required", error: true });
        }

        // Stripe session aur expanded line items retrieve karein
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
            expand: ['data.price.product']
        });

        // Duplicate order check
        const existingOrder = await orderModel.findOne({ "paymentDetails.paymentId": session.payment_intent });
        if (existingOrder) {
            return response.status(200).json({ message: "Order already saved", success: true });
        }

        // Product items mapping
        const productDetails = lineItems.data.map(item => {
            return {
                productId: item.price.product.metadata?.productId || item.id,
                name: item.description,
                image: item.price.product.images ? item.price.product.images[0] : "",
                price: item.price.unit_amount / 100, // Cents to Dollars/Rupees
                quantity: item.quantity
            };
        });

        const payload = {
            productDetails: productDetails,
            email: session.customer_email,
            userId: session.metadata.userId,
            paymentDetails: {
                paymentId: session.payment_intent,
                payment_status: session.payment_status
            },
            totalAmount: session.amount_total / 100
        };

        const order = new orderModel(payload);
        await order.save();

        // Cart clear karein
        if (session.metadata.userId) {
            await addToCartModel.deleteMany({ userId: session.metadata.userId });
        }

        return response.status(200).json({
            message: "Order placed successfully",
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
};

module.exports = webhooks;