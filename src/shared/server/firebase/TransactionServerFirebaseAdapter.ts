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
      updatedAt: (timesRegister.updatedAt as Timestamp).toDate(),
      createdAt: (timesRegister.createdAt as Timestamp).toDate(),
    };
  }

  async getAll(): Promise<TransactionDTO[]> {
    const transactionSnapshot = await getDocs(this.collection);

    const transactionList = transactionSnapshot.docs.map((doc) => {
      const data = doc.data();

      console.info(
        'Transaction::data: ',
        (data.paymentDate as Timestamp).toDate().getDate()
      );
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

  async getByID(id: string): Promise<TransactionDTO | undefined> {
    throw new Error('Not implemented');
  }

  async update(newProviderData: TransactionDTO): Promise<TransactionDTO> {
    throw new Error('Not implemented');
  }
}
