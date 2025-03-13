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
} from 'firebase/firestore';
import { TransactionDTO } from '@/shared/interface/transaction/transaction.dto';

export class TransactionServerFirebaseAdapter implements TransactionServer {
  private readonly db;
  private readonly collection;
  private readonly collectionPath: string;

  constructor() {
    this.db = getFirestore(appFirebase);
    this.collectionPath = 'transactions';
    this.collection = collection(this.db, this.collectionPath);
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
    });

    return {
      id: docRef.id,
      ...transactionData,
      updatedAt: timesRegister.updatedAt.toDate(),
      createdAt: timesRegister.createdAt.toDate(),
    };
  }

  async getAll(): Promise<TransactionDTO[]> {
    const transactionSnapshot = await getDocs(this.collection);

    const transactionList = transactionSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        label: data.label,
        type: data.type,
        paymentStatus: data.paymentStatus,
        method: data.method,
        bank: data.bank,
        value: data.value,
        paymentDate: (data.paymentDate as Timestamp).toDate(),
        updatedAt: (data.updatedAt as Timestamp).toDate(),
        createdAt: (data.createdAt as Timestamp).toDate(),
      } as TransactionDTO;
    });

    return transactionList;
  }

  async getByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<TransactionDTO[]> {
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    const q = query(
      this.collection,
      where('paymentDate', '>=', startTimestamp),
      where('paymentDate', '<=', endTimestamp)
    );

    const querySnapshot = await getDocs(q);

    const transactionList = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        label: data.label,
        type: data.type,
        paymentStatus: data.paymentStatus,
        method: data.method,
        bank: data.bank,
        value: data.value,
        paymentDate: (data.paymentDate as Timestamp).toDate(),
        updatedAt: (data.updatedAt as Timestamp).toDate(),
        createdAt: (data.createdAt as Timestamp).toDate(),
      } as TransactionDTO;
    });

    return transactionList;
  }

  async getByMonth(year: number, month: number): Promise<TransactionDTO[]> {
    const startDate = new Date(year, month - 1, 1, 0, 0, 0); // Primeiro dia do mês
    const endDate = new Date(year, month, 0, 23, 59, 59); // Último dia do mês

    return this.getByDateRange(startDate, endDate);
  }

  async getByID(id: string): Promise<TransactionDTO | undefined> {
    throw new Error('Not implemented');
  }

  async update(newProviderData: TransactionDTO): Promise<TransactionDTO> {
    throw new Error('Not implemented');
  }
}
