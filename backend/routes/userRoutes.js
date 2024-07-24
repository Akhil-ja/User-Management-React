import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
const userRoute = express.Router();
import {
  authUser,
  logOutUser,
  getUserProfile,
  updateUserProfile,
  registerUser,
} from "../controllers/userController.js";

userRoute.post("/", registerUser);
userRoute.post("/auth", authUser);
userRoute
  .route("/profile")
  .get(protect, getUserProfile)
  .put(upload.single("image"), updateUserProfile);
userRoute.post("/logout", logOutUser);

export default userRoute;
