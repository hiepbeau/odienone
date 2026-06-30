import { z } from "zod";

export const villageFieldSchema = z
  .string()
  .trim()
  .min(2, "Thôn/xóm phải có ít nhất 2 ký tự")
  .max(80, "Thôn/xóm không được quá 80 ký tự");
