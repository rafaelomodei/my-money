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
  type DashboardFilterOption,
} from '@/shared/components/organisms/Dashboard';
import { dashboardMetricsServer, monthlyDashboardMetricsSynchronizer } from '@/shared/server';
import type { DashboardMetricEntryDTO, DashboardMetricsDTO } from '@/shared/interface/dashboard/dashboardMetrics.dto';

const monthOptions: DashboardFilterOption[] = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
];

const buildAvailableYears = (baseYear: number, range = 5) =>
  Array.from({ length: range }, (_, index) => baseYear - (range - 1 - index));

const chartPalette = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const mapEntriesToPieData = (entries: DashboardMetricEntryDTO[]): PieChartEntry[] => {
  return entries.map((entry, index) => ({
    id: entry.key,
    label: entry.label,
    value: entry.total,
    color: chartPalette[index % chartPalette.length],
  }));
};

const DashboardPage = () => {
  const now = useMemo(() => new Date(), []);
  const { user } = useCurrentUser();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const availableYears = useMemo(
    () => buildAvailableYears(now.getFullYear()),
    [now]
  );

  const selectedPeriodLabel = useMemo(() => {
    const monthLabel = monthOptions.find((month) => month.value === selectedMonth)?.label;

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
              months={monthOptions}
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
