import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";

const fetchUserDataById = async (userId) => {
  try {
    try {
      // Perform a database query to find the user by ID
      const user = await User.findById(userId);

      // If the user is found, return their details
      if (user) {
        return {
          username: user.username,
          profilepicture: user.profilepicture, // Assuming you have a 'profilePicture' field in your user schema
          // Add more fields as needed
        };
      } else {
        // If user is not found, return null or throw an error, depending on your preference
        return null;
      }
    } catch (error) {
      // Handle any errors that may occur during the database query
      console.error("Error fetching user data:", error);
      return null;
    }
  } catch (error) {
    console.log(
      "Error in fetchUserDataById in Comment controller: ",
      error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const postComment = async (req, res) => {
  try {
    const { commenter, comment, postId } = req.body;

    // Create a new comment
    const newComment = new Comment({
      commenter,
      comment,
      post: postId,
    });

    // Save the new comment to the database
    const savedComment = await newComment.save();
    console.log(savedComment);
    if (!savedComment) {
      throw new ApiError(400, "Something went wrong while posting comment");
    }

    // Fetch the user data of the commenter
    const userData = await fetchUserDataById(commenter);

    if (!userData) {
      throw new ApiError(400, "Failed to fetch commenter's data");
    }

    // Update the corresponding post document's comments array
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: savedComment._id } }, // Add the comment's ObjectId to the comments array
      { new: true }
    );

    if (!updatedPost) {
      throw new ApiError(400, "Failed to update post with comment");
    }

    res.status(201).json(
      new ApiResponse(
        200,
        {
          savedComment: {
            ...savedComment.toObject(), // Convert Mongoose document to plain JavaScript object
            commenterData: userData,
          },
        },
        "Commented on post successfully"
      )
    );
  } catch (error) {
    console.log("Error in postComment in Comment controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const replyTweet = async (req, res) => {
  try {
    const { commenter, comment, tweetId } = req.body;

    // Create a new comment
    const newComment = new Comment({
      commenter,
      comment,
      tweet: tweetId,
    });

    // Save the new comment to the database
    const savedComment = await newComment.save();
    console.log(savedComment);
    if (!savedComment) {
      throw new ApiError(400, "Something went wrong while commenting");
    }

    // Fetch the user data of the commenter
    const userData = await fetchUserDataById(commenter);

    if (!userData) {
      throw new ApiError(400, "Failed to fetch commenter's data");
    }

    // Update the corresponding post document's comments array
    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      { $push: { comments: savedComment._id } }, // Add the comment's ObjectId to the comments array
      { new: true }
    );

    if (!updatedTweet) {
      throw new ApiError(400, "Failed to update tweet with comment");
    }

    res.status(201).json(
      new ApiResponse(
        200,
        {
          savedComment: {
            ...savedComment.toObject(), // Convert Mongoose document to plain JavaScript object
            commenterData: userData,
          },
        },
        "Commented on tweet successfully"
      )
    );
  } catch (error) {
    console.log("Error in replyTweet in Comment controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCommentsForPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    console.log("postId: ", postId);
    const comments = await Comment.find({ post: postId });
    console.log("comments: ", comments);
    if (!comments) {
      throw new ApiError(
        400,
        "something went wrong while getting comments for post"
      );
    }

    // Fetch commenter data for each comment
    const commentsWithUserData = await Promise.all(
      comments.map(async (comment) => {
        const commenterData = await fetchUserDataById(comment.commenter);
        return {
          ...comment.toObject(),
          commenterData,
        };
      })
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          commentsWithUserData,
          "all comments for post fetched successfully"
        )
      );
  } catch (error) {
    console.log(
      "Error in getCommentsForPost in Comment controller: ",
      error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCommentsForTweet = async (req, res) => {
  try {
    const tweetId = req.params.tweetId;
    console.log("tweetId: ", tweetId);
    const comments = await Comment.find({ tweet: tweetId });
    console.log("comments: ", comments);
    if (!comments) {
      throw new ApiError(
        400,
        "something went wrong while getting comments for tweet"
      );
    }

    // Fetch commenter data for each comment
    const commentsWithUserData = await Promise.all(
      comments.map(async (comment) => {
        const commenterData = await fetchUserDataById(comment.commenter);
        return {
          ...comment.toObject(),
          commenterData,
        };
      })
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          commentsWithUserData,
          "all comments for tweet fetched successfully"
        )
      );
  } catch (error) {
    console.log(
      "Error in getCommentsForTweet in Comment controller: ",
      error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCommentForPost = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    // Find the comment by ID and delete it
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      throw new ApiError(404, "Comment not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, deletedComment, "Comment deleted successfully")
      );
  } catch (error) {
    console.log(
      "Error in deleteCommentForPost in Comment controller: ",
      error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCommentForTweet = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    // Find the comment by ID and delete it
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      throw new ApiError(404, "Comment not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, deletedComment, "Comment deleted successfully")
      );
  } catch (error) {
    console.log(
      "Error in deleteCommentForTweet in Comment controller: ",
      error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  postComment,
  getCommentsForPost,
  deleteCommentForPost,
  replyTweet,
  getCommentsForTweet,
  deleteCommentForTweet,
};
