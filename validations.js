import { body } from "express-validator";

export const registerValidation = [
  body("email", "Невірний формат пошти").isEmail(),
  body("password", "Пароль повинен бути мінімум 5 символів").isLength({
    min: 5,
  }),
  body("fullName", "Вкажіть імя").isLength({ min: 3 }),
  body("avatarUrl", "Невірне посилання на аватарку").optional().isURL(),
];

export const loginValidation = [
  body("email", "Невірний формат пошти").isEmail(),
  body("password", "Пароль повинен бути мінімум 5 символів").isLength({
    min: 5,
  }),
];

export const postCreateValidation = [
  body("title", "Введіть заголовок статті").isLength({ min: 3 }).isString(),
  body("text", "Введіть текст статті")
    .isLength({
      min: 3,
    })
    .isString(),
  body("tags", "Невірний формат тегів (вкажіть масив)").optional().isString(),
  body("imageUrl", "Невірне посилання на зображення").optional().isString(),
];
