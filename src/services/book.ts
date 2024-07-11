import {
  CreateBookRequest,
  ICategory,
  UpdateBookRequest,
} from "./../interface/book";
import { BookValidation } from "../validation/book-schema";
import { IBestSellerBook, IBook } from "../interface/book";
import { ResponseError } from "../errors/response-error";
import { Sql } from "@prisma/client/runtime/library";
import { validate } from "../validation/validation";
import { prismaClient } from "../database/db";
import axios, { AxiosResponse } from "axios";
import { Prisma } from "@prisma/client";
import path from "path";
import fs from "fs";

const create = async (createBookRequest: CreateBookRequest): Promise<IBook> => {
  // Validation zod
  validate(BookValidation.CREATE, createBookRequest);

  const existingBookCode: IBook | null = await prismaClient.book.findUnique({
    where: {
      code: createBookRequest.code,
    },
  });

  if (existingBookCode) {
    throw new ResponseError(409, "Book code already exist");
  }

  const existingCategory: ICategory | null =
    await prismaClient.category.findUnique({
      where: {
        id: createBookRequest.category_id,
      },
    });

  if (!existingCategory) {
    throw new ResponseError(404, "Category not found");
  }

  const newBook: IBook = await prismaClient.book.create({
    data: createBookRequest,
  });

  return newBook;
};

const update = async (id: number, updateBookRequest: UpdateBookRequest): Promise<IBook> => {
  validate(BookValidation.UPDATE, updateBookRequest);

  return prismaClient.$transaction(async (tx) => {
    const existingBook: IBook | null = await tx.book.findUnique({
      where: { id },
    });

    if (!existingBook) {
      throw new ResponseError(404, "Book not found");
    }

    // jika ada field code
    if (updateBookRequest.code) {
      const existingBookCode: IBook | null = await tx.book.findUnique({
        where: {
          code: updateBookRequest.code,
        },
      });

      if (existingBookCode) {
        throw new ResponseError(409, "Book code already exist");
      }
    }

    // jika ada field category_id
    if (updateBookRequest.category_id) {
      const existingBookCategory: ICategory | null =
        await tx.category.findUnique({
          where: {
            id: updateBookRequest.category_id,
          },
        });

      if (!existingBookCategory) {
        throw new ResponseError(404, "Category not found");
      }
    }

    const updatedBook: IBook = await tx.book.update({
      where: { id },
      data: updateBookRequest,
    });

    return updatedBook;
  });
};

const getAll = async (): Promise<IBook[]> => {
  const sqlQuery: Sql = Prisma.sql`
    SELECT b.id, b.code, b.title, b.author, b.stock, c.name AS category, b.image
    FROM books AS b
    JOIN categories AS c
    ON c.id = b.category_id
  `;

  const books: IBook[] = await prismaClient.$queryRaw<IBook[]>(sqlQuery);

  return books.map((book: IBook) => ({
    ...book,
    image: book.image ? `http://localhost:3000/uploads/${book.image}` : null,
  }));
};

const getBestSeller = async (): Promise<IBestSellerBook[]> => {
  const apiKey: string = process.env.API_KEY as string;
  const apiUrl: string = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${apiKey}`;
  const response: AxiosResponse<any> = await axios.get(apiUrl);

  if (response.status !== 200) {
    throw new ResponseError(response.status, "Failed to fetch data");
  }

  const topBooks: IBestSellerBook[] = response.data.results.books.map(
    (book: any) => ({
      rank: book.rank,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      description: book.description,
      book_image: book.book_image,
    })
  );

  return topBooks;
};

const uploadImage = async (bookId: number, file: Express.Multer.File | undefined): Promise<string> => {
  if (!bookId) {
    throw new ResponseError(400, "Book id must be provided");
  }

  if (!file) {
    throw new ResponseError(400, "No image uploaded");
  }

  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  const fileExtension = file.originalname.split(".").pop()?.toLowerCase();

  if (!fileExtension || !allowedExtensions.includes(`.${fileExtension}`)) {
    throw new ResponseError(400, "Only JPG, JPEG, and PNG files are allowed");
  }

  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSizeInBytes) {
    throw new ResponseError(
      400,
      "File size too large. Maximum size allowed is 5MB"
    );
  }

  const book: IBook | null = await prismaClient.book.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    throw new ResponseError(404, "Book not found");
  }

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const fileName = `${uniqueSuffix}.${fileExtension}`;
  const uploadDir = path.join("public", "uploads");
  const filePath = path.join(uploadDir, fileName);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  fs.writeFileSync(filePath, file.buffer);

  await prismaClient.book.update({
    where: { id: bookId },
    data: { image: fileName },
  });

  return fileName;
};

const remove = async (id: number): Promise<string> => {
  const existingBook: IBook | null = await prismaClient.book.findUnique({
    where: {
      id,
    },
  });

  if (!existingBook) {
    throw new ResponseError(404, "Book not found");
  }

  await prismaClient.book.delete({
    where: {
      id,
    },
  });

  return "OK";
};

export default { create, update, uploadImage, getAll, getBestSeller, remove };
