import AsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { validateEmail } from "../utils/validators.js";

//route POST /api/users/auth

const authUser = AsyncHandler(async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  if (!validateEmail(email)) {
    res.status(400);
    throw new Error("Invalid email format");
  }

  const user = await User.findOne({ email });

  const isMatch = user && (await user.matchPassword(password));

  if (isMatch) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

//route POST /api/users
const registerUser = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    res.status(400);
    throw new Error("User Already exist");
  }

  const user = await User.create({
    name,
    email,
    password,
    is_admin: false,
  });
  console.log(user);
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const logOutUser = AsyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged Out " });
});

const getUserProfile = AsyncHandler(async (req, res) => {
  console.log("hi");
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  console.log(user);
  res.status(200).json(user);
});

const updateUserProfile = AsyncHandler(async (req, res) => {
  console.log("req>>>>>>>>>>...................", req.body);
  const user = await User.findById(req.body.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.file) {
      const { filename } = req.file;
      user.image = filename;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      image: updatedUser.image,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logOutUser,
  getUserProfile,
  updateUserProfile,
};
