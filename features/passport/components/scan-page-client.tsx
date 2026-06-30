"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckCircle2, MapPin, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { recordPassportScanAction, type ScanResult } from "@/actions/passport";
import { NewBadgeToast } from "./badge-showcase";
import { Button } from "@/components/ui/button";
import { FirebaseAuthSetupHelp } from "@/components/shared/firebase-auth-setup-help";
import { getLocationById } from "../data/locations";

interface ScanPageClientProps {
  locationId: string;
  token: string;
}

export function ScanPageClient({ locationId, token }: ScanPageClientProps) {
  const { ensureAuth, getIdToken, loading: authLoading, authError, authErrorMessage, clearAuthError } = useAuth();
  const queryClient = useQueryClient();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const scannedRef = useRef(false);

  const location = getLocationById(locationId);

  useEffect(() => {
    if (authLoading || scannedRef.current) return;

    if (!token) {
      setError("Thiếu mã xác thực QR. Vui lòng quét lại.");
      return;
    }
    if (!location) {
      setError("Địa điểm không tồn tại.");
      return;
    }

    scannedRef.current = true;
    setScanning(true);

    (async () => {
      try {
        await ensureAuth();
        const idToken = await getIdToken();
        const scanResult = await recordPassportScanAction(
          idToken,
          locationId,
          token
        );
        setResult(scanResult);
        queryClient.invalidateQueries({ queryKey: ["passport-dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["passport-leaderboard"] });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Không thể ghi nhận tem"
        );
        scannedRef.current = false;
      } finally {
        setScanning(false);
      }
    })();
  }, [authLoading, ensureAuth, getIdToken, location, locationId, queryClient, token]);

  if (authError === "configuration-not-found") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4 py-16">
        <FirebaseAuthSetupHelp
          message={authErrorMessage}
          onRetry={async () => {
            clearAuthError();
            scannedRef.current = false;
            setError("");
            setScanning(false);
            setResult(null);
          }}
        />
      </div>
    );
  }

  if (authLoading || scanning) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground">Đang xác thực tem...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <AlertCircle className="text-destructive" size={48} />
        <p className="text-center text-destructive">{error}</p>
        <Button asChild>
          <Link href="/passport">Về Hộ Chiếu</Link>
        </Button>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="text-6xl mb-4"
        >
          {result.locationIcon}
        </motion.div>

        <CheckCircle2
          className={`mx-auto mb-4 ${result.alreadyVisited ? "text-muted-foreground" : "text-green-500"}`}
          size={48}
        />

        <h1 className="text-2xl font-bold">
          {result.alreadyVisited ? "Đã có tem!" : "Tem mới!"}
        </h1>

        <p className="text-lg mt-2 flex items-center justify-center gap-1">
          <MapPin size={18} />
          {result.locationName}
        </p>

        <p className="text-muted-foreground mt-4">{result.message}</p>

        <p className="mt-4 text-sm font-medium">
          {result.stampCount}/{result.totalLocations} tem
        </p>

        <div className="mt-4">
          <NewBadgeToast badgeIds={result.newBadges} />
        </div>

        <Button asChild className="mt-8" size="lg">
          <Link href="/passport">Xem Hộ Chiếu</Link>
        </Button>
      </motion.div>
    </div>
  );
}
