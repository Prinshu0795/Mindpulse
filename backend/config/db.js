const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing in backend/.env file');
        }
        console.log('Attempting MongoDB connection...');
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error(`MongoDB connection failed: ${err.message}. Ensure MongoDB is running locally.`);
        throw err;
    }
};

module.exports = connectDB;
