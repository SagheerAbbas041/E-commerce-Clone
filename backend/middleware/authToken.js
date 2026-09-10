const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        // Pehle cookie check karein, agar cookie Na mile toh Authorization Header check karein
        const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Please Login...!",
                error: true,
                success: false
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Session expired, please login again",
                    error: true,
                    success: false
                });
            }

            req.userId = decoded?._id;
            next();
        });

    } catch (err) {
        return res.status(400).json({
            message: err.message || err,
            data: [],
            error: true,
            success: false
        });
    }
}

module.exports = authToken;