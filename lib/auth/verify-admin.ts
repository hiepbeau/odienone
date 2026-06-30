import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export class AdminAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminAuthError";
  }
}

function getAllowedAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export async function verifyAdmin(idToken: string): Promise<{
  uid: string;
  email: string;
}> {
  if (!idToken?.trim()) {
    throw new AdminAuthError("Phiên đăng nhập không hợp lệ");
  }

  const decoded = await getAdminAuth().verifyIdToken(idToken);
  const email = decoded.email?.trim().toLowerCase();

  if (!email) {
    throw new AdminAuthError("Tài khoản admin phải có email");
  }

  const allowedEmails = getAllowedAdminEmails();
  const customRole =
    typeof decoded.role === "string" ? decoded.role : undefined;

  if (customRole === "admin" || allowedEmails.has(email)) {
    return { uid: decoded.uid, email };
  }

  const profile = await getAdminDb().collection("profiles").doc(decoded.uid).get();
  if (profile.data()?.role === "admin") {
    return { uid: decoded.uid, email };
  }

  throw new AdminAuthError("Bạn không có quyền truy cập bảng quản trị");
}
