import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if(!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
}
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log("Using existing MongoDB connection");
        return mongoose.connection;
    }

    try{
        await mongoose.connect(MONGODB_URI, {
            dbName: "personal-finance-visualizer",
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000
        });
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1)
    }
};

export {connectDB}