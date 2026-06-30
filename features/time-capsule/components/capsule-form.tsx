"use client";

import { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ImagePlus, Loader2, Lock, Globe, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  capsuleFormSchema,
  type CapsuleFormValues,
  ACCEPTED_CAPSULE_IMAGE_TYPES,
  MAX_CAPSULE_PHOTO_SIZE,
} from "../schemas/capsule.schema";

interface CapsuleFormProps {
  onSubmit: (values: CapsuleFormValues, photoFile?: File | null) => void;
  isLoading?: boolean;
}

export function CapsuleForm({ onSubmit, isLoading }: CapsuleFormProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoError, setPhotoError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CapsuleFormValues>({
    resolver: zodResolver(capsuleFormSchema),
    defaultValues: {
      authorName: "",
      village: "",
      title: "",
      message: "",
      isAnonymous: false,
      visibility: "public",
    },
  });

  const isAnonymous = watch("isAnonymous");
  const visibility = watch("visibility");

  const handlePhotoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setPhotoError("");
      if (!file) {
        setPhotoFile(null);
        setPhotoPreview("");
        return;
      }
      if (!ACCEPTED_CAPSULE_IMAGE_TYPES.includes(file.type)) {
        setPhotoError("Chỉ chấp nhận JPG, PNG hoặc WebP");
        return;
      }
      if (file.size > MAX_CAPSULE_PHOTO_SIZE) {
        setPhotoError("Ảnh không quá 5MB");
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    },
    []
  );

  function handleFormSubmit(values: CapsuleFormValues) {
    onSubmit(values, photoFile);
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 glass-card p-6 sm:p-8"
    >
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-muted/50">
        <div className="flex items-center gap-3">
          <Lock className="text-primary" size={20} />
          <div>
            <p className="text-sm font-medium">Gửi ẩn danh</p>
            <p className="text-xs text-muted-foreground">Không hiển thị tên của bạn</p>
          </div>
        </div>
        <Controller
          name="isAnonymous"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      {!isAnonymous && (
        <div className="space-y-2">
          <Label htmlFor="authorName">Họ và tên</Label>
          <Input
            id="authorName"
            placeholder="Nguyễn Văn A"
            {...register("authorName")}
          />
          {errors.authorName && (
            <p className="text-sm text-destructive">{errors.authorName.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="village">Địa chỉ</Label>
        <Input
          id="village"
          placeholder="Nhập địa chỉ của bạn..."
          {...register("village")}
        />
        {errors.village && (
          <p className="text-sm text-destructive">{errors.village.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Tiêu đề lời nhắn</Label>
        <Input
          id="title"
          placeholder="Gửi đến Ô Diên 10 năm sau..."
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Lời nhắn</Label>
        <Textarea
          id="message"
          placeholder="Viết điều bạn muốn gửi gắm đến Ô Diên trong tương lai..."
          rows={6}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Ảnh kỷ niệm (tuỳ chọn)</Label>
        <label
          className={cn(
            "flex items-center gap-4 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-primary hover:bg-primary/5",
            photoError ? "border-destructive" : "border-muted-foreground/30"
          )}
        >
          {photoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoPreview}
              alt="Preview"
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
              <ImagePlus className="text-muted-foreground" size={24} />
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            <p>Nhấn để thêm ảnh</p>
            <p className="text-xs mt-1">JPG, PNG, WebP — tối đa 5MB</p>
          </div>
          <input
            type="file"
            accept={ACCEPTED_CAPSULE_IMAGE_TYPES.join(",")}
            onChange={handlePhotoChange}
            className="sr-only"
          />
        </label>
        {photoError && (
          <p className="text-sm text-destructive">{photoError}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label>Chế độ hiển thị</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
              visibility === "public"
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            )}
          >
            <input
              type="radio"
              value="public"
              className="sr-only"
              {...register("visibility")}
            />
            <Globe className="text-primary flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-medium text-sm">Công khai</p>
              <p className="text-xs text-muted-foreground mt-1">
                Sau khi duyệt, mọi người cùng đọc khi hộp được mở trong tương lai
              </p>
            </div>
          </label>
          <label
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
              visibility === "private"
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            )}
          >
            <input
              type="radio"
              value="private"
              className="sr-only"
              {...register("visibility")}
            />
            <EyeOff className="text-primary flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-medium text-sm">Riêng tư</p>
              <p className="text-xs text-muted-foreground mt-1">
                Chỉ bạn và ban quản trị biết nội dung
              </p>
            </div>
          </label>
        </div>
        {errors.visibility && (
          <p className="text-sm text-destructive">{errors.visibility.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full gap-2" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Đang gửi vào hộp...
          </>
        ) : (
          <>
            <Lock size={18} />
            Gửi vào Hộp Thời Gian
          </>
        )}
      </Button>
    </motion.form>
  );
}
