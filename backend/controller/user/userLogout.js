async function userLogout(req, res) {
    try {
        const isProduction = process.env.NODE_ENV === "production";

        const tokenOption = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/'
        };

        // Past expiry set karke cookie browser storage se forces-delete karein
        res.cookie("token", "", { 
            ...tokenOption, 
            expires: new Date(0), 
            maxAge: 0 
        });

        res.clearCookie("token", tokenOption);

        return res.status(200).json({
            message: "Logged out successfully",
            error: false,
            success: true,
            data: []
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = userLogout;