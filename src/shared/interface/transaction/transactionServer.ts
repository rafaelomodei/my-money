import { TransactionDTO } from './transaction.dto';

export interface TransactionServer {
  create(
    transactionData: Omit<TransactionDTO, 'id' | 'updatedAt' | 'createdAt'>
  ): Promise<TransactionDTO>;
  getAll(): Promise<TransactionDTO[]>;
  getByID(id: string): Promise<TransactionDTO | undefined>;
  update(transactionData: TransactionDTO): Promise<TransactionDTO>;
}
