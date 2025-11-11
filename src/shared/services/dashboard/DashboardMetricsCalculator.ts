import { TransactionOrigin } from '@/shared/constants/finance';
import { TransactionDTO } from '@/shared/interface/transaction/transaction.dto';
import {
  DashboardMetricEntryDTO,
  DashboardMetricsUpsertData,
} from '@/shared/interface/dashboard/dashboardMetrics.dto';

export interface DashboardMetricsCalculationContext {
  userId: string;
  year: number;
  month: number;
}

export interface DashboardMetricsCalculator {
  calculate(
    transactions: TransactionDTO[],
    context: DashboardMetricsCalculationContext
  ): DashboardMetricsUpsertData;
}

const sanitizeKey = (value: string): string => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
};

const DEFAULT_CATEGORY_KEY = 'sem-categoria';
const DEFAULT_CATEGORY_LABEL = 'Sem categoria';
const DEFAULT_BANK_KEY = 'sem-banco';
const DEFAULT_BANK_LABEL = 'Sem banco';

const createEntry = (key: string, label: string): DashboardMetricEntryDTO => ({
  key,
  label,
  total: 0,
});

const accumulateValue = (
  map: Map<string, DashboardMetricEntryDTO>,
  key: string,
  label: string,
  amount: number
) => {
  const existingEntry = map.get(key) ?? createEntry(key, label);
  existingEntry.total += amount;
  map.set(key, existingEntry);
};

const buildEntries = (
  entriesMap: Map<string, DashboardMetricEntryDTO>
): DashboardMetricEntryDTO[] => {
  return Array.from(entriesMap.values())
    .filter((entry) => entry.total > 0)
    .sort((first, second) => second.total - first.total);
};

export class DefaultDashboardMetricsCalculator
  implements DashboardMetricsCalculator
{
  calculate(
    transactions: TransactionDTO[],
    context: DashboardMetricsCalculationContext
  ): DashboardMetricsUpsertData {
    const expenseTransactions = transactions.filter(
      (transaction) => transaction.origin === TransactionOrigin.EXPENSE
    );

    const bankTotalsMap = new Map<string, DashboardMetricEntryDTO>();
    const categoryTotalsMap = new Map<string, DashboardMetricEntryDTO>();

    expenseTransactions.forEach((transaction) => {
      if (transaction.value <= 0) {
        return;
      }

      const bankLabel = transaction.bank?.toString().trim() || DEFAULT_BANK_LABEL;
      const bankKey = sanitizeKey(bankLabel) || DEFAULT_BANK_KEY;
      accumulateValue(bankTotalsMap, bankKey, bankLabel, transaction.value);

      const categoryLabel = transaction.category ?? DEFAULT_CATEGORY_LABEL;
      const categoryKey = sanitizeKey(categoryLabel) || DEFAULT_CATEGORY_KEY;
      accumulateValue(
        categoryTotalsMap,
        categoryKey,
        categoryLabel,
        transaction.value
      );
    });

    return {
      userId: context.userId,
      year: context.year,
      month: context.month,
      bankTotals: buildEntries(bankTotalsMap),
      categoryTotals: buildEntries(categoryTotalsMap),
    };
  }
}
