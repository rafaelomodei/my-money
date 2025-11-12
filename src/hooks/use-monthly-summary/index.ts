'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { SummaryDTO } from '@/shared/interface/summary/summary.dto';
import { monthlySummarySynchronizer, summaryServer } from '@/shared/server';

const monthlySummaryKeys = {
  all: ['monthly-summary'] as const,
  detail: (userId: string | null, year: number, month: number) =>
    ['monthly-summary', userId, year, month] as const,
  history: (userId: string | null, periods: readonly string[]) =>
    ['monthly-summary-history', userId, periods] as const,
};

interface UseMonthlySummaryParams {
  userId?: string | null;
  year: number;
  month: number;
  enabled?: boolean;
}

const useMonthlySummary = ({
  userId,
  year,
  month,
  enabled = true,
}: UseMonthlySummaryParams): UseQueryResult<SummaryDTO | null> => {
  const canFetch = Boolean(userId && year && month);

  return useQuery({
    queryKey: monthlySummaryKeys.detail(userId ?? null, year, month),
    enabled: enabled && canFetch,
    queryFn: async () => {
      if (!userId) {
        return null;
      }

      const existingSummary = await summaryServer.getByMonth(
        userId,
        year,
        month
      );

      if (existingSummary) {
        return existingSummary;
      }

      return monthlySummarySynchronizer.sync({
        userId,
        year,
        month,
      });
    },
  });
};

export { useMonthlySummary, monthlySummaryKeys };
