import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import registerValidation from "./validations/users.js";
import checkAuth from "./utils/checkAuth.js";
import * as userController from "./controllers/userController.js";

export const app = express();
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.post("/api/users/register", registerValidation, userController.register);

app.post("/api/users/login", userController.login);

app.get("/api/users/current", checkAuth, userController.current);
