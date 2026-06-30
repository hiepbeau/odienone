"use client";

import { useQuery } from "@tanstack/react-query";
import { formatNumber } from "@/lib/utils";
import { getAdminQuizStatsAction } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizPanelProps {
  getIdToken: () => Promise<string>;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN");
}

export function QuizPanel({ getIdToken }: QuizPanelProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-quiz-stats"],
    queryFn: async () => {
      const token = await getIdToken();
      return getAdminQuizStatsAction(token);
    },
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Đang tải quiz...</p>;
  }

  if (error || !data) {
    return (
      <p className="text-sm text-destructive">Không thể tải thống kê quiz.</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Tổng lượt làm quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {formatNumber(data.totalResults)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Điểm trung bình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.averageScore}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-4">Phân bố danh hiệu</h3>
          <div className="space-y-2">
            {data.titleBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có dữ liệu.</p>
            ) : (
              data.titleBreakdown.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                >
                  <span>{item.title}</span>
                  <span className="font-medium">{formatNumber(item.count)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-semibold mb-4">Kết quả gần đây</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {data.recentResults.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có dữ liệu.</p>
            ) : (
              data.recentResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-start justify-between gap-3 text-sm py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{result.displayName}</p>
                    <p className="text-muted-foreground text-xs">
                      {result.title} · {formatDate(result.createdAt)}
                    </p>
                  </div>
                  <span className="font-bold text-primary">{result.score}%</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
