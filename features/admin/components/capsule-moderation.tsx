"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Download, EyeOff, Globe, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  exportCapsulesCsvAction,
  getAdminCapsulesAction,
  updateCapsuleStatusAction,
} from "@/actions/admin";
import { downloadCsvFile } from "../lib/download-csv";
import type { CapsuleStatus } from "@/types";

interface CapsuleModerationProps {
  getIdToken: () => Promise<string>;
}

const FILTERS: { label: string; value?: CapsuleStatus }[] = [
  { label: "Tất cả" },
  { label: "Chờ duyệt", value: "pending" },
  { label: "Đã duyệt", value: "approved" },
  { label: "Từ chối", value: "rejected" },
];

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN");
}

export function CapsuleModeration({ getIdToken }: CapsuleModerationProps) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<CapsuleStatus | undefined>("pending");
  const [exporting, setExporting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-capsules", filter],
    queryFn: async () => {
      const token = await getIdToken();
      return getAdminCapsulesAction(token, filter);
    },
    retry: (failureCount, error) => {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("index") && failureCount < 3) return true;
      return failureCount < 1;
    },
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  const capsules = data?.capsules ?? [];
  const indexBuilding = data?.indexBuilding;

  const moderate = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "approved" | "rejected";
    }) => {
      const token = await getIdToken();
      return updateCapsuleStatusAction(token, id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-capsules"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    },
  });

  async function handleExport() {
    setExporting(true);
    try {
      const token = await getIdToken();
      const csv = await exportCapsulesCsvAction(token);
      downloadCsvFile(`odienone-capsules-${Date.now()}.csv`, csv);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <Button
              key={item.label}
              size="sm"
              variant={filter === item.value ? "default" : "outline"}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
          {exporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Xuất CSV
        </Button>
      </div>

      {indexBuilding && (
        <div className="rounded-xl bg-odien-gold/10 text-odien-gold text-sm px-4 py-3">
          Chỉ mục Firestore đang được tạo — dữ liệu vẫn hiển thị bình thường.
          Sau vài phút hệ thống sẽ tự tối ưu truy vấn.
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Đang tải lời nhắn...</p>
      ) : !capsules.length ? (
        <div className="glass-card p-8 text-center text-muted-foreground">
          Không có lời nhắn nào trong mục này.
        </div>
      ) : (
        <div className="space-y-4">
          {capsules.map((capsule) => (
            <article key={capsule.id} className="glass-card p-5 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{capsule.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {capsule.authorName} · {capsule.village} ·{" "}
                    {formatDate(capsule.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={capsule.visibility === "public" ? "default" : "secondary"}>
                    {capsule.visibility === "public" ? (
                      <Globe className="mr-1 h-3 w-3" />
                    ) : (
                      <EyeOff className="mr-1 h-3 w-3" />
                    )}
                    {capsule.visibility === "public" ? "Công khai" : "Riêng tư"}
                  </Badge>
                  <Badge
                    variant={
                      capsule.status === "approved"
                        ? "default"
                        : capsule.status === "rejected"
                          ? "outline"
                          : "secondary"
                    }
                    className={
                      capsule.status === "rejected"
                        ? "border-destructive text-destructive"
                        : undefined
                    }
                  >
                    {capsule.status === "pending" && "Chờ duyệt"}
                    {capsule.status === "approved" && "Đã duyệt"}
                    {capsule.status === "rejected" && "Từ chối"}
                  </Badge>
                </div>
              </div>

              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {capsule.message}
              </p>

              {capsule.status === "pending" && capsule.visibility === "public" && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      moderate.mutate({ id: capsule.id, status: "approved" })
                    }
                    disabled={moderate.isPending}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Duyệt
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      moderate.mutate({ id: capsule.id, status: "rejected" })
                    }
                    disabled={moderate.isPending}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Từ chối
                  </Button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
