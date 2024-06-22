import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteTweet, getAllTweets, getTweetsOfUser, likeTweet, writeTweet } from "../controllers/tweet.controller.js";

const router = Router();

router.route("/write-tweet").post(verifyJWT, writeTweet)
router.route("/all-tweets").get(getAllTweets)
router.route("/t/:username").get(verifyJWT, getTweetsOfUser)
router.route("/:username/:tweetId").delete(verifyJWT, deleteTweet)
router.route("/:tweetId").post(verifyJWT, likeTweet);

export default router;