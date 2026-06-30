"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Pencil, Check, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePassportDashboard } from "../hooks/use-passport";
import { updatePassportDisplayNameAction } from "@/actions/passport";
import { PassportBook } from "./passport-book";
import { PassportProgress } from "./passport-progress";
import { LocationGrid } from "./location-grid";
import { BadgeShowcase } from "./badge-showcase";
import { Leaderboard } from "./leaderboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FirebaseAuthSetupHelp } from "@/components/shared/firebase-auth-setup-help";
import { TOTAL_LOCATIONS } from "../data/locations";

export function PassportPageClient() {
  const {
    ensureAuth,
    loading: authLoading,
    getIdToken,
    authError,
    authErrorMessage,
    clearAuthError,
  } = useAuth();
  const [authRetrying, setAuthRetrying] = useState(false);
  const { data, isLoading, refetch } = usePassportDashboard();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    ensureAuth().catch(() => {
      /* error stored in auth context */
    });
  }, [ensureAuth]);

  async function handleAuthRetry() {
    setAuthRetrying(true);
    clearAuthError();
    try {
      await ensureAuth();
    } finally {
      setAuthRetrying(false);
    }
  }

  if (authError === "configuration-not-found") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4 py-16">
        <FirebaseAuthSetupHelp
          message={authErrorMessage}
          onRetry={handleAuthRetry}
        />
        {authRetrying && (
          <p className="sr-only">Đang thử lại...</p>
        )}
      </div>
    );
  }

  const visitedIds = new Set(data?.scans.map((s) => s.locationId) ?? []);
  const earnedBadgeIds = new Set(data?.badges.map((b) => b.badgeId) ?? []);

  async function handleSaveName() {
    setSavingName(true);
    try {
      const token = await getIdToken();
      await updatePassportDisplayNameAction(token, nameInput);
      setEditingName(false);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingName(false);
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const displayName = data?.displayName ?? "Khách Ô Diên";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-bold">
          Hộ Chiếu <span className="text-gradient">Ô Diên</span>
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Khám phá {TOTAL_LOCATIONS} địa điểm, quét QR để sưu tập tem và mở khóa
          huy hiệu danh dự.
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          {editingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Tên hiển thị"
                className="w-48"
                maxLength={40}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSaveName}
                disabled={savingName}
              >
                <Check size={16} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setEditingName(false)}
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => {
                setNameInput(displayName);
                setEditingName(true);
              }}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {displayName}
              <Pencil size={14} />
            </button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PassportBook visitedIds={visitedIds} displayName={displayName} />
          <PassportProgress
            stampCount={data?.stampCount ?? 0}
            total={data?.totalLocations ?? TOTAL_LOCATIONS}
          />

          <div>
            <h3 className="font-semibold text-lg mb-4">Địa điểm</h3>
            <LocationGrid visitedIds={visitedIds} />
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Huy hiệu</h3>
            <BadgeShowcase earnedBadgeIds={earnedBadgeIds} />
          </div>
        </div>

        <div className="space-y-6">
          <Leaderboard />
          <div className="glass-card p-5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Cách chơi</p>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>Đến địa điểm trong danh sách</li>
              <li>Quét mã QR tại điểm đó</li>
              <li>Tem sẽ tự động được thêm vào hộ chiếu</li>
              <li>Sưu tập đủ tem để mở khóa huy hiệu!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
