import {
  DashboardMetricsDTO,
  DashboardMetricsUpsertData,
} from './dashboardMetrics.dto';

export interface DashboardMetricsServer {
  getByMonth(
    userId: string,
    year: number,
    month: number
  ): Promise<DashboardMetricsDTO | null>;
  upsert(data: DashboardMetricsUpsertData): Promise<DashboardMetricsDTO>;
}
