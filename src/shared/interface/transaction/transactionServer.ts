import { TransactionDTO } from './transaction.dto';

export interface TransactionServer {
  create(
    transactionData: Omit<TransactionDTO, 'id' | 'updatedAt' | 'createdAt'>
  ): Promise<TransactionDTO>;
  getAll(userId: string): Promise<TransactionDTO[]>;
  getByID(id: string): Promise<TransactionDTO | undefined>;
  update(transactionData: TransactionDTO): Promise<TransactionDTO>;
  getByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<TransactionDTO[]>;
  getByMonth(userId: string, year: number, month: number): Promise<TransactionDTO[]>;
}
