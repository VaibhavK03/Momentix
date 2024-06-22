import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken(); // generateAccessToken is method from user model which generates access token
    const refreshToken = user.generateRefreshToken(); // generateRefreshToken is method from user model which generates refresh token

    user.refreshToken = refreshToken; // stored refreshToken in db
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const registerUser = async (req, res) => {
  try {
    // get user details from frontend
    const { username, email, password, fullname } = req.body; // get data from req.body, which is our UI/frontend
    
    // check if required fields are there
    // validation - input is not empty
    if (fullname === "") throw new ApiError(400, "fullname is required");
    if (username === "") throw new ApiError(400, "username is required");
    if (email === "") throw new ApiError(400, "email is required");
    if (password === "") throw new ApiError(400, "password is required");
    
    // check if user already exist by email in db
    const existedUser = await User.findOne({
      email: email, 
    });

    //if exists show this error
    if (existedUser) {
      throw new ApiError(
        409,
        "user with this email or username already exists"
      );
    }

    // if user sets profile picture then upload to cloudinary
    // req.files is given by multer
    const profilepictureLocalPath = req.files?.profilepicture[0]?.path; // to get path of uploaded file // already written code to upload in multer.middleware.js

    console.log(profilepictureLocalPath);

    //if profile picture is not set then throw error
    if (!profilepictureLocalPath) {
      throw new ApiError(400, "Profile picture path is required");
    }

    // upload profile picture to cloudinary
    const profilepicture = await uploadOnCloudinary(profilepictureLocalPath);

    // if profile picture not uploaded then throw error
    if (!profilepicture) {
      throw new ApiError(
        400,
        "Something went wrong while uploading to cloudinary"
      );
    }

    // create user object - create entry in db
    const user = await User.create({
      fullname,
      profilepicture: profilepicture.url,
      email,
      password,
      username: username.toLowerCase(),
    });

    // remove password and refresh token field from response before sending data response to frontend
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken" // '-' before password and refreshToken specifies that we dont want password and refreshToken, before sending to frontend
    );

    // check if user is created
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering user");
    }

    // if user created then return response
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully"));

  } catch (error) {
    console.log("Error in registerUser in User controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    // get data from req.body
    const { email, username, password } = req.body;
    console.log(email, password);

    // find user based on username or email
    if (!username && !email) {
      throw new ApiError(400, "Username or email is required");
    }

    // find the user from db
    const user = await User.findOne({
      $or: [{ username }, { email }], // finds user based on unique email or unique username
    });

    // if user doesnt exist show this error
    if (!user) {
      throw new ApiError(404, "User doesnt exist");
    }

    // "User" is mongodb user model instance, and "user" is from above where we found user from db and stored in variable named user
    // isPasswordCorrect is method we created in user model - it checks whether password is correct or not which we got from req.body
    const isPasswordValid = await user.isPasswordCorrect(password);

    // password check, if password is not correct show this error
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    // to assign access and refresh token, we created method above registerUser in this file, we can call that method here while assigning tokens
    // access and refreshtoken generation
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    // send tokens via cookies
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    ); // we dont want to share password and refreshToken to user so we select those and add '-' before it

    const options = {
      // it means cookies can only be modifiable by server side, not by user
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    console.log(
      "access token: ",
      accessToken,
      "refresh token: ",
      refreshToken,
      "logged in user: ",
      loggedInUser
    );

    // return response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );

  } catch (error) {
    console.log("Error in loginUser in User controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id, // what to find
      {
        // what to update
        $unset: {
          refreshToken: 1, // removes refreshToken from mongodb
        },
      },
      {
        new: true, 
      }
    );

    const options = {
      // it means cookies can only be modifiable by server side, not by user
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged Out"));
  } catch (error) {
    console.log("Error in logoutUser in User controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// to refresh access token if it expires
const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request");
    }

    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const user = await User.findById(decodedToken?._id);

      if (!user) {
        throw new ApiError(401, "Invalid Refresh Token");
      }

      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh Token is expired or used");
      }

      const options = {
        httpOnly: true,
        secure: true,
      };

      const { accessToken, newRefreshToken } =
        await generateAccessAndRefreshTokens(user._id);

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken: newRefreshToken },
            "Access Token Refreshed"
          )
        );
    } catch (error) {
      throw new ApiError(401, error?.message || "invalid refresh token");
    }
  } catch (error) {
    console.log(
      "Error in refreshAccessToken in User controller: ",
      error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    // check if user entered correct oldPassword
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword); // isPasswordCorrect is method we created in user model to check if password passed as parameter is correct or not

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully"));
  } catch (error) {
    console.log("Error in changePassword controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// to get current logged in user, we have got user from auth.middleware
const getCurrentUser = async (req, res) => {
  try {
    return res
      .status(200)
      .json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
      );
  } catch (error) {
    console.log("Error in getCurrentUser in User controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }

  // while logging in, we have used middleware, in that middleware we got req.user
  // that is used here to get user who is currently logged in
};

const editFullName = async (req, res) => {
  try {
    const { fullname } = req.body;

    if (!fullname) {
      throw new ApiError(400, "Updated Name field is required");
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { fullname },
      },
      { new: true } // this will return what all things changed or what all are new
    ).select("-password");

    return res
      .status(200)
      .json(
        new ApiResponse(200, user, "User's Full Name updated successfully")
      );
  } catch (error) {
    console.log("Error in editFullName in User controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const dpLocalPath = req.file?.path; // local path of that file (profile picture)

    if (!dpLocalPath) {
      throw new ApiError(400, "profile picture file is missing");
    }

    const dp = await uploadOnCloudinary(dpLocalPath);

    if (!dp.url) {
      throw new ApiError(400, "Error while uploading to cloudinary");
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          profilepicture: dp.url,
        },
      },
      { new: true }  // this will return what all things changed or what all are new
    ).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Profile Picture updated successfully"));
  } catch (error) {
    console.log(
      "Error in updateProfilePicture in User controller: ",
      error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username?.trim()) {
      // if username exist then trim the whitespaces else throw error - both tasks done in single line
      throw new ApiError(400, "Username is missing");
    }

    // aggregate function in mongodb to get a user profile
    const profile = await User.aggregate([
      {
        $match: {
          // to find match for username in mongodb
          username: { $regex: new RegExp("^" + username + "$", "i") }, 
        },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: "followers", // Follower in db is automatically converted to lowercase and in plural form so we wrote here - followers
          localField: "_id",
          foreignField: "following", // following in follower.model
          as: "followers", // name we gave to number of users who follow some profile
        },
      },
      {
        $lookup: {
          from: "followers", // Follower in db is automatically converted to lowercase and in plural form so we wrote here - followers
          localField: "_id",
          foreignField: "follower", // follower in follower.model
          as: "following", // name we gave to number of other profiles user follows
        },
      },
      {
        $addFields: {
          followersCount: {
            // to count number of objects we got from above lookup - "followers"
            $size: "$followers", // we used here $ because followers is field - the name we gave to field(as: "followers")
          },
          followingCount: {
            // to count number of objects we got from above lookup - "following"
            $size: "$following",
          },
          hasFollowed: {
            // this is to check if particular user has followed some other profile or not, if it is true then we can show that profile with followed button on frontend and if false then we can show follow button on frontend
            $cond: {
              if: { $in: [req.user?._id, "$followers.follower"] }, // $follower is field we created on line 308, and .follower is refering to type we created in follower.model
              then: true,
              else: false,
            },
          },
        },
      },
      {
        // this is used to project or get only these values instead of getting whole object everytime
        $project: {
          fullname: 1, // 1 here is similar to true, it is syntax
          username: 1,
          followersCount: 1,
          followingCount: 1,
          hasFollowed: 1,
          profilepicture: 1,
          email: 1,
        },
      },
    ]);

    if (!profile?.length) {
      throw new ApiError(404, "Profile does not exists");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, profile, "User Profile fetched successfully"));
  } catch (error) {
    console.log("Error in getUserProfile in User controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  editFullName,
  updateProfilePicture,
  getUserProfile,
};
