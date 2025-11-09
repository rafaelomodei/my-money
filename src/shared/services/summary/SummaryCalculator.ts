import { SummaryUpsertData } from '@/shared/interface/summary/summary.dto';
import { TransactionDTO } from '@/shared/interface/transaction/transaction.dto';

export interface SummaryCalculationContext {
  userId: string;
  year: number;
  month: number;
}

export interface SummaryCalculator {
  calculate(
    transactions: TransactionDTO[],
    context: SummaryCalculationContext
  ): SummaryUpsertData;
}
