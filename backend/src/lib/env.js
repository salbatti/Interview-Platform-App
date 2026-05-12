import dotenv from "dotenv";


dotenv.config({quiet:true})
//quiet : true means it doesnt show log

export const ENV ={
    PORT : process.env.PORT,
    DB_URL:process.env.DB_URL,
    NODE_ENV:process.env.NODE_ENV
}