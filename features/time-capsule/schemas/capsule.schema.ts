import { z } from "zod";
import { villageFieldSchema } from "@/lib/schemas/village";

export const capsuleFormSchema = z
  .object({
    authorName: z.string().max(100).optional(),
    village: villageFieldSchema,
    title: z
      .string()
      .min(3, "Tiêu đề phải có ít nhất 3 ký tự")
      .max(120, "Tiêu đề không quá 120 ký tự"),
    message: z
      .string()
      .min(20, "Lời nhắn phải có ít nhất 20 ký tự")
      .max(2000, "Lời nhắn không quá 2000 ký tự"),
    isAnonymous: z.boolean(),
    visibility: z.enum(["public", "private"], {
      message: "Chọn chế độ hiển thị",
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.isAnonymous && (!data.authorName || data.authorName.trim().length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng nhập tên hoặc bật ẩn danh",
        path: ["authorName"],
      });
    }
  });

export type CapsuleFormValues = z.infer<typeof capsuleFormSchema>;

export const MAX_CAPSULE_PHOTO_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_CAPSULE_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
