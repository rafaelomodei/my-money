'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { Progress } from '@/shared/components/ui/progress';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { SummaryDTO } from '@/shared/interface/summary/summary.dto';
import { formatCurrency } from '@/shared/utils/currency';
import { formatMonthAndYear } from '@/shared/utils/date';

interface HeaderInfoProps {
  summary: SummaryDTO | null | undefined;
  isLoading: boolean;
  selectedMonth: number;
  selectedYear: number;
}

const HeaderInfo = ({
  summary,
  isLoading,
  selectedMonth,
  selectedYear,
}: HeaderInfoProps) => {
  const router = useRouter();

  const handleAddTransaction = () => {
    router.push('/nova-transacao');
  };

  const formattedMonthAndYear = React.useMemo(
    () => formatMonthAndYear(selectedMonth, selectedYear),
    [selectedMonth, selectedYear]
  );

  const incomeTotal = summary?.incomeTotal ?? 0;
  const expenseTotal = summary?.expenseTotal ?? 0;
  const totalVolume = incomeTotal + expenseTotal;

  const incomeProgress = totalVolume
    ? Math.min((incomeTotal / totalVolume) * 100, 100)
    : 0;
  const expenseProgress = totalVolume
    ? Math.min((expenseTotal / totalVolume) * 100, 100)
    : 0;

  const incomeLabel = isLoading ? '--' : formatCurrency(incomeTotal);
  const expenseLabel = isLoading ? '--' : formatCurrency(expenseTotal);

  return (
    <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6'>
      <Card
        className='sm:col-span-2 md:col-span-4 xl:col-span-2'
        x-chunk='dashboard-05-chunk-0'
      >
        <CardHeader className='pb-3'>
          <CardTitle>Adicionar nova transação</CardTitle>
          <CardDescription className='max-w-lg text-balance leading-relaxed'>
            Registre uma nova transação com detalhes para manter suas finanças
            organizadas.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={handleAddTransaction}>
            + Adicionar nova transação
          </Button>
        </CardFooter>
      </Card>
      <Card className='sm:col-span-2' x-chunk='dashboard-05-chunk-1'>
        <CardHeader className='pb-2'>
          <CardDescription>+ Receita</CardDescription>
          <CardTitle className='flex gap-4 text-4xl'>
            <p className='text-xl content-end'>R$</p>
            <span className='truncate'>{incomeLabel.replace('R$', '').trim()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-xs text-muted-foreground'>
            Total do mês de {formattedMonthAndYear}
          </div>
        </CardContent>
        <CardFooter>
          <Progress value={incomeProgress} aria-label='Percentual de receitas' />
        </CardFooter>
      </Card>
      <Card className='sm:col-span-2' x-chunk='dashboard-05-chunk-2'>
        <CardHeader className='pb-2'>
          <CardDescription>- Despesa</CardDescription>
          <CardTitle className='flex gap-4 text-4xl'>
            <p className='text-xl content-end'>R$</p>
            <span className='truncate'>
              {expenseLabel.replace('R$', '').trim()}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-xs text-muted-foreground'>
            Total do mês de {formattedMonthAndYear}
          </div>
        </CardContent>
        <CardFooter>
          <Progress value={expenseProgress} aria-label='Percentual de despesas' />
        </CardFooter>
      </Card>
    </div>
  );
};

export { HeaderInfo };
