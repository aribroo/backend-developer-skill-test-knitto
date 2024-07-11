import { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const result = await AuthService.login(username, password);
    res.status(200).json({
      data: {
        accessToken: result,
      },
    });
  } catch (e) {
    next(e);
  }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const result = await AuthService.register(username, password);
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

export default { register, login };
