// backend/controller/order/orderListController.js
const orderModel = require('../../models/orderProductModel');

const orderListController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const orderList = await orderModel.find({ userId: currentUserId }).sort({ createdAt: -1 });

        return res.status(200).json({
            data: orderList,
            message: "Order list fetched successfully",
            success: true,
            error: false
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

module.exports = orderListController;