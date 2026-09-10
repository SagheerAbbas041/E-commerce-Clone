const userModel = require("../../models/userModel");

async function userDetailsController(req, res) {
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: "User not authenticated",
                error: true,
                success: false
            });
        }

        const user = await userModel.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            data: user,
            error: false,
            success: true,
            message: "User details fetched successfully"
        });

    } catch (err) {
        return res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = userDetailsController;