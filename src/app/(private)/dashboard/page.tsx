'use client';

import { useMemo, useState } from 'react';

import {
  BankExpensesChart,
  CategoryExpensesChart,
  DashboardFilters,
  type PieChartEntry,
  type DashboardFilterOption,
} from '@/shared/components/organisms/Dashboard';

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

const DashboardPage = () => {
  const now = useMemo(() => new Date(), []);
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

  const categoryExpensesData = useMemo<PieChartEntry[]>(
    () => [
      { id: 'alimentacao', label: 'Alimentação', value: 2800, color: 'hsl(var(--chart-1))' },
      { id: 'moradia', label: 'Moradia', value: 1900, color: 'hsl(var(--chart-2))' },
      { id: 'lazer', label: 'Lazer', value: 750, color: 'hsl(var(--chart-3))' },
      { id: 'educacao', label: 'Educação', value: 640, color: 'hsl(var(--chart-4))' },
      { id: 'saude', label: 'Saúde', value: 420, color: 'hsl(var(--chart-5))' },
    ],
    []
  );

  const bankExpensesData = useMemo<PieChartEntry[]>(
    () => [
      { id: 'banco-central', label: 'Banco Central', value: 2100, color: 'hsl(var(--chart-1))' },
      { id: 'banco-nacional', label: 'Banco Nacional', value: 1600, color: 'hsl(var(--chart-2))' },
      { id: 'digital-one', label: 'Digital One', value: 940, color: 'hsl(var(--chart-3))' },
      { id: 'carteira', label: 'Carteira', value: 470, color: 'hsl(var(--chart-4))' },
    ],
    []
  );

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
