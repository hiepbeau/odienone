"use client";

import { useCallback, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { verifyAdminSessionAction } from "@/actions/admin";

interface AdminAuthState {
  user: User | null;
  email: string | null;
  loading: boolean;
  error: string | null;
}

export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    email: null,
    loading: true,
    error: null,
  });

  const validateAdmin = useCallback(async (user: User) => {
    const idToken = await user.getIdToken();
    const session = await verifyAdminSessionAction(idToken);
    setState({
      user,
      email: session.email,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser?.email) {
        setState({
          user: null,
          email: null,
          loading: false,
          error: null,
        });
        return;
      }

      try {
        await validateAdmin(firebaseUser);
      } catch (err) {
        await signOut(auth);
        setState({
          user: null,
          email: null,
          loading: false,
          error:
            err instanceof Error
              ? err.message
              : "Không có quyền truy cập bảng quản trị",
        });
      }
    });

    return unsubscribe;
  }, [validateAdmin]);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      await validateAdmin(cred.user);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message.includes("auth/")
            ? "Email hoặc mật khẩu không đúng"
            : err.message
          : "Đăng nhập thất bại";
      setState({
        user: null,
        email: null,
        loading: false,
        error: message,
      });
      throw new Error(message);
    }
  }, [validateAdmin]);

  const logout = useCallback(async () => {
    await signOut(auth);
    setState({
      user: null,
      email: null,
      loading: false,
      error: null,
    });
  }, []);

  const getIdToken = useCallback(async (): Promise<string> => {
    if (!auth.currentUser) {
      throw new Error("Chưa đăng nhập");
    }
    return auth.currentUser.getIdToken(true);
  }, []);

  return {
    ...state,
    isAdmin: Boolean(state.user && state.email),
    login,
    logout,
    getIdToken,
  };
}
