import multer from "multer";

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

export { upload };
