import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        profilepicture: {
            type: String, // this stores url of image
            required: true
        },
        posts: [ 
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Post',
            },
        ],
        refreshToken: {
            type: String,
        }
    },
    { // (optional)  it gives us access to timestamps like createdAt and updatedAt 
        timestamps: true
    }
)

// logic for encrypting password using bcrypt (it will run this logic only if password field is modified)
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next()
})


// logic to check if password is correct (this is custom method created to write our logic)
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)   // password is one sent by user, and this.password is one in db to check if both are similar or not
    // it returns true if passwords match and false otherwise
}

// logic for access token (jwt)
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this.id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);