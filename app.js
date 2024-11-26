import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";
import { userController, postController } from "./controllers/index.js";
import { upload } from "./middlewares/upload.js";

export const app = express();
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// user
app.post(
  "/api/users/register",
  registerValidation,
  handleValidationErrors,
  userController.register
);

app.post(
  "/api/users/login",
  loginValidation,
  handleValidationErrors,
  userController.login
);

app.get("/api/users/current", checkAuth, userController.current);

// post

app.get("/api/posts", postController.getAllPosts);

app.get("/api/posts/:id", postController.getOnePost);

app.post(
  "/api/posts",
  checkAuth,
  postCreateValidation,
  postController.createPost
);

app.delete("/api/posts/:id", checkAuth, postController.deletePost);

app.patch(
  "/api/posts/:id",
  checkAuth,
  postCreateValidation,
  postController.updatePost
);

app.post("/api/upload", checkAuth, upload.single("image"), (req, res) => {
  try {
    res.status(200).json({
      url: `/uploads/${req.file.originalname}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Не вдалося завантажити файл",
    });
  }
});
