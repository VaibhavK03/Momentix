import { Post } from "../models/post.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Comment } from "../models/comment.model.js";

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postuploader", "username")
      .select("-__v");

    if (posts.length === 0) {
      throw new ApiError(400, "No posts");
    }

    res
      .status(200)
      .json(new ApiResponse(200, posts, "All posts fetched successfully"));
  } catch (error) {
    console.log("Error in getAllPosts in Post controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createPost = async (req, res) => {
  try {
    const postLocalPath = req.files?.images[0]?.path;
    console.log(postLocalPath);
    if (!postLocalPath) {
      throw new ApiError(400, "Image/Video file is missing");
    }

    const post = await uploadOnCloudinary(postLocalPath);

    if (!post.url) {
      throw new ApiError(400, "Error while uploading post to cloudinary");
    }

    const newPost = new Post({
      postuploader: req.user?._id,
      caption: req.body.caption,
      images: post.url,
    });

    const savedPost = await newPost.save();

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $push: { posts: savedPost._id } },
      { new: true }
    );

    if (!user) {
      throw new ApiError(400, "Something went wrong while creating post");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, post, "Post created successfully"));
  } catch (error) {
    console.log("Error in createPost in Post controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPostsOfUser = async (req, res) => {
  try {
    const { username } = req.params; // parameter passed in search url

    if (!username?.trim()) {
      // if username exist then trim the whitespaces else throw error - both tasks done in single line
      throw new ApiError(400, "Username is missing");
    }

    const user = await User.findOne({ username });

    if (!user) {
      throw new ApiError(200, "User not found");
    }

    const posts = await Post.find({ postuploader: user._id })
      .populate("postuploader", "username")
      .select("-__v");

    if (posts.length === 0) {
      throw new ApiError(400, "User has no posts");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, posts, `All posts of user fetched successfully`)
      );
  } catch (error) {
    console.log("Error in getPostsOfUser in Post controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const username = req.params.username;
    const postId = req.params.postId;

    const user = await User.findOne({ username }); // it works same as findOne({ username: username })
    if (!user) {
      throw new ApiError(404, "user not found");
    }

    const post = await Post.findOne({ _id: postId, postuploader: user._id });
    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    const deletedPost = await Post.findByIdAndDelete(postId);

    // Remove the post reference from the user's posts array
    await User.findByIdAndUpdate(
      user._id,
      { $pull: { posts: deletedPost._id } },
      { new: true }
    );

    // delete comments of that post as well
    await Comment.deleteMany({ post: deletedPost._id });

    res
      .status(200)
      .json(new ApiResponse(200, deletedPost, "post deleted successfully"));
  } catch (error) {
    console.log("Error in deletePost in Post controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!userId) {
      throw new ApiError(404, "user not found");
    }

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(404, "post not found");
    }

    // Check if the user has already liked the post
    const indexOfUser = post.likes.indexOf(userId);

    if (indexOfUser !== -1) {
      // If the user has already liked the post, remove the like
      post.likes.splice(indexOfUser, 1);
    } else {
      // If the user hasn't liked the post, add the like
      post.likes.push(userId);
    }

    await post.save();

    res
      .status(200)
      .json(new ApiResponse(200, indexOfUser, "Like status updated"));
  } catch (error) {
    console.log("Error in likePost in Post controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getAllPosts, createPost, getPostsOfUser, deletePost, likePost };
