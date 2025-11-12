'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { transactionServer } from '@/shared/server';
import type { TransactionDTO } from '@/shared/interface/transaction/transaction.dto';

const transactionsKeys = {
  all: ['transactions'] as const,
  dateRange: (
    userId: string | null,
    startDate: Date | null,
    endDate: Date | null,
    extraKey: readonly unknown[] = []
  ) => [
    'transactions',
    userId,
    startDate ? startDate.toISOString() : null,
    endDate ? endDate.toISOString() : null,
    ...extraKey,
  ] as const,
};

interface UseTransactionsParams {
  userId?: string | null;
  startDate: Date | null;
  endDate: Date | null;
  extraKey?: readonly unknown[];
  enabled?: boolean;
}

const useTransactions = ({
  userId,
  startDate,
  endDate,
  extraKey = [],
  enabled = true,
}: UseTransactionsParams): UseQueryResult<TransactionDTO[]> => {
  const hasRequiredParams = Boolean(userId && startDate && endDate);

  return useQuery({
    queryKey: transactionsKeys.dateRange(
      userId ?? null,
      startDate,
      endDate,
      extraKey
    ),
    enabled: enabled && hasRequiredParams,
    queryFn: async () => {
      if (!userId || !startDate || !endDate) {
        return [];
      }

      return transactionServer.getByDateRange(userId, startDate, endDate);
    },
    placeholderData: [] as TransactionDTO[],
  });
};

export { useTransactions, transactionsKeys };
