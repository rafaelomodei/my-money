'use client';

import { useMemo } from 'react';
import { Pie, PieChart } from 'recharts';

import { TrendingUp } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { formatCurrency } from '@/shared/utils/currency';
import { createChartConfig, createPieDataset, getChartLabel } from './utils';

export type PieChartEntry = {
  id: string;
  label: string;
  value: number;
  color: string;
};

type CategoryExpensesChartProps = {
  data: PieChartEntry[];
  description: string;
};

const CategoryExpensesChart = ({ data, description }: CategoryExpensesChartProps) => {
  const chartConfig = useMemo(() => createChartConfig(data), [data]);
  const pieData = useMemo(() => createPieDataset(data, 'category'), [data]);
  const total = useMemo(() => data.reduce((sum, entry) => sum + entry.value, 0), [data]);
  const hasData = data.length > 0;

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Gastos por categoria</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className='[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[280px]'
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={pieData}
                dataKey='value'
                nameKey='category'
                label={({ name }) => getChartLabel(chartConfig, name ?? '')}
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className='flex h-[280px] items-center justify-center text-sm text-muted-foreground'>
            Nenhuma despesa por categoria encontrada no período selecionado
          </div>
        )}
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          Total de despesas: {formatCurrency(total)}
          <TrendingUp className='h-4 w-4 text-muted-foreground' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Distribuição dos gastos por categoria no período selecionado
        </div>
      </CardFooter>
    </Card>
  );
};

export { CategoryExpensesChart };
