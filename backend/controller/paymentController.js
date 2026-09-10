const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const userModel = require("../models/userModel");

// backend/controller/order/paymentController.js

const paymentController = async (req, res) => {
    try {
        const { cartItems, currency = 'usd' } = req.body;

        // 1. Validate Cart Empty State
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({
                message: "Cart is empty",
                error: true,
                success: false
            });
        }

        const user = await userModel.findOne({ _id: req.userId });

        // Zero-Decimal Currencies list
        const zeroDecimalCurrencies = ['jpy', 'krw', 'clp', 'pyg', 'rwf', 'ugx', 'vnd', 'bif', 'gnf', 'kmf', 'mga', 'vuv', 'xaf', 'xof', 'xpf'];
        const isZeroDecimal = zeroDecimalCurrencies.includes(currency.toLowerCase());

        // 2. Safe Line Items Mapping
        const line_items = cartItems.map((item) => {
            const productName = item?.productId?.productName || item?.productName || "Cart Product";
            const productImage = item?.productId?.productImage?.[0] || item?.productImage?.[0] || "";
            const priceAmount = Number(item?.productId?.sellingPrice || item?.sellingPrice || 0);

            return {
                price_data: {
                    currency: currency.toLowerCase(),
                    product_data: {
                        name: productName,
                        images: productImage ? [productImage] : [],
                        metadata: {
                            productId: item?.productId?._id || item?._id
                        }
                    },
                    unit_amount: isZeroDecimal ? Math.round(priceAmount) : Math.round(priceAmount * 100)
                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1
                },
                quantity: item?.quantity || 1
            };
        });

        // 3. Checkout Parameters (Removed invalid automatic_payment_methods)
        const params = {
            submit_type: 'pay',
            mode: 'payment',
            billing_address_collection: 'auto',
            shipping_address_collection: {
                allowed_countries: [
                    'PK', 'US', 'CA', 'GB', 'AE', 'IN', 'SA', 'AU', 'DE', 'FR', 
                    'IT', 'ES', 'NL', 'SE', 'NO', 'CH', 'QA', 'KW', 'OM', 'BH', 
                    'BD', 'SG', 'MY', 'JP', 'KR', 'CN', 'HK', 'NZ', 'EG', 'ZA', 'MX', 'BR'
                ]
            },
            customer_email: user?.email,
            metadata: {
                userId: req.userId
            },
            line_items: line_items,
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        };

        const session = await stripe.checkout.sessions.create(params);

        return res.status(200).json({
            success: true,
            url: session.url,
            id: session.id
        });

    } catch (err) {
        return res.status(500).json({
            message: err?.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = paymentController;