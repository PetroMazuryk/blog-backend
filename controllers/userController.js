import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import { validationResult } from "express-validator";
import UserModel from "../models/users.js";

export const register = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json(errors.array());
    // }

    const passwordHash = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(passwordHash, salt);

    const doc = new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hash,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { password, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      massage: "Не вдалося зареєструватися",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        massage: " Користувач не знайдений",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.password
    );
    if (!isValidPass) {
      return res.status(404).json({
        massage: "Невірний логін або пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { password, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    res.status(500).json({
      massage: "Не вдалося авторизуватися",
    });
  }
};

export const current = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        massage: " Користувач не знайдений",
      });
    }

    const { password, ...userData } = user._doc;

    res.status(200).json({
      ...userData,
    });
  } catch (error) {
    res.status(500).json({
      massage: "Немає доступу",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.userId;

    await UserModel.findByIdAndUpdate(userId, { token: "" });

    res.json({ message: "Logout success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не вдалося виконати logout" });
  }
};
