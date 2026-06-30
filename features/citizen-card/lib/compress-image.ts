/**
 * Client-side image compression for Firestore storage (Spark plan — no Storage required).
 * Resizes to max 400×400 JPEG ~80% quality, typically 30–80 KB.
 */
export async function compressAvatarImage(
  file: File,
  maxDimension = 400,
  quality = 0.82
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const scale = Math.min(
        maxDimension / img.width,
        maxDimension / img.height,
        1
      );
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Không thể xử lý ảnh"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Không thể nén ảnh"));
            return;
          }
          resolve(
            new File([blob], "avatar.jpg", {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
          );
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Không thể đọc file ảnh"));
    };

    img.src = objectUrl;
  });
}
