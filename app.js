import express from "express";
import morgan from "morgan";
import cors from "cors";
import multer from "multer";
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
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (_, res, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Тільки зображення дозволені"), false);
    }
  },
});

// user
app.post("/api/users/register", registerValidation, userController.register);

app.post("/api/users/login", loginValidation, userController.login);

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
