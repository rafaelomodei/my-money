'use client';

import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Label } from '@/shared/components/ui/label';

export type DashboardFilterOption = {
  value: number;
  label: string;
};

type DashboardFiltersProps = {
  className?: string;
  months: DashboardFilterOption[];
  years: number[];
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
};

const DashboardFilters = ({
  className,
  months,
  years,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}: DashboardFiltersProps) => {
  const monthValue = useMemo(() => String(selectedMonth), [selectedMonth]);
  const yearValue = useMemo(() => String(selectedYear), [selectedYear]);

  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end',
        className
      )}
    >
      <div className='grid gap-2'>
        <Label htmlFor='dashboard-month'>Mês</Label>
        <Select
          value={monthValue}
          onValueChange={(value) => onMonthChange(Number(value))}
        >
          <SelectTrigger id='dashboard-month' className='w-[180px]'>
            <SelectValue placeholder='Selecione o mês' />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={String(month.value)}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='grid gap-2'>
        <Label htmlFor='dashboard-year'>Ano</Label>
        <Select
          value={yearValue}
          onValueChange={(value) => onYearChange(Number(value))}
        >
          <SelectTrigger id='dashboard-year' className='w-[180px]'>
            <SelectValue placeholder='Selecione o ano' />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export { DashboardFilters };
