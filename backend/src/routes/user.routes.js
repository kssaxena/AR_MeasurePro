import { Router } from "express";
import {
  registerUser,
  loginUser,
  LogOutUser,
  regenerateRefreshToken,
} from "../controllers/user.controllers.js";
import { VerifyUser } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-tokens").post(regenerateRefreshToken);

// router.route("/get-user-details/:userId").get(GetUserDetails);

//secured routes
router.route("/logout").post(VerifyUser, LogOutUser);
// router.route("/user/get-user-details/:userId").get(GetUserDetails);

export default router;
