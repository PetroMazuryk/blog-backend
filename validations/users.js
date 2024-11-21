import { body } from "express-validator";

const registerValidation = [
  body("email", "Невірний формат пошти").isEmail(),
  body("password", "Пароль повинен бути мінімум 5 символів").isLength({
    min: 5,
  }),
  body("fullName", "Вкажіть імя").isLength({ min: 3 }),
  body("avatarUrl", "Невірне посилання на аватарку").optional().isURL(),
];

export default registerValidation;
