'use client';

import { useMemo } from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/components/ui/chart';
import { formatMonthAndYear } from '@/shared/utils/date';
import { formatCurrency } from '@/shared/utils/currency';

type FinancialSummaryChartData = {
  label: string;
  income: number;
  expense: number;
  month: number;
  year: number;
};

type FinancialSummaryChartProps = {
  data: FinancialSummaryChartData[];
  isLoading: boolean;
  period: {
    start: Date | null;
    end: Date | null;
  };
};

const chartConfig = {
  income: {
    label: 'Receitas',
    color: 'hsl(var(--chart-2))',
  },
  expense: {
    label: 'Despesas',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const tooltipFormatter = (value: number, name: string) => {
  const key = name as keyof typeof chartConfig;
  const label = chartConfig[key]?.label ?? name;

  return [formatCurrency(value), label];
};

const formatPeriodLabel = (start: Date | null, end: Date | null): string => {
  if (!start || !end) {
    return 'Período indisponível';
  }

  const startLabel = formatMonthAndYear(start.getMonth() + 1, start.getFullYear());
  const endLabel = formatMonthAndYear(end.getMonth() + 1, end.getFullYear());

  if (startLabel === endLabel) {
    return startLabel;
  }

  return `${startLabel} - ${endLabel}`;
};

const FinancialSummaryChart = ({ data, isLoading, period }: FinancialSummaryChartProps) => {
  const isEmpty = data.length === 0;

  const periodLabel = useMemo(
    () => formatPeriodLabel(period.start, period.end),
    [period.end, period.start]
  );

  const { trendIcon: TrendIcon, trendLabel, trendClassName } = useMemo(() => {
    if (data.length < 2) {
      return {
        trendIcon: Minus,
        trendLabel: 'Aguardando dados suficientes para calcular a tendência.',
        trendClassName: 'text-muted-foreground',
      };
    }

    const current = data[data.length - 1];
    const previous = data[data.length - 2];

    const currentBalance = current.income - current.expense;
    const previousBalance = previous.income - previous.expense;

    const difference = currentBalance - previousBalance;

    if (difference > 0) {
      return {
        trendIcon: TrendingUp,
        trendLabel: `Saldo cresceu ${formatCurrency(difference)} em relação ao mês anterior`,
        trendClassName: 'text-emerald-500',
      };
    }

    if (difference < 0) {
      return {
        trendIcon: TrendingDown,
        trendLabel: `Saldo reduziu ${formatCurrency(Math.abs(difference))} em relação ao mês anterior`,
        trendClassName: 'text-destructive',
      };
    }

    return {
      trendIcon: Minus,
      trendLabel: 'Saldo permaneceu estável em relação ao mês anterior',
      trendClassName: 'text-muted-foreground',
    };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receitas x Despesas</CardTitle>
        <CardDescription>Resumo financeiro dos últimos meses</CardDescription>
      </CardHeader>
      <CardContent className='pt-6'>
        {isLoading ? (
          <div className='flex h-[70px] items-center justify-center text-sm text-muted-foreground'>
            Carregando dados do gráfico...
          </div>
        ) : isEmpty ? (
          <div className='flex h-[70px] items-center justify-center text-sm text-muted-foreground'>
            Ainda não há dados suficientes para exibir o gráfico.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className='h-[70px]'>
            <AreaChart
              accessibilityLayer
              data={data.map((item) => ({
                month: item.label,
                income: item.income,
                expense: item.expense,
              }))}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='month'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator='dot'
                    formatter={(value, name) =>
                      tooltipFormatter(Number(value ?? 0), String(name ?? ''))
                    }
                  />
                }
              />
              <Area
                dataKey='expense'
                type='natural'
                fill='var(--color-expense)'
                fillOpacity={0.4}
                stroke='var(--color-expense)'
                stackId='total'
              />
              <Area
                dataKey='income'
                type='natural'
                fill='var(--color-income)'
                fillOpacity={0.4}
                stroke='var(--color-income)'
                stackId='total'
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className='flex w-full flex-col gap-2 text-sm'>
          <div className='flex items-center gap-2 font-medium leading-none'>
            <TrendIcon className={`h-4 w-4 ${trendClassName}`} />
            <span className={trendClassName}>{trendLabel}</span>
          </div>
          <div className='text-muted-foreground leading-none'>{periodLabel}</div>
        </div>
      </CardFooter>
    </Card>
  );
};

export { FinancialSummaryChart };
