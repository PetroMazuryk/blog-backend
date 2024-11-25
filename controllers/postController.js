import PostModel from "../models/post.js";

export const createPost = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
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
    );

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

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findOneAndDelete({ _id: postId });

    if (!post) {
      return res.status(404).json({
        message: "Стаття не знайдена",
      });
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Не вдалося видалити статтю",
    });
  }
};
