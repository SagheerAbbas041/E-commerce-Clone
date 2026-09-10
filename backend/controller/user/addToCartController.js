const addToCartModel = require("../../models/cartProduct");

const addToCartController = async (req, res) => {
    try {
        const { productId } = req?.body;
        const currentUser = req.userId;

        // Check if user is logged in
        if (!currentUser) {
            return res.status(401).json({
                message: "Please Login to add product to cart!",
                error: true,
                success: false
            });
        }

        // Check if productId is provided
        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required",
                error: true,
                success: false
            });
        }

        const isProductAvailable = await addToCartModel.findOne({ 
            productId: productId, 
            userId: currentUser 
        });

        if (isProductAvailable) {
            return res.status(200).json({
                message: "Already exists in Add to cart",
                success: false,
                error: true
            });
        }

        const payload = {
            productId: productId,
            quantity: 1,
            userId: currentUser,
        };

        const newAddToCart = new addToCartModel(payload);
        const saveProduct = await newAddToCart.save();

        return res.status(200).json({
            data: saveProduct,
            message: "Product Added in Cart",
            success: true,
            error: false
        });

    } catch (err) {
        return res.status(500).json({
            message: err?.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = addToCartController;