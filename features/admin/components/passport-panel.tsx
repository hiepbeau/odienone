"use client";

import { useQuery } from "@tanstack/react-query";
import { formatNumber } from "@/lib/utils";
import { getAdminPassportStatsAction } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PassportPanelProps {
  getIdToken: () => Promise<string>;
}

export function PassportPanel({ getIdToken }: PassportPanelProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-passport-stats"],
    queryFn: async () => {
      const token = await getIdToken();
      return getAdminPassportStatsAction(token);
    },
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Đang tải hộ chiếu...</p>;
  }

  if (error || !data) {
    return (
      <p className="text-sm text-destructive">
        Không thể tải thống kê hộ chiếu.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Người có hộ chiếu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatNumber(data.holders)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Tổng lượt quét tem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatNumber(data.totalScans)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-4">Tem theo địa điểm</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.locationScans.map((location) => (
              <div
                key={location.locationId}
                className="flex items-center justify-between text-sm py-2 border-b last:border-0"
              >
                <span>{location.nameVi}</span>
                <span className="font-medium">{formatNumber(location.count)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-semibold mb-4">Top người chơi</h3>
          <div className="space-y-2">
            {data.topTravelers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có dữ liệu.</p>
            ) : (
              data.topTravelers.map((traveler, index) => (
                <div
                  key={traveler.userId}
                  className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                >
                  <span>
                    #{index + 1} {traveler.displayName}
                  </span>
                  <span className="font-medium">
                    {traveler.stampCount} tem
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
