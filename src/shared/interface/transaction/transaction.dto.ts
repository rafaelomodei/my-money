import {
  Bank,
  ExpenseCategory,
  TransactionOrigin,
} from '@/shared/constants/finance';

export interface TransactionDTO {
  id: string;
  userId: string;
  label: string;
  description: string | null;
  type: string;
  paymentStatus: string;
  bank: Bank | string;
  value: number;
  paymentDate: Date;
  origin: TransactionOrigin;
  category: ExpenseCategory | null;
  memberId: string | null;
  memberName: string | null;
  installmentCount: number;
  installmentNumber: number;
  installmentGroupId: string | null;
  updatedAt: Date;
  createdAt: Date;
}
