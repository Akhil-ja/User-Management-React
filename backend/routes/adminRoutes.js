import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  userlist,
  createUser,
  UpdateUser,
  deleteUser,
} from "../controllers/adminController.js";

const adminRoute = express.Router();

adminRoute.get("/userlist", userlist);
adminRoute.post("/userlist", createUser);
adminRoute.put("/userlist/:userId", UpdateUser);
adminRoute.delete("/userlist/:userId", protect, deleteUser);

export default adminRoute;
