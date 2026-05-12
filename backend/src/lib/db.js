import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
    try {
        if(!ENV.DB_URL){
            throw new Error("DB URL is not defined in enviorment variables");
        }
        const conn = await mongoose.connect(ENV?.DB_URL)
        console.log("✅ Connected to MongoDb",conn.connection.host);
    } 
    catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1); // 1 means fail 0 mean success

    }
}