import { DashboardMetricsDTO } from '@/shared/interface/dashboard/dashboardMetrics.dto';
import { DashboardMetricsServer } from '@/shared/interface/dashboard/dashboardMetricsServer';
import { TransactionServer } from '@/shared/interface/transaction/transactionServer';
import {
  DashboardMetricsCalculationContext,
  DashboardMetricsCalculator,
} from './DashboardMetricsCalculator';

interface MonthlyDashboardMetricsSynchronizerDependencies {
  transactionServer: TransactionServer;
  dashboardMetricsServer: DashboardMetricsServer;
  dashboardMetricsCalculator: DashboardMetricsCalculator;
}

export class MonthlyDashboardMetricsSynchronizer {
  private readonly transactionServer: TransactionServer;
  private readonly dashboardMetricsServer: DashboardMetricsServer;
  private readonly dashboardMetricsCalculator: DashboardMetricsCalculator;

  constructor({
    transactionServer,
    dashboardMetricsServer,
    dashboardMetricsCalculator,
  }: MonthlyDashboardMetricsSynchronizerDependencies) {
    this.transactionServer = transactionServer;
    this.dashboardMetricsServer = dashboardMetricsServer;
    this.dashboardMetricsCalculator = dashboardMetricsCalculator;
  }

  async sync(
    params: DashboardMetricsCalculationContext
  ): Promise<DashboardMetricsDTO> {
    const transactions = await this.transactionServer.getByMonth(
      params.userId,
      params.year,
      params.month
    );

    const metricsData = this.dashboardMetricsCalculator.calculate(
      transactions,
      params
    );

    return this.dashboardMetricsServer.upsert(metricsData);
  }
}
