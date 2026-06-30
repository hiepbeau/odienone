"use client";

import Link from "next/link";
import { AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const FIREBASE_AUTH_URL =
  "https://console.firebase.google.com/project/odienone/authentication/providers";

interface FirebaseAuthSetupHelpProps {
  message?: string | null;
  onRetry?: () => void;
}

export function FirebaseAuthSetupHelp({
  message,
  onRetry,
}: FirebaseAuthSetupHelpProps) {
  return (
    <div className="mx-auto max-w-lg glass-card p-6 sm:p-8 text-left">
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="text-destructive flex-shrink-0 mt-0.5" size={22} />
        <div>
          <h2 className="font-semibold text-lg">Cần bật Firebase Authentication</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {message ??
              "Lỗi auth/configuration-not-found — Authentication chưa được kích hoạt cho project odienone."}
          </p>
        </div>
      </div>

      <ol className="text-sm space-y-3 list-decimal list-inside text-muted-foreground mb-6">
        <li>
          Mở{" "}
          <a
            href={FIREBASE_AUTH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Firebase Console → Authentication
            <ExternalLink size={12} />
          </a>
        </li>
        <li>
          Nhấn <strong className="text-foreground">Get started</strong> (lần đầu)
        </li>
        <li>
          Tab <strong className="text-foreground">Sign-in method</strong>
        </li>
        <li>
          Bật <strong className="text-foreground">Anonymous</strong> → Enable → Save
        </li>
        <li>Tải lại trang này</li>
      </ol>

      <div className="flex flex-wrap gap-3">
        {onRetry && (
          <Button onClick={onRetry}>Thử lại</Button>
        )}
        <Button variant="outline" asChild>
          <a href={FIREBASE_AUTH_URL} target="_blank" rel="noopener noreferrer">
            Mở Firebase Console
          </a>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}
