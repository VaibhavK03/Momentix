import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPost, deletePost, getAllPosts, getPostsOfUser, likePost } from "../controllers/post.controller.js";

const router = Router();

router.route("/create-post").post(
    verifyJWT, // middleware - multer file upload
    upload.fields([
        {
            name: "images",
            maxCount: 1
        }
    ]),
    createPost)

router.route("/all-posts").get(getAllPosts)
router.route("/p/:username").get(getPostsOfUser)
router.route("/:username/:postId").delete(verifyJWT, deletePost)
router.route("/:postId").post(verifyJWT, likePost);

export default router;