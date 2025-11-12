'use client';

import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { SummaryDTO } from '@/shared/interface/summary/summary.dto';
import { monthlySummarySynchronizer, summaryServer } from '@/shared/server';
import { monthlySummaryKeys } from '@/hooks/use-monthly-summary';

interface HistoryPeriod {
  month: number;
  year: number;
}

interface UseMonthlySummaryHistoryParams {
  userId?: string | null;
  periods: HistoryPeriod[];
  enabled?: boolean;
}

const useMonthlySummaryHistory = ({
  userId,
  periods,
  enabled = true,
}: UseMonthlySummaryHistoryParams): UseQueryResult<SummaryDTO[]> => {
  const periodKey = useMemo(
    () => periods.map(({ year, month }) => `${year}-${month}`),
    [periods]
  );

  const canFetch = Boolean(userId && periods.length > 0);

  return useQuery({
    queryKey: monthlySummaryKeys.history(userId ?? null, periodKey),
    enabled: enabled && canFetch,
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      const results = await Promise.all(
        periods.map(async ({ month, year }) => {
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
        })
      );

      return results;
    },
    placeholderData: [] as SummaryDTO[],
  });
};

export { useMonthlySummaryHistory };
