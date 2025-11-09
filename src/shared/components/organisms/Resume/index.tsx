'use client';

import * as React from 'react';

import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/shared/components/ui/pagination';
import { Separator } from '@/shared/components/ui/separator';
import { SummaryDTO } from '@/shared/interface/summary/summary.dto';
import { formatCurrency } from '@/shared/utils/currency';
import { formatMonthAndYear } from '@/shared/utils/date';

interface ResumeProps {
  summary: SummaryDTO | null | undefined;
  isLoading: boolean;
  selectedMonth: number;
  selectedYear: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const EmptyState = ({ label }: { label: string }) => (
  <li className='text-muted-foreground text-sm'>{label}</li>
);

const Resume = ({
  summary,
  isLoading,
  selectedMonth,
  selectedYear,
  onPreviousMonth,
  onNextMonth,
}: ResumeProps) => {
  const formattedMonthAndYear = React.useMemo(
    () => formatMonthAndYear(selectedMonth, selectedYear),
    [selectedMonth, selectedYear]
  );

  const incomeTransactions = summary?.incomeTransactions ?? [];
  const expenseTransactions = summary?.expenseTransactions ?? [];

  const incomeTotal = summary?.incomeTotal ?? 0;
  const expenseTotal = summary?.expenseTotal ?? 0;
  const balance = summary?.balance ?? 0;

  const balanceClassName = React.useMemo(() => {
    if (balance > 0) return 'text-emerald-500';
    if (balance < 0) return 'text-destructive';
    return 'text-muted-foreground';
  }, [balance]);

  return (
    <Card className='overflow-hidden' x-chunk='dashboard-05-chunk-4'>
      <CardHeader className='flex flex-row items-start bg-muted/50'>
        <div className='grid gap-0.5'>
          <CardTitle className='group flex items-center gap-2 text-lg'>
            Resumo
          </CardTitle>
          <CardDescription>{formattedMonthAndYear}</CardDescription>
        </div>
        <div className='ml-auto flex items-center gap-1 hidden'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='icon' variant='outline' className='h-8 w-8'>
                <MoreVertical className='h-3.5 w-3.5' />
                <span className='sr-only'>More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>Exportar PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className='p-6 text-sm'>
        {isLoading ? (
          <div className='text-muted-foreground text-sm'>Carregando resumo...</div>
        ) : (
          <div className='grid gap-3'>
            <div className='font-semibold'>Receitas</div>
            <ul className='grid gap-3'>
              {incomeTransactions.length === 0 ? (
                <EmptyState label='Nenhuma receita registrada para este mês.' />
              ) : (
                incomeTransactions.map((transaction) => (
                  <li
                    key={transaction.transactionId}
                    className='flex items-center justify-between'
                  >
                    <span className='text-muted-foreground'>
                      {transaction.label}
                    </span>
                    <span>{formatCurrency(transaction.value)}</span>
                  </li>
                ))
              )}
            </ul>
            <Separator className='my-2' />
            <div className='font-semibold'>Despesas</div>
            <ul className='grid gap-3'>
              {expenseTransactions.length === 0 ? (
                <EmptyState label='Nenhuma despesa registrada para este mês.' />
              ) : (
                expenseTransactions.map((transaction) => (
                  <li
                    key={transaction.transactionId}
                    className='flex items-center justify-between'
                  >
                    <span className='text-muted-foreground'>
                      {transaction.label}
                    </span>
                    <span>{formatCurrency(transaction.value)}</span>
                  </li>
                ))
              )}
            </ul>
            <Separator className='my-2' />
            <div className='font-semibold'>Total</div>
            <ul className='grid gap-3'>
              <li className='flex items-center justify-between'>
                <span className='text-muted-foreground'>+ Receita</span>
                <span>{formatCurrency(incomeTotal)}</span>
              </li>
              <li className='flex items-center justify-between'>
                <span className='text-muted-foreground'>- Despesa</span>
                <span>{formatCurrency(expenseTotal)}</span>
              </li>
              <li className='flex items-center justify-between'>
                <span className='text-muted-foreground'>= Valor final</span>
                <span className={balanceClassName}>{formatCurrency(balance)}</span>
              </li>
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className='flex flex-row items-center border-t bg-muted/50 px-6 py-3'>
        <div className='text-xs text-muted-foreground'>
          Navegue entre os meses
        </div>
        <Pagination className='ml-auto mr-0 w-auto'>
          <PaginationContent>
            <PaginationItem>
              <Button
                size='icon'
                variant='outline'
                className='h-6 w-6'
                onClick={onPreviousMonth}
                aria-label='Voltar mês'
              >
                <ChevronLeft className='h-3.5 w-3.5' />
                <span className='sr-only'>Voltar mês</span>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                size='icon'
                variant='outline'
                className='h-6 w-6'
                onClick={onNextMonth}
                aria-label='Próximo mês'
              >
                <ChevronRight className='h-3.5 w-3.5' />
                <span className='sr-only'>Próximo mês</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
};

export { Resume };
