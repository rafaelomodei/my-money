import { TransactionDTO } from './transaction.dto';

export interface TransactionServer {
  create(
    transactionData: Omit<TransactionDTO, 'id' | 'updatedAt' | 'createdAt'>
  ): Promise<TransactionDTO>;
  getAll(): Promise<TransactionDTO[]>;
  getByID(id: string): Promise<TransactionDTO | undefined>;
  update(transactionData: TransactionDTO): Promise<TransactionDTO>;
  getByDateRange(startDate: Date, endDate: Date): Promise<TransactionDTO[]>;
  getByMonth(year: number, month: number): Promise<TransactionDTO[]>;
}
