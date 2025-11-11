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
import { DashboardMetricsServer } from '@/shared/interface/dashboard/dashboardMetricsServer';
import {
  DashboardMetricEntryDTO,
  DashboardMetricsDTO,
  DashboardMetricsUpsertData,
} from '@/shared/interface/dashboard/dashboardMetrics.dto';

interface DashboardMetricEntryFirestoreData {
  key: string;
  label: string;
  total: number;
}

interface DashboardMetricsFirestoreData {
  userId: string;
  year: number;
  month: number;
  bankTotals: DashboardMetricEntryFirestoreData[];
  categoryTotals: DashboardMetricEntryFirestoreData[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class DashboardMetricsServerFirebaseAdapter
  implements DashboardMetricsServer
{
  private readonly db;
  private readonly collection: CollectionReference<DocumentData>;
  private readonly collectionPath: string;

  constructor() {
    this.db = getFirestore(appFirebase);
    this.collectionPath = 'dashboardMetrics';
    this.collection = collection(this.db, this.collectionPath);
  }

  private getDocumentId(userId: string, year: number, month: number): string {
    const formattedMonth = String(month).padStart(2, '0');
    return `${userId}_${year}-${formattedMonth}`;
  }

  private mapEntry(
    entry: DashboardMetricEntryFirestoreData
  ): DashboardMetricEntryDTO {
    return {
      key: entry.key,
      label: entry.label,
      total: entry.total,
    };
  }

  private mapDocument(
    snapshot: DocumentSnapshot<DocumentData>
  ): DashboardMetricsDTO {
    const data = snapshot.data() as DashboardMetricsFirestoreData | undefined;

    if (!data) {
      throw new Error('Métricas não encontradas');
    }

    return {
      id: snapshot.id,
      userId: data.userId,
      year: data.year,
      month: data.month,
      bankTotals: (data.bankTotals ?? []).map((entry) => this.mapEntry(entry)),
      categoryTotals: (data.categoryTotals ?? []).map((entry) =>
        this.mapEntry(entry)
      ),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  }

  private serializeEntry(
    entry: DashboardMetricEntryDTO
  ): DashboardMetricEntryFirestoreData {
    return {
      key: entry.key,
      label: entry.label,
      total: entry.total,
    };
  }

  async getByMonth(
    userId: string,
    year: number,
    month: number
  ): Promise<DashboardMetricsDTO | null> {
    const docRef = doc(
      this.collection,
      this.getDocumentId(userId, year, month)
    );
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    return this.mapDocument(snapshot);
  }

  async upsert(
    metricsData: DashboardMetricsUpsertData
  ): Promise<DashboardMetricsDTO> {
    const documentId = this.getDocumentId(
      metricsData.userId,
      metricsData.year,
      metricsData.month
    );
    const docRef = doc(this.collection, documentId);

    const existingSnapshot = await getDoc(docRef);
    const now = Timestamp.now();
    const createdAtTimestamp = existingSnapshot.exists()
      ? ((existingSnapshot.data() as DashboardMetricsFirestoreData)?.createdAt ??
          now)
      : now;

    const dataToPersist: DashboardMetricsFirestoreData = {
      userId: metricsData.userId,
      year: metricsData.year,
      month: metricsData.month,
      bankTotals: metricsData.bankTotals.map((entry) =>
        this.serializeEntry(entry)
      ),
      categoryTotals: metricsData.categoryTotals.map((entry) =>
        this.serializeEntry(entry)
      ),
      createdAt: createdAtTimestamp,
      updatedAt: now,
    };

    await setDoc(docRef, dataToPersist);

    return {
      id: documentId,
      ...metricsData,
      createdAt: createdAtTimestamp.toDate(),
      updatedAt: now.toDate(),
    };
  }
}
