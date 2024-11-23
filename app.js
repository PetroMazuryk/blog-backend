import express from "express";
import morgan from "morgan";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import { validationResult } from "express-validator";
import registerValidation from "./validations/users.js";
import UserModel from "./models/users.js";
import checkAuth from "./utils/checkAuth.js";

export const app = express();
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.post("/api/users/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

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
});

app.post("/api/users/login", async (req, res) => {
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
});

app.get("/api/users/current", checkAuth, async (req, res) => {
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
});
