import { z } from "zod";
import { villageFieldSchema } from "@/lib/schemas/village";

export const citizenCardFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên không được quá 100 ký tự"),
  birthday: z.string().min(1, "Vui lòng chọn ngày sinh"),
  village: villageFieldSchema,
});

export type CitizenCardFormValues = z.infer<typeof citizenCardFormSchema>;

export const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
