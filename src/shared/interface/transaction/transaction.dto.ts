import {
  Bank,
  ExpenseCategory,
  TransactionOrigin,
} from '@/shared/constants/finance';

export interface TransactionDTO {
  id: string;
  userId: string;
  label: string;
  type: string;
  paymentStatus: string;
  bank: Bank | string;
  value: number;
  paymentDate: Date;
  origin: TransactionOrigin;
  category: ExpenseCategory | null;
  updatedAt: Date;
  createdAt: Date;
}
