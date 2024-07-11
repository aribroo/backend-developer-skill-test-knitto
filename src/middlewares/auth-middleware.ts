import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../database/db";
import TokenUtil from "../utils/token";
import { IUser } from "../interface/user";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers["authorization"];

    if (!authorization) {
      return res.status(401).json({ errors: "Unauthorized" });
    }

    const tokenParts = authorization.split(" ");

    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ errors: "Unauthorized" });
    }

    const token = tokenParts[1];
    const result: any = TokenUtil.verifyToken(token);

    if (!result || !result.id) {
      return res.status(401).json({ errors: "Unauthorized" });
    }

    const userExists = await prismaClient.user.count({
      where: {
        id: result.id,
      },
    });

    if (userExists === 0) {
      return res.status(401).json({ errors: "Unauthorized" });
    }

    req.user = result;
    next();
  } catch (e) {
    res.status(401).json({ errors: "Unauthorized" });
  }
};

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}
