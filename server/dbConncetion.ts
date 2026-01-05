import mongoose from "mongoose";

const DB_URL = "mongodb://127.0.0.1:27017/attendance";

export const connectDb=async()=>{
    try{
        await mongoose.connect(DB_URL);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

