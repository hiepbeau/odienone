"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export type AuthErrorCode = "configuration-not-found" | "unknown" | null;

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  idToken: string | null;
  authError: AuthErrorCode;
  authErrorMessage: string | null;
  ensureAuth: () => Promise<User>;
  getIdToken: () => Promise<string>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function parseAuthError(err: unknown): {
  code: AuthErrorCode;
  message: string;
} {
  const firebaseCode =
    err && typeof err === "object" && "code" in err
      ? String((err as { code: string }).code)
      : "";

  if (firebaseCode === "auth/configuration-not-found") {
    return {
      code: "configuration-not-found",
      message:
        "Firebase Authentication chưa được bật cho project này. Vào Firebase Console → Authentication → Get started, sau đó bật Anonymous.",
    };
  }

  if (firebaseCode === "auth/operation-not-allowed") {
    return {
      code: "configuration-not-found",
      message:
        "Đăng nhập Anonymous chưa được bật. Vào Firebase Console → Authentication → Sign-in method → Anonymous → Enable.",
    };
  }

  return {
    code: "unknown",
    message:
      err instanceof Error ? err.message : "Không thể đăng nhập. Vui lòng thử lại.",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<AuthErrorCode>(null);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          setIdToken(token);
          setAuthError(null);
          setAuthErrorMessage(null);
        } else {
          setIdToken(null);
        }
        setLoading(false);
      },
      (err) => {
        const parsed = parseAuthError(err);
        setAuthError(parsed.code);
        setAuthErrorMessage(parsed.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const ensureAuth = useCallback(async (): Promise<User> => {
    if (auth.currentUser) return auth.currentUser;

    try {
      const cred = await signInAnonymously(auth);
      const token = await cred.user.getIdToken();
      setIdToken(token);
      setAuthError(null);
      setAuthErrorMessage(null);
      return cred.user;
    } catch (err) {
      const parsed = parseAuthError(err);
      setAuthError(parsed.code);
      setAuthErrorMessage(parsed.message);
      throw err;
    }
  }, []);

  const getIdToken = useCallback(async (): Promise<string> => {
    const current = auth.currentUser ?? (await ensureAuth());
    const token = await current.getIdToken(true);
    setIdToken(token);
    return token;
  }, [ensureAuth]);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
    setAuthErrorMessage(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        idToken,
        authError,
        authErrorMessage,
        ensureAuth,
        getIdToken,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
