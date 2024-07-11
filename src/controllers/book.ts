import { NextFunction, Request, Response } from "express";
import BookService from "../services/book";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BookService.create(req.body);
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const result = await BookService.update(Number(id), payload);
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const file = req.file;
    const result = await BookService.uploadImage(Number(id), file);
    res.status(200).json({
      data: {
        image: result,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BookService.getAll();
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

const getTopBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BookService.getBestSeller();
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

const removeBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await BookService.remove(Number(id));
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

export default {
  createBook,
  updateBook,
  uploadImage,
  getAllBooks,
  getTopBooks,
  removeBook
};
