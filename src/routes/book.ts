import { authMiddleware } from "./../middlewares/auth-middleware";
import { Router } from "express";
import multer from "multer";
import BookController from "../controllers/book";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes for book
router.post("/", authMiddleware, BookController.createBook);
router.post(
  "/:id/upload-image",
  authMiddleware,
  upload.single("image"),
  BookController.uploadImage
);

router.get("/", BookController.getAllBooks);
router.get("/best-sellers", BookController.getTopBooks);

router.patch("/:id", authMiddleware, BookController.updateBook);

router.delete("/:id", authMiddleware, BookController.removeBook);

export default router;
