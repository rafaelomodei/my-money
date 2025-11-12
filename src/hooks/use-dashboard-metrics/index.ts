'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { DashboardMetricsDTO } from '@/shared/interface/dashboard/dashboardMetrics.dto';
import {
  dashboardMetricsServer,
  monthlyDashboardMetricsSynchronizer,
} from '@/shared/server';

const dashboardMetricsKeys = {
  all: ['dashboard-metrics'] as const,
  detail: (userId: string | null, year: number, month: number) =>
    ['dashboard-metrics', userId, year, month] as const,
};

interface UseDashboardMetricsParams {
  userId?: string | null;
  year: number;
  month: number;
  enabled?: boolean;
}

const useDashboardMetrics = ({
  userId,
  year,
  month,
  enabled = true,
}: UseDashboardMetricsParams): UseQueryResult<DashboardMetricsDTO | null> => {
  const canFetch = Boolean(userId && year && month);

  return useQuery({
    queryKey: dashboardMetricsKeys.detail(userId ?? null, year, month),
    enabled: enabled && canFetch,
    queryFn: async () => {
      if (!userId) {
        return null;
      }

      const metrics = await dashboardMetricsServer.getByMonth(
        userId,
        year,
        month
      );

      if (metrics) {
        return metrics;
      }

      return monthlyDashboardMetricsSynchronizer.sync({
        userId,
        year,
        month,
      });
    },
  });
};

export { useDashboardMetrics, dashboardMetricsKeys };
