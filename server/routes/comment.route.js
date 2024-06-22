import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteCommentForPost, deleteCommentForTweet, getCommentsForPost, getCommentsForTweet, postComment, replyTweet } from "../controllers/comment.controller.js";

const router = Router();

// for post
router.route("/post-comment").post(verifyJWT, postComment)
router.route("/:postId").get(getCommentsForPost)
router.route("/:commentId").delete(verifyJWT, deleteCommentForPost)

// for tweet
router.route("/reply-tweet").post(verifyJWT, replyTweet)
router.route("/t/:tweetId").get(getCommentsForTweet)
router.route("/t/:commentId").delete(verifyJWT, deleteCommentForTweet)


export default router;