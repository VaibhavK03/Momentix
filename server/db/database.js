import mongoose from "mongoose";

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect("mongodb+srv://vaibhavkhamkar03:XVpOV7zlBBbWUzmN@cluster0.0unum5b.mongodb.net/");
        console.log('MongoDB connected');
    }catch(error){
        console.error(error);
    }
}

export default connectDB;