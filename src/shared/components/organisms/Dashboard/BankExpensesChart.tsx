'use client';

import { useMemo } from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { TrendingUp } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { formatCurrency } from '@/shared/utils/currency';
import type { PieChartEntry } from './CategoryExpensesChart';
import { createChartConfig, createPieDataset } from './utils';

type BankExpensesChartProps = {
  data: PieChartEntry[];
  description: string;
};

const BankExpensesChart = ({ data, description }: BankExpensesChartProps) => {
  const chartConfig = useMemo(() => createChartConfig(data), [data]);
  const pieData = useMemo(() => createPieDataset(data, 'bank'), [data]);
  const total = useMemo(() => data.reduce((sum, entry) => sum + entry.value, 0), [data]);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Gastos por banco</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-[280px]'>
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={pieData} dataKey='value' nameKey='bank' innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {formatCurrency(total)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }

                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          Bancos monitorados: {data.length}
          <TrendingUp className='h-4 w-4 text-muted-foreground' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Soma de todas as despesas por instituição financeira
        </div>
      </CardFooter>
    </Card>
  );
};

export { BankExpensesChart };
