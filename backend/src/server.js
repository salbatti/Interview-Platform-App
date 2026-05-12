import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { connectDB } from "./lib/db.js";

const app = express();

console.log(process.env.PORT);

const __dirname = path.resolve()


app.get("/c", (req, res) => {
    res.status(200).json({ msg: "c poiny" })
})

// make our app raeady for deployment

if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}




const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log(`Server is running ${ENV.PORT}`);
            
        })
    } catch (error) {
        console.log("💥💥 Error starting the server",err);
        
    }
}

startServer()