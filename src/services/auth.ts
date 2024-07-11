import { RegisterUserResponse, IUser } from "../interface/user";
import { AuthValidation } from "../validation/auth-schema";
import { ResponseError } from "../errors/response-error";
import { validate } from "../validation/validation";
import { PasswordUtil } from "../utils/password";
import { prismaClient } from "../database/db";
import TokenUtil from "../utils/token";

const register = async (username: string, password: string): Promise<RegisterUserResponse> => {
  validate(AuthValidation.REGISTER, { username, password });

  const existingUser: IUser | null = await prismaClient.user.findFirst({
    where: {
      username,
    },
  });

  if (existingUser) {
    throw new ResponseError(400, "Username already exist");
  }

  const hashedPassword: string = await PasswordUtil.hash(password);

  const newUser = await prismaClient.user.create({
    data: {
      username,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      created_at: true,
    },
  });

  return newUser;
};

const login = async (username: string, password: string): Promise<string> => {
  validate(AuthValidation.LOGIN, { username, password });

  const user: IUser | null = await prismaClient.user.findFirst({
    where: {
      username,
    },
  });

  if (!user || !(await PasswordUtil.compare(password, user.password))) {
    throw new ResponseError(400, "Username or password wrong");
  }

  const jwtPayload = {
    id: user.id,
    username: user.username,
  };

  const accessToken: string = TokenUtil.generateToken(jwtPayload);
  return accessToken;
};

export default { login, register };
