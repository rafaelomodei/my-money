'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { addMonths, subMonths } from 'date-fns';
import { HeaderInfo } from '@/shared/components/organisms/HeaderInfo';
import { ReleaseTabs } from '@/shared/components/organisms/AccountingTab';
import { Resume } from '@/shared/components/organisms/Resume';
import { FinancialSummaryChart } from '@/shared/components/organisms/FinancialSummaryChart';
import { useCurrentUser } from '@/hooks/use-current-user';
import { monthlySummarySynchronizer, summaryServer } from '@/shared/server';

const Dashboard = () => {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const selectedMonth = selectedDate.getMonth() + 1;
  const selectedYear = selectedDate.getFullYear();

  const chartMonths = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => {
      const date = subMonths(selectedDate, 11 - index);

      return {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        date,
      };
    });
  }, [selectedDate]);

  const summaryQuery = useQuery({
    queryKey: ['monthly-summary', user?.uid, selectedYear, selectedMonth],
    queryFn: async () => {
      if (!user) return null;

      const existingSummary = await summaryServer.getByMonth(
        user.uid,
        selectedYear,
        selectedMonth
      );

      if (existingSummary) {
        return existingSummary;
      }

      return monthlySummarySynchronizer.sync({
        userId: user.uid,
        year: selectedYear,
        month: selectedMonth,
      });
    },
    enabled: Boolean(user),
  });

  const summaryHistoryQuery = useQuery({
    queryKey: [
      'monthly-summary-history',
      user?.uid,
      chartMonths.map(({ year, month }) => `${year}-${month}`),
    ],
    queryFn: async () => {
      if (!user) return [];

      return Promise.all(
        chartMonths.map(async ({ month, year }) => {
          const existingSummary = await summaryServer.getByMonth(
            user.uid,
            year,
            month
          );

          if (existingSummary) {
            return existingSummary;
          }

          return monthlySummarySynchronizer.sync({
            userId: user.uid,
            year,
            month,
          });
        })
      );
    },
    enabled: Boolean(user),
  });

  const chartData = useMemo(() => {
    return chartMonths.map(({ date, month, year }, index) => {
      const summary = summaryHistoryQuery.data?.[index];
      const monthLabel = date
        .toLocaleDateString('pt-BR', { month: 'short' })
        .replace('.', '');
      const capitalizedLabel =
        monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

      return {
        label: capitalizedLabel,
        month,
        year,
        income: summary?.incomeTotal ?? 0,
        expense: summary?.expenseTotal ?? 0,
      };
    });
  }, [chartMonths, summaryHistoryQuery.data]);

  const handlePreviousMonth = () => {
    setSelectedDate((previousDate) => subMonths(previousDate, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate((previousDate) => addMonths(previousDate, 1));
  };

  return (
    <>
      <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
        <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
          <HeaderInfo
            summary={summaryQuery.data}
            isLoading={summaryQuery.isLoading || isUserLoading}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
          <FinancialSummaryChart
            data={chartData}
            isLoading={summaryHistoryQuery.isLoading || isUserLoading}
            period={{
              start: chartMonths[0]?.date ?? null,
              end: chartMonths[chartMonths.length - 1]?.date ?? null,
            }}
          />
          <ReleaseTabs />
        </div>
        <div>
          <Resume
            summary={summaryQuery.data}
            isLoading={summaryQuery.isLoading || isUserLoading}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
          />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
