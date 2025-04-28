import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const DB_URI = process.env.DB_URI;
const connect = async(req, res) => {
    try{
        await mongoose.connect(DB_URI);
        console.log("mongoDB Connect Successfully !")
    }catch(error){
        console.log(error);
    }
}
    
export default connect