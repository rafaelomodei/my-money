import { SummaryDTO } from '@/shared/interface/summary/summary.dto';
import { SummaryServer } from '@/shared/interface/summary/summaryServer';
import { TransactionServer } from '@/shared/interface/transaction/transactionServer';
import {
  SummaryCalculationContext,
  SummaryCalculator,
} from './SummaryCalculator';

interface MonthlySummarySynchronizerDependencies {
  transactionServer: TransactionServer;
  summaryServer: SummaryServer;
  summaryCalculator: SummaryCalculator;
}

interface SyncMonthlySummaryParams extends SummaryCalculationContext {}

export class MonthlySummarySynchronizer {
  private readonly transactionServer: TransactionServer;
  private readonly summaryServer: SummaryServer;
  private readonly summaryCalculator: SummaryCalculator;

  constructor({
    transactionServer,
    summaryServer,
    summaryCalculator,
  }: MonthlySummarySynchronizerDependencies) {
    this.transactionServer = transactionServer;
    this.summaryServer = summaryServer;
    this.summaryCalculator = summaryCalculator;
  }

  async sync(params: SyncMonthlySummaryParams): Promise<SummaryDTO> {
    const transactions = await this.transactionServer.getByMonth(
      params.userId,
      params.year,
      params.month
    );

    const summaryData = this.summaryCalculator.calculate(transactions, params);

    return this.summaryServer.upsert(summaryData);
  }
}
