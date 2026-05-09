import express from "express";
import { ENV } from "./lib/env.js";


const app= express ();

console.log(process.env.PORT);



app.get("/",(req,res)=>{
    res.status(200).json({msg:"success from api"})
})



app.listen(ENV.PORT,()=>{
    console.log(`Server is running ${ENV.PORT}`);
    
})