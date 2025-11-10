import { TransactionServer } from '@/shared/interface/transaction/transactionServer';
import { appFirebase } from './config';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  Timestamp,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { TransactionDTO } from '@/shared/interface/transaction/transaction.dto';
import {
  ExpenseCategory,
  TransactionOrigin,
  TRANSACTION_ORIGINS,
} from '@/shared/constants/finance';

const TRANSACTION_ORIGIN_VALUES = new Set<string>(TRANSACTION_ORIGINS);

export class TransactionServerFirebaseAdapter implements TransactionServer {
  private readonly db;
  private readonly collection;
  private readonly collectionPath: string;

  constructor() {
    this.db = getFirestore(appFirebase);
    this.collectionPath = 'transactions';
    this.collection = collection(this.db, this.collectionPath);
  }

  private mapDocumentToTransaction(
    doc: QueryDocumentSnapshot<DocumentData>
  ): TransactionDTO {
    const data = doc.data();
    const rawCategory = data.category as string | undefined;
    const rawOrigin = data.origin as TransactionOrigin | undefined;
    const origin: TransactionOrigin =
      rawOrigin ??
      (rawCategory && TRANSACTION_ORIGIN_VALUES.has(rawCategory)
        ? (rawCategory as TransactionOrigin)
        : TransactionOrigin.EXPENSE);
    const category: ExpenseCategory | null =
      origin === TransactionOrigin.EXPENSE &&
      rawCategory &&
      !TRANSACTION_ORIGIN_VALUES.has(rawCategory)
        ? (rawCategory as ExpenseCategory)
        : ((data.expenseCategory as ExpenseCategory) ?? null);

    return {
      id: doc.id,
      label: data.label,
      description: (data.description as string | null) ?? null,
      type: data.type,
      paymentStatus: data.paymentStatus,
      bank: data.bank,
      value: data.value,
      userId: data.userId,
      paymentDate: (data.paymentDate as Timestamp).toDate(),
      origin,
      category,
      memberId: (data.memberId as string | null) ?? null,
      memberName: (data.memberName as string | null) ?? null,
      installmentCount: (data.installmentCount as number | undefined) ?? 1,
      installmentNumber: (data.installmentNumber as number | undefined) ?? 1,
      installmentGroupId: (data.installmentGroupId as string | null) ?? null,
      updatedAt: (data.updatedAt as Timestamp).toDate(),
      createdAt: (data.createdAt as Timestamp).toDate(),
    } as TransactionDTO;
  }

  async create(
    transactionData: Omit<TransactionDTO, 'id' | 'updatedAt' | 'createdAt'>
  ): Promise<TransactionDTO> {
    const timesRegister = {
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(this.collection, {
      ...transactionData,
      ...timesRegister,
      paymentDate: Timestamp.fromDate(transactionData.paymentDate),
      description: transactionData.description ?? null,
      memberId: transactionData.memberId ?? null,
      memberName: transactionData.memberName ?? null,
      installmentCount: transactionData.installmentCount ?? 1,
      installmentNumber: transactionData.installmentNumber ?? 1,
      installmentGroupId: transactionData.installmentGroupId ?? null,
    });

    return {
      id: docRef.id,
      ...transactionData,
      description: transactionData.description ?? null,
      memberId: transactionData.memberId ?? null,
      memberName: transactionData.memberName ?? null,
      installmentCount: transactionData.installmentCount ?? 1,
      installmentNumber: transactionData.installmentNumber ?? 1,
      installmentGroupId: transactionData.installmentGroupId ?? null,
      updatedAt: timesRegister.updatedAt.toDate(),
      createdAt: timesRegister.createdAt.toDate(),
    };
  }

  async getAll(userId: string): Promise<TransactionDTO[]> {
    const transactionQuery = query(
      this.collection,
      where('userId', '==', userId)
    );
    const transactionSnapshot = await getDocs(transactionQuery);

    const transactionList = transactionSnapshot.docs.map((doc) =>
      this.mapDocumentToTransaction(doc)
    );

    return transactionList;
  }

  async getByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<TransactionDTO[]> {
    const userTransactionsQuery = query(
      this.collection,
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(userTransactionsQuery);

    const transactionList = querySnapshot.docs
      .map((doc) => this.mapDocumentToTransaction(doc))
      .filter((transaction) => {
        const paymentDate = transaction.paymentDate.getTime();
        return (
          paymentDate >= startDate.getTime() && paymentDate <= endDate.getTime()
        );
      })
      .sort(
        (firstTransaction, secondTransaction) =>
          firstTransaction.paymentDate.getTime() -
          secondTransaction.paymentDate.getTime()
      );

    return transactionList;
  }

  async getByMonth(
    userId: string,
    year: number,
    month: number
  ): Promise<TransactionDTO[]> {
    const startDate = new Date(year, month - 1, 1, 0, 0, 0); // Primeiro dia do mês
    const endDate = new Date(year, month, 0, 23, 59, 59); // Último dia do mês

    return this.getByDateRange(userId, startDate, endDate);
  }

  async getByID(id: string): Promise<TransactionDTO | undefined> {
    throw new Error('Not implemented');
  }

  async update(newProviderData: TransactionDTO): Promise<TransactionDTO> {
    throw new Error('Not implemented');
  }
}
