import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import * as userController from "./controllers/userController.js";
import * as postController from "./controllers/postController.js";

export const app = express();
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// user
app.post("/api/users/register", registerValidation, userController.register);

app.post("/api/users/login", loginValidation, userController.login);

app.get("/api/users/current", checkAuth, userController.current);

// post
app.post(
  "/api/posts",
  checkAuth,
  postCreateValidation,
  postController.createPost
);

app.get("/api/posts", postController.getAllPosts);

app.get("/api/posts/:id", postController.getOnePost);

app.delete("/api/posts/:id", checkAuth, postController.deletePost);

app.patch("/api/posts/:id", checkAuth, postController.updatePost);
