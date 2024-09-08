import { TransactionDTO } from "./transaction.dto";

export interface TransactionServer {
  create(transactionData: Omit<TransactionDTO, 'id'>): Promise<TransactionDTO>;
  getAll(): Promise<TransactionDTO[]>
  getByID(id: string): Promise<TransactionDTO | undefined>;
  update(transactionData: TransactionDTO): Promise<TransactionDTO>;
}
