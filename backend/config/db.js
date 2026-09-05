const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        
        isConnected = db.connections[0].readyState;
        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
    }
}

module.exports = connectDB;