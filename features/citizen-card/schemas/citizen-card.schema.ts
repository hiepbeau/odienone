import { z } from "zod";
import { villageFieldSchema } from "@/lib/schemas/village";

export const citizenCardFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên không được quá 100 ký tự"),
  birthday: z
    .string()
    .min(1, "Vui lòng nhập năm sinh")
    .regex(/^\d{4}$/, "Năm sinh phải gồm 4 chữ số")
    .refine((year) => {
      const y = Number(year);
      const currentYear = new Date().getFullYear();
      return y >= 1900 && y <= currentYear;
    }, `Năm sinh phải từ 1900 đến ${new Date().getFullYear()}`),
  village: villageFieldSchema,
});

export type CitizenCardFormValues = z.infer<typeof citizenCardFormSchema>;

export const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
