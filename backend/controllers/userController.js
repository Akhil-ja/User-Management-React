import AsyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const authUser = AsyncHandler(async (req, res) => {
  res.status(200).json({ message: "Auth User" });
});

const registerUser = AsyncHandler(async (req, res) => {
  console.log(req.body);

  res.status(200).json({ message: "Register User" });
});

const logOutUser = AsyncHandler(async (req, res) => {
  res.status(200).json({ message: "log out User" });
});

const getUserProfile = AsyncHandler(async (req, res) => {
  res.status(200).json({ message: "Get User Profile" });
});

const updateUserProfile = AsyncHandler(async (req, res) => {
  res.status(200).json({ message: "update User Profile" });
});

export {
  authUser,
  registerUser,
  logOutUser,
  getUserProfile,
  updateUserProfile,
};
