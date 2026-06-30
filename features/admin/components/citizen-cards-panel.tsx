"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  exportCitizenCardsCsvAction,
  getAdminCitizenCardsAction,
} from "@/actions/admin";
import { downloadCsvFile } from "../lib/download-csv";

interface CitizenCardsPanelProps {
  getIdToken: () => Promise<string>;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN");
}

export function CitizenCardsPanel({ getIdToken }: CitizenCardsPanelProps) {
  const [exporting, setExporting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-citizen-cards"],
    queryFn: async () => {
      const token = await getIdToken();
      return getAdminCitizenCardsAction(token);
    },
  });

  async function handleExport() {
    setExporting(true);
    try {
      const token = await getIdToken();
      const csv = await exportCitizenCardsCsvAction(token);
      downloadCsvFile(`odienone-citizen-cards-${Date.now()}.csv`, csv);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
          {exporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Xuất CSV
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Đang tải thẻ công dân...</p>
      ) : !data?.length ? (
        <div className="glass-card p-8 text-center text-muted-foreground">
          Chưa có thẻ công dân nào.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Mã CD</th>
                <th className="px-4 py-3 font-medium">Họ tên</th>
                <th className="px-4 py-3 font-medium">Thôn/xóm</th>
                <th className="px-4 py-3 font-medium">Ngày tạo</th>
                <th className="px-4 py-3 font-medium">Hồ sơ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((card) => (
                <tr key={card.id} className="border-t">
                  <td className="px-4 py-3 font-mono text-xs">{card.citizenId}</td>
                  <td className="px-4 py-3">{card.fullName}</td>
                  <td className="px-4 py-3">{card.village}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(card.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/citizen-card/${card.profileSlug}`}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                      target="_blank"
                    >
                      Xem
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
