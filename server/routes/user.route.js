import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken, changePassword, getCurrentUser, editFullName, updateProfilePicture, getUserProfile } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// route - /api/v1/users/register
router.route("/register").post(
    // middleware - multer file upload
    upload.fields([
        {
            name: "profilepicture",
            maxCount: 1
        }
    ])
    ,
    registerUser
)  // post request. // registerUser method from user.controller.js is called 

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser) // verifyJWT is middleware we created, it is written before method where it should be run

router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/edit-fullname").patch(verifyJWT, editFullName)
router.route("/profilepicture").patch(verifyJWT, upload.single("profilepicture"), updateProfilePicture)
router.route("/profile/:username").get(getUserProfile)  

export default router;

