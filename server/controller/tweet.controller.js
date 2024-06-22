import { Tweet } from "../models/tweet.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

const getAllTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .populate("tweetwriter", "username")
      .select("-__v");

    if (tweets.length === 0) {
      throw new ApiError(400, "No Tweets");
    }

    res
      .status(200)
      .json(new ApiResponse(200, tweets, "All tweets fetched successfully"));
  } catch (error) {
    console.log("Error in getAllTweets in tweet controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const writeTweet = async (req, res) => {
  try {
    const newTweet = new Tweet({
      tweetwriter: req.user?._id,
      tweet: req.body.tweet,
    });

    const savedTweet = await newTweet.save();

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $push: { tweets: savedTweet._id } },
      { new: true }
    );

    if (!user) {
      throw new ApiError(400, "Something went wrong while writing tweet");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, savedTweet, "tweeted successfully"));
  } catch (error) {
    console.log("Error in writeTweet in Tweet controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTweetsOfUser = async (req, res) => {
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

    const tweets = await Tweet.find({ tweetwriter: user._id })
      .populate("tweetwriter", "username")
      .select("-__v");

    if (tweets.length === 0) {
      throw new ApiError(400, "User has no tweets");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, tweets, `All tweets of user fetched successfully`)
      );
  } catch (error) {
    console.log(
      "Error in getTweetsOfUser in Tweet controller: ",
      error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteTweet = async (req, res) => {
  try {
    const username = req.params.username;
    const tweetId = req.params.postId;

    const user = await User.findOne({ username }); // it works same as findOne({ username: username })
    if (!user) {
      throw new ApiError(404, "user not found");
    }

    const tweet = await Tweet.findOne({ _id: tweetId, tweetwriter: user._id });
    if (!tweet) {
      throw new ApiError(404, "Tweet not found");
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    // Remove the tweet reference from the user's tweets array
    await Tweet.findByIdAndUpdate(
      user._id,
      { $pull: { posts: deletedTweet._id } },
      { new: true }
    );

    // delete comments of that tweet as well
    await Comment.deleteMany({ post: deletedTweet._id });

    res
      .status(200)
      .json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"));
  } catch (error) {
    console.log("Error in deleteTweet in Tweet controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const likeTweet = async (req, res) => {
  try {
    const { tweetId } = req.params;
    const userId = req.user._id;

    if (!userId) {
      throw new ApiError(404, "user not found");
    }

    // Check if the tweet exists
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      throw new ApiError(404, "tweet not found");
    }

    // Check if the user has already liked the tweet
    const indexOfUser = tweet.likes.indexOf(userId);

    if (indexOfUser !== -1) {
      // If the user has already liked the tweet, remove the like
      tweet.likes.splice(indexOfUser, 1);
    } else {
      // If the user hasn't liked the tweet, add the like
      tweet.likes.push(userId);
    }

    await tweet.save();

    res
      .status(200)
      .json(new ApiResponse(200, indexOfUser, "Like status updated"));
  } catch (error) {
    console.log("Error in likeTweet in Tweet controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getAllTweets, writeTweet, getTweetsOfUser, deleteTweet, likeTweet };
