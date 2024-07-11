import { Request, Response, NextFunction } from "express";
import { ResponseError } from "../errors/response-error";
import { ZodError } from "zod";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    res.status(err.statusCode).json({ errors: err.message }).end();
  } else if (err instanceof ZodError) {
    const errors = [];

    for (let i = 0; i < err.errors.length; i++) {
      errors.push({
        message: err.errors[i].message,
        path: err.errors[i].path,
      });
    }

    return res.status(400).json({
      errors,
    });
  } else {
    console.error(err)
    res.status(500).json({ errors: "Internal Server Error" }).end();
  }
};
