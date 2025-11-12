'use client';

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';

import type { TransactionDTO } from '@/shared/interface/transaction/transaction.dto';
import {
  monthlyDashboardMetricsSynchronizer,
  monthlySummarySynchronizer,
  transactionServer,
} from '@/shared/server';
import { dashboardMetricsKeys } from '@/hooks/use-dashboard-metrics';
import { monthlySummaryKeys } from '@/hooks/use-monthly-summary';
import { transactionsKeys } from '@/hooks/use-transactions';

interface CreateTransactionPayload {
  transactions: Array<Omit<TransactionDTO, 'id' | 'updatedAt' | 'createdAt'>>;
}

const useCreateTransaction = (
  options: UseMutationOptions<
    TransactionDTO[],
    unknown,
    CreateTransactionPayload,
    unknown
  > = {}
): UseMutationResult<TransactionDTO[], unknown, CreateTransactionPayload, unknown> => {
  const queryClient = useQueryClient();

  return useMutation<TransactionDTO[], unknown, CreateTransactionPayload, unknown>({
    mutationFn: async ({ transactions }) => {
      if (transactions.length === 0) {
        throw new Error('Nenhuma transação para registrar.');
      }

      const createdTransactions: TransactionDTO[] = [];
      const periodsToSync = new Map<
        string,
        { userId: string; year: number; month: number }
      >();

      for (const transaction of transactions) {
        const createdTransaction = await transactionServer.create(transaction);
        createdTransactions.push(createdTransaction);

        const year = createdTransaction.paymentDate.getFullYear();
        const month = createdTransaction.paymentDate.getMonth() + 1;
        const key = `${createdTransaction.userId}-${year}-${month}`;

        if (!periodsToSync.has(key)) {
          periodsToSync.set(key, {
            userId: createdTransaction.userId,
            year,
            month,
          });
        }
      }

      await Promise.all(
        Array.from(periodsToSync.values()).map(async (period) => {
          await Promise.all([
            monthlySummarySynchronizer.sync(period),
            monthlyDashboardMetricsSynchronizer.sync(period),
          ]);
        })
      );

      return createdTransactions;
    },
    onSuccess: (createdTransactions, variables, context) => {
      queryClient.invalidateQueries({ queryKey: transactionsKeys.all });
      queryClient.invalidateQueries({ queryKey: monthlySummaryKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardMetricsKeys.all });

      options?.onSuccess?.(createdTransactions, variables, context);
    },
    ...options,
  });
};

export { useCreateTransaction };
export type { CreateTransactionPayload };
