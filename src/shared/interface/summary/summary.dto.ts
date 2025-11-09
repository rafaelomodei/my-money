import { PaymentStatus } from '@/shared/interface/transaction/transaction.dto';

export interface SummaryTransactionItemDTO {
  transactionId: string;
  label: string;
  value: number;
  paymentStatus: PaymentStatus;
  paymentDate: Date;
}

export interface SummaryDTO {
  id: string;
  userId: string;
  year: number;
  month: number;
  incomeTotal: number;
  expenseTotal: number;
  balance: number;
  incomeTransactions: SummaryTransactionItemDTO[];
  expenseTransactions: SummaryTransactionItemDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export type SummaryUpsertData = Omit<SummaryDTO, 'id' | 'createdAt' | 'updatedAt'>;
