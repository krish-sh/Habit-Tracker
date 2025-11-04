import express from "express";
import { register } from "../controllers/userController.js";
import { login } from "../controllers/userController.js";
import auth from "../middleware/authMiddleware.js";
import {
  addHabit,
  deleteHabit,
  editHabits,
  getHabit,
  markCompleted,
} from "../controllers/habitController.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);

userRouter.post("/add-habit", auth, addHabit);
userRouter.delete("/habits/:id", auth, deleteHabit);
userRouter.get("/habits", auth, getHabit);
userRouter.put("/habits/:id", editHabits, auth);
userRouter.put("/habits/completed/:id", auth, markCompleted);

export default userRouter;
