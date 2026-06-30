"use client";

import { createContext, useContext } from "react";
import { Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WordmarkLogo } from "@/components/branding/wordmark-logo";
import { useAdminAuth } from "../hooks/use-admin-auth";
import { AdminLoginForm } from "./admin-login-form";
import { AnalyticsOverview } from "./analytics-overview";
import { CapsuleModeration } from "./capsule-moderation";
import { CitizenCardsPanel } from "./citizen-cards-panel";
import { PassportPanel } from "./passport-panel";
import { QuizPanel } from "./quiz-panel";

const AdminAuthContext = createContext<ReturnType<typeof useAdminAuth> | null>(
  null
);

export function useAdminAuthContext() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuthContext must be used within AdminPageClient");
  }
  return ctx;
}

function AdminDashboard() {
  const { email, logout, getIdToken } = useAdminAuthContext();

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background/95 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex hover:opacity-90 transition-opacity"
            >
              <WordmarkLogo compact />
            </Link>
            <p className="text-xs text-muted-foreground">Bảng quản trị</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {email}
            </span>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="capsules">Hộp Thời Gian</TabsTrigger>
            <TabsTrigger value="cards">Thẻ Công Dân</TabsTrigger>
            <TabsTrigger value="passport">Hộ Chiếu</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AnalyticsOverview getIdToken={getIdToken} />
          </TabsContent>
          <TabsContent value="capsules">
            <CapsuleModeration getIdToken={getIdToken} />
          </TabsContent>
          <TabsContent value="cards">
            <CitizenCardsPanel getIdToken={getIdToken} />
          </TabsContent>
          <TabsContent value="passport">
            <PassportPanel getIdToken={getIdToken} />
          </TabsContent>
          <TabsContent value="quiz">
            <QuizPanel getIdToken={getIdToken} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export function AdminPageClient() {
  const auth = useAdminAuth();

  return (
    <AdminAuthContext.Provider value={auth}>
      {auth.loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : auth.isAdmin ? (
        <AdminDashboard />
      ) : (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 hero-glow">
          <AdminLoginForm />
        </div>
      )}
    </AdminAuthContext.Provider>
  );
}
