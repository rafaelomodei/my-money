'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useCurrentUser } from '@/hooks/use-current-user';
import {
  BankExpensesChart,
  CategoryExpensesChart,
  DashboardFilters,
  DashboardSkeleton,
  type PieChartEntry,
} from '@/shared/components/organisms/Dashboard';
import { DEFAULT_CHART_PALETTE } from '@/shared/constants/charts';
import { MONTH_FILTER_OPTIONS } from '@/shared/constants/date';
import { dashboardMetricsServer, monthlyDashboardMetricsSynchronizer } from '@/shared/server';
import type { DashboardMetricEntryDTO, DashboardMetricsDTO } from '@/shared/interface/dashboard/dashboardMetrics.dto';
import { createYearRange } from '@/shared/utils/date';

const mapEntriesToPieData = (entries: DashboardMetricEntryDTO[]): PieChartEntry[] => {
  return entries.map((entry, index) => ({
    id: entry.key,
    label: entry.label,
    value: entry.total,
    color: DEFAULT_CHART_PALETTE[index % DEFAULT_CHART_PALETTE.length],
  }));
};

const DashboardPage = () => {
  const now = useMemo(() => new Date(), []);
  const { user } = useCurrentUser();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const availableYears = useMemo(
    () => createYearRange(now.getFullYear()),
    [now]
  );

  const selectedPeriodLabel = useMemo(() => {
    const monthLabel = MONTH_FILTER_OPTIONS.find(
      (month) => month.value === selectedMonth
    )?.label;

    if (!monthLabel) {
      return `${selectedMonth}/${selectedYear}`;
    }

    return `${monthLabel} / ${selectedYear}`;
  }, [selectedMonth, selectedYear]);

  const metricsQuery = useQuery<DashboardMetricsDTO | null>({
    queryKey: ['dashboard-metrics', user?.uid, selectedYear, selectedMonth],
    enabled: Boolean(user),
    queryFn: async () => {
      if (!user) return null;

      const metrics = await dashboardMetricsServer.getByMonth(
        user.uid,
        selectedYear,
        selectedMonth
      );

      if (metrics) {
        return metrics;
      }

      return monthlyDashboardMetricsSynchronizer.sync({
        userId: user.uid,
        year: selectedYear,
        month: selectedMonth,
      });
    },
  });

  const categoryExpensesData = useMemo<PieChartEntry[]>(() => {
    if (!metricsQuery.data) {
      return [];
    }

    return mapEntriesToPieData(metricsQuery.data.categoryTotals);
  }, [metricsQuery.data]);

  const bankExpensesData = useMemo<PieChartEntry[]>(() => {
    if (!metricsQuery.data) {
      return [];
    }

    return mapEntriesToPieData(metricsQuery.data.bankTotals);
  }, [metricsQuery.data]);

  const metricsData = metricsQuery.data;
  const isLoadingMetrics =
    metricsQuery.isPending ||
    metricsQuery.isLoading ||
    (!metricsData && metricsQuery.isFetching);

  if (isLoadingMetrics) {
    return <DashboardSkeleton />;
  }

  return (
    <main className='flex-1 p-4 sm:px-6 sm:py-0'>
      <div className='flex flex-col gap-6'>
        <section className='rounded-lg border bg-background p-6 shadow-sm'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='space-y-1'>
              <h1 className='text-2xl font-semibold tracking-tight'>Dashboard</h1>
              <p className='text-muted-foreground'>Visualize a distribuição dos seus gastos por categoria e banco.</p>
            </div>
            <DashboardFilters
              months={MONTH_FILTER_OPTIONS}
              years={availableYears}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />
          </div>
        </section>

        <section className='grid gap-4 md:grid-cols-2'>
          <CategoryExpensesChart
            data={categoryExpensesData}
            description={`Período selecionado: ${selectedPeriodLabel}`}
          />
          <BankExpensesChart
            data={bankExpensesData}
            description={`Período selecionado: ${selectedPeriodLabel}`}
          />
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
