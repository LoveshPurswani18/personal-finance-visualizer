import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if(!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
}
const connectDB = async () => {
    // if (mongoose.connection.readyState >= 1) {
    //     return;
    // }
    
    try{
        await mongoose.connect(MONGODB_URI, {
            dbName: "personal-finance-visualizer",
        });
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.log("Error connecting to MongoDB", error);
    }
};

export {connectDB}