export interface DashboardMetricEntryDTO {
  key: string;
  label: string;
  total: number;
}

export interface DashboardMetricsDTO {
  id: string;
  userId: string;
  year: number;
  month: number;
  bankTotals: DashboardMetricEntryDTO[];
  categoryTotals: DashboardMetricEntryDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardMetricsUpsertData {
  userId: string;
  year: number;
  month: number;
  bankTotals: DashboardMetricEntryDTO[];
  categoryTotals: DashboardMetricEntryDTO[];
}
