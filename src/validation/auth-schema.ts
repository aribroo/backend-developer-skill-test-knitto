import { z, ZodType } from "zod";

export class AuthValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(3).max(100),
    password: z.string().min(8).max(100),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string(),
    password: z.string(),
  });
}
