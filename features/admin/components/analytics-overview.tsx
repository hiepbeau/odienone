"use client";

import { useQuery } from "@tanstack/react-query";
import {
  IdCard,
  MessageSquare,
  BookOpen,
  Brain,
  MapPin,
  Clock,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { getAdminAnalyticsAction } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsOverviewProps {
  getIdToken: () => Promise<string>;
}

export function AnalyticsOverview({ getIdToken }: AnalyticsOverviewProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const token = await getIdToken();
      return getAdminAnalyticsAction(token);
    },
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Đang tải thống kê...</p>;
  }

  if (error || !data) {
    return (
      <p className="text-sm text-destructive">
        Không thể tải thống kê. Vui lòng thử lại.
      </p>
    );
  }

  const stats = [
    {
      label: "Thẻ Công Dân",
      value: data.citizenCards,
      icon: IdCard,
      accent: "text-primary",
    },
    {
      label: "Lời Nhắn Hộp Thời Gian",
      value: data.messages,
      icon: MessageSquare,
      accent: "text-odien-gold",
    },
    {
      label: "Người Có Hộ Chiếu",
      value: data.passportHolders,
      icon: BookOpen,
      accent: "text-primary",
    },
    {
      label: "Lượt Quét Tem",
      value: data.passportScans,
      icon: MapPin,
      accent: "text-secondary-foreground",
    },
    {
      label: "Kết Quả Quiz",
      value: data.quizResults,
      icon: Brain,
      accent: "text-primary",
    },
    {
      label: "Chờ Duyệt",
      value: data.pendingCapsules,
      icon: Clock,
      accent: "text-odien-gold",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.accent}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatNumber(stat.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Địa điểm hộ chiếu</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data.passportLocations}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Tổng số địa điểm có tem QR trong hệ thống
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
