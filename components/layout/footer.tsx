import Link from "next/link";
import { APP_NAME, FOUNDING_DATE, ANNIVERSARY_DATE } from "@/lib/constants";
import { WordmarkLogo } from "@/components/branding/wordmark-logo";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <WordmarkLogo compact />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dự án số cộng đồng kỷ niệm 1 năm thành lập xã Ô Diên.
              <br />
              {FOUNDING_DATE} → {ANNIVERSARY_DATE}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Trải nghiệm</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/citizen-card" className="hover:text-primary transition-colors">
                  Thẻ Công Dân
                </Link>
              </li>
              <li>
                <Link href="/wrapped" className="hover:text-primary transition-colors">
                  My Ô Diên 2026
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-primary transition-colors">
                  Quiz Ô Diên
                </Link>
              </li>
              <li>
                <Link href="/time-capsule" className="hover:text-primary transition-colors">
                  Hộp Thời Gian
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Cộng đồng</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Mỗi công dân là một phần của câu chuyện Ô Diên.
              Hãy cùng nhau tạo nên kỷ niệm đẹp.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2026 {APP_NAME}. Made with ❤️ by nguyenconghiep.</p>
        </div>
      </div>
    </footer>
  );
}
