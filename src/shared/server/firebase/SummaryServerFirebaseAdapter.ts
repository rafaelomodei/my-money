import { SummaryServer } from '@/shared/interface/summary/summaryServer';
import {
  SummaryDTO,
  SummaryTransactionItemDTO,
  SummaryUpsertData,
} from '@/shared/interface/summary/summary.dto';
import { appFirebase } from './config';
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  Timestamp,
  type CollectionReference,
  type DocumentData,
  type DocumentSnapshot,
} from 'firebase/firestore';
import { PaymentStatus } from '@/shared/interface/transaction/transaction.dto';

interface SummaryTransactionFirestoreData {
  transactionId: string;
  label: string;
  value: number;
  paymentStatus: PaymentStatus;
  paymentDate: Timestamp;
}

interface SummaryFirestoreData {
  userId: string;
  year: number;
  month: number;
  incomeTotal: number;
  expenseTotal: number;
  balance: number;
  incomeTransactions: SummaryTransactionFirestoreData[];
  expenseTransactions: SummaryTransactionFirestoreData[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class SummaryServerFirebaseAdapter implements SummaryServer {
  private readonly db;
  private readonly collection: CollectionReference<DocumentData>;
  private readonly collectionPath: string;

  constructor() {
    this.db = getFirestore(appFirebase);
    this.collectionPath = 'summaries';
    this.collection = collection(this.db, this.collectionPath);
  }

  private getDocumentId(userId: string, year: number, month: number): string {
    const formattedMonth = String(month).padStart(2, '0');
    return `${userId}_${year}-${formattedMonth}`;
  }

  private mapTransactionItem(
    item: SummaryTransactionFirestoreData
  ): SummaryTransactionItemDTO {
    return {
      transactionId: item.transactionId,
      label: item.label,
      value: item.value,
      paymentStatus: item.paymentStatus,
      paymentDate: item.paymentDate.toDate(),
    };
  }

  private mapDocumentToSummary(
    docSnapshot: DocumentSnapshot<DocumentData>
  ): SummaryDTO {
    const data = docSnapshot.data() as SummaryFirestoreData | undefined;

    if (!data) {
      throw new Error('Resumo não encontrado');
    }

    return {
      id: docSnapshot.id,
      userId: data.userId,
      year: data.year,
      month: data.month,
      incomeTotal: data.incomeTotal,
      expenseTotal: data.expenseTotal,
      balance: data.balance,
      incomeTransactions: (data.incomeTransactions ?? []).map((transaction) =>
        this.mapTransactionItem(transaction)
      ),
      expenseTransactions: (data.expenseTransactions ?? []).map((transaction) =>
        this.mapTransactionItem(transaction)
      ),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  }

  private serializeTransactionItem(
    item: SummaryTransactionItemDTO
  ): SummaryTransactionFirestoreData {
    return {
      transactionId: item.transactionId,
      label: item.label,
      value: item.value,
      paymentStatus: item.paymentStatus,
      paymentDate: Timestamp.fromDate(item.paymentDate),
    };
  }

  async getByMonth(
    userId: string,
    year: number,
    month: number
  ): Promise<SummaryDTO | null> {
    const docRef = doc(
      this.collection,
      this.getDocumentId(userId, year, month)
    );
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    return this.mapDocumentToSummary(snapshot);
  }

  async upsert(summaryData: SummaryUpsertData): Promise<SummaryDTO> {
    const documentId = this.getDocumentId(
      summaryData.userId,
      summaryData.year,
      summaryData.month
    );
    const docRef = doc(this.collection, documentId);

    const existingSnapshot = await getDoc(docRef);
    const now = Timestamp.now();
    const createdAtTimestamp = existingSnapshot.exists()
      ? ((existingSnapshot.data() as SummaryFirestoreData)?.createdAt ?? now)
      : now;

    const dataToPersist: SummaryFirestoreData = {
      userId: summaryData.userId,
      year: summaryData.year,
      month: summaryData.month,
      incomeTotal: summaryData.incomeTotal,
      expenseTotal: summaryData.expenseTotal,
      balance: summaryData.balance,
      incomeTransactions: summaryData.incomeTransactions.map((transaction) =>
        this.serializeTransactionItem(transaction)
      ),
      expenseTransactions: summaryData.expenseTransactions.map((transaction) =>
        this.serializeTransactionItem(transaction)
      ),
      createdAt: createdAtTimestamp,
      updatedAt: now,
    };

    await setDoc(docRef, dataToPersist);

    return {
      id: documentId,
      ...summaryData,
      createdAt: createdAtTimestamp.toDate(),
      updatedAt: now.toDate(),
    };
  }
}
