import { z } from "zod";
export const createUrlSchema = z.object({
  originalUrl: z.string().url(),

  customAlias: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? val.trim() : undefined))
    .refine(
      (val) => !val || /^[a-zA-Z0-9_-]+$/.test(val),
      "Alias must be alphanumeric, hyphen, or underscore",
    ),

  expiresAt: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? val : undefined)),
});
