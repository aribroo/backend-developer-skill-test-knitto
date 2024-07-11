import { z, ZodType } from "zod";

export class BookValidation {
  static readonly CREATE: ZodType = z.object({
    code: z.string().min(4).max(100),
    title: z.string().min(3).max(100),
    author: z.string().min(3).max(100),
    stock: z.number().min(1),
    category_id: z.number().min(1),
  });

  static readonly UPDATE: ZodType = z.object({
    code: z.string().min(4).max(100).optional(),
    title: z.string().min(3).max(100).optional(),
    author: z.string().min(3).max(100).optional(),
    stock: z.number().min(1).optional(),
    category_id: z.number().min(1).optional(),
  });
}
