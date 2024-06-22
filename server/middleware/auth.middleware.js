import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async(req,res,next) => {
    try {
        // to check if there is access token of user
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        console.log(token);
        // if no token, throw error
        if(!token){
            throw new ApiError (401, "Unauthorized request");
        }
    
        // if token is there, check if its valid
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")  // here, _id is name we gave to id while generating jwt token in user model
    
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;  // stored user into object user in req
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
};