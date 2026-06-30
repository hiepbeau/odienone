"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Camera, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  citizenCardFormSchema,
  type CitizenCardFormValues,
  MAX_AVATAR_SIZE,
  ACCEPTED_IMAGE_TYPES,
} from "../schemas/citizen-card.schema";
import { CitizenCardDisplay } from "./citizen-card-display";

interface CitizenCardFormProps {
  onSubmit: (values: CitizenCardFormValues, avatarFile: File) => void;
  isLoading?: boolean;
}

export function CitizenCardForm({ onSubmit, isLoading }: CitizenCardFormProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarError, setAvatarError] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CitizenCardFormValues>({
    resolver: zodResolver(citizenCardFormSchema),
    defaultValues: {
      fullName: "",
      birthday: "",
      village: "",
    },
  });

  const watched = watch();

  const handleAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setAvatarError("");

      if (!file) {
        setAvatarFile(null);
        setAvatarPreview("");
        return;
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setAvatarError("Chỉ chấp nhận file JPG, PNG hoặc WebP");
        return;
      }

      if (file.size > MAX_AVATAR_SIZE) {
        setAvatarError("Ảnh không được vượt quá 5MB");
        return;
      }

      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    },
    []
  );

  function handleFormSubmit(values: CitizenCardFormValues) {
    if (!avatarFile) {
      setAvatarError("Vui lòng tải lên ảnh đại diện");
      return;
    }
    onSubmit(values, avatarFile);
  }

  const previewData = {
    fullName: watched.fullName,
    birthday: watched.birthday,
    village: watched.village ?? "",
    avatarUrl: avatarPreview,
    citizenId: "OD-2026-XXXXX",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <motion.form
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* Avatar upload */}
        <div className="space-y-2">
          <Label>Ảnh đại diện</Label>
          <div className="flex items-center gap-4">
            <label
              className={cn(
                "relative w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all hover:border-primary hover:bg-primary/5 overflow-hidden",
                avatarError ? "border-destructive" : "border-muted-foreground/30"
              )}
            >
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-muted-foreground" size={32} />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="text-white" size={24} />
              </div>
              <input
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onChange={handleAvatarChange}
                className="sr-only"
              />
            </label>
            <div className="text-sm text-muted-foreground">
              <p>Nhấn để chọn ảnh</p>
              <p className="text-xs mt-1">JPG, PNG, WebP — tối đa 5MB</p>
            </div>
          </div>
          {avatarError && (
            <p className="text-sm text-destructive">{avatarError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Họ và tên</Label>
          <Input
            id="fullName"
            placeholder="Nguyễn Văn A"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthday">Năm sinh</Label>
          <Input
            id="birthday"
            type="text"
            inputMode="numeric"
            placeholder="VD: 1990"
            maxLength={4}
            {...register("birthday")}
          />
          {errors.birthday && (
            <p className="text-sm text-destructive">{errors.birthday.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="village">Địa chỉ</Label>
          <Input
            id="village"
            placeholder="Ví dụ: Cụm 9, xã Ô Diên, Thành Phố Hà Nội"
            {...register("village")}
          />
          {errors.village && (
            <p className="text-sm text-destructive">{errors.village.message}</p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Đang tạo thẻ...
            </>
          ) : (
            "Tạo Thẻ Công Dân"
          )}
        </Button>
      </motion.form>

      {/* Live preview */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center"
      >
        <p className="text-sm text-muted-foreground mb-4">Xem trước thẻ</p>
        <CitizenCardDisplay data={previewData} />
        <p className="text-xs text-muted-foreground mt-4 text-center max-w-sm">
          Đây là thẻ kỷ niệm số được tạo để hưởng ứng Ô Diên One. 
          Thẻ chỉ mang ý nghĩa lưu niệm và trải nghiệm, không có giá trị pháp lý.
        </p>
      </motion.div>
    </div>
  );
}
