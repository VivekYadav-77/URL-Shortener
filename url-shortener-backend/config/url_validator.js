import { z } from "zod";

export const createUrlSchema = z.object({
  originalUrl: z.string().url(),
  customAlias: z
    .string()
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional()
});

export const updateUrlSchema = z.object({
  isActive: z.boolean().optional(),
  expiresAt: z.string().datetime().optional()
});
