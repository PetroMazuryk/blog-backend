import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import PostModel from "../models/post.js";

export const createPost = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(","),
      user: req.userId,
    });
    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      massage: "Не вдалося створити статтю",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      massage: "Не вдалося отримати статті",
    });
  }
};

export const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).populate("user");

    if (!post) {
      return res.status(404).json({
        message: "Стаття не знайдена",
      });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Не вдалося отримати статтю",
    });
  }
};

// export const deletePost = async (req, res) => {
//   try {
//     const postId = req.params.id;

//     const post = await PostModel.findOneAndDelete({ _id: postId });

//     if (!post) {
//       return res.status(404).json({
//         message: "Стаття не знайдена",
//       });
//     }

//     res.status(200).json({
//       success: true,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Не вдалося видалити статтю",
//     });
//   }
// };

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Знаходимо пост перед видаленням
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Стаття не знайдена",
      });
    }

    // Видаляємо файл зображення, якщо він існує
    if (post.imageUrl) {
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        path.basename(post.imageUrl)
      );
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.error("Помилка при видаленні файлу зображення:", err.message);
        }
      }
    }

    // Видаляємо пост
    await PostModel.deleteOne({ _id: postId });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Не вдалося видалити статтю:", error);
    res.status(500).json({
      message: "Не вдалося видалити статтю",
      error: error.message || "Невідома помилка",
    });
  }
};
export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        message: "Стаття не знайдена",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Не вдалося оновити статтю",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map((item) => item.tags)
      .flat()
      .slice(0, 5);
    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      massage: "Не вдалося отримати теги",
    });
  }
};
