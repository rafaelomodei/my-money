import { SummaryDTO, SummaryUpsertData } from './summary.dto';

export interface SummaryServer {
  getByMonth(userId: string, year: number, month: number): Promise<SummaryDTO | null>;
  upsert(summaryData: SummaryUpsertData): Promise<SummaryDTO>;
}
