import { z } from "zod";
const nameValidation = z
  .string()
  .min(5, "Name must be at least 3 characters")
  .max(50, "Name is too long")
  .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters")
  .trim();

const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must include uppercase, lowercase, number, and special character",
  );

export const registerSchema = z.object({
  email: z.string().email().max(255).toLowerCase().trim(),
  password: passwordValidation,
  name: nameValidation,
});
export const loginSchema = z.object({
  email: z.string().email().max(255).toLowerCase().trim(),
  password: z.string().min(8),
});
export const updateProfilenname = z.object({
  name: nameValidation,
});
export const updateProfilepassword = z.object({
  password: passwordValidation,
});
