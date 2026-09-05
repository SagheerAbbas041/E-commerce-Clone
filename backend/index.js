const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')

const app = express()

// Dynamic Allowed Origins
const allowedOrigins = [
    "http://localhost:3000",
    "https://e-commerce-clone-alpha.vercel.app",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}))

// Handle preflight requests explicitly
app.options('*', cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser())

// Middleware: Ensure DB Connection for every serverless request on Vercel
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("Database connection failed:", err);
        res.status(500).json({ message: "Database connection failed", error: err.message });
    }
});

app.get("/", (req, res) => {
    res.status(200).json({
        message: "E-Commerce Backend Server is Running Smoothly!",
        status: "OK"
    });
});

app.use("/api", router)

const PORT = process.env.PORT || 5000

// Local Development listen logic
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log("Connect to DB & Server is running on port " + PORT)
    })
}

// Required for Vercel Serverless Deployment
module.exports = app;