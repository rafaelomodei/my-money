'use client';

import { File, ListFilter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { transactionServer } from '@/shared/server';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useMemo, useState } from 'react';
import { TransactionTable } from '@/shared/components/molecules/TransactionTable/TransactionTable';
import { useCurrentUser } from '@/hooks/use-current-user';

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const ReleaseTabs = () => {
  const [selectedTab, setSelectedTab] = useState('week'); // 🔹 Aba selecionada
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 🔹 Mês atual
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // 🔹 Ano atual
  const { user, isLoading: isUserLoading } = useCurrentUser();

  const dateRangeFetcher = useMemo(() => {
    if (!user) return undefined;

    return async (startDate: Date, endDate: Date) => {
      return transactionServer.getByDateRange(user.uid, startDate, endDate);
    };
  }, [user]);

  const {
    data: transactions,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      'transactions',
      user?.uid,
      selectedTab,
      selectedMonth,
      selectedYear,
    ],
    queryFn: async () => {
      if (!dateRangeFetcher) return [];

      if (selectedTab === 'week') {
        const startDate = startOfWeek(new Date(), { weekStartsOn: 0 });
        const endDate = endOfWeek(new Date(), { weekStartsOn: 0 });
        return dateRangeFetcher(startDate, endDate);
      }

      if (selectedTab === 'month') {
        const startDate = startOfMonth(new Date(selectedYear, selectedMonth - 1));
        const endDate = endOfMonth(new Date(selectedYear, selectedMonth - 1));
        return dateRangeFetcher(startDate, endDate);
      }

      return [];
    },
    enabled: Boolean(user),
  });

  return (
    <Tabs defaultValue='week' onValueChange={setSelectedTab}>
      <div className='flex items-center'>
        <TabsList>
          <TabsTrigger value='week'>Semana</TabsTrigger>
          <TabsTrigger value='month'>Mês</TabsTrigger>
          <TabsTrigger value='year'>Ano</TabsTrigger>
        </TabsList>
        <div className='ml-auto flex items-center gap-2'>
          {selectedTab === 'month' && (
            <div className='flex items-center gap-2'>
              {/* Select de Mês */}
              <select
                className='border px-2 py-1 rounded-md'
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {months.map((month, index) => (
                  <option key={index + 1} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              {/* 🔹 Select de Ano */}
              <select
                className='border px-2 py-1 rounded-md'
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {[2023, 2024, 2025].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='h-7 gap-1 text-sm'>
                <ListFilter className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only'>Filtro</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Fulfilled
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size='sm' variant='outline' className='h-7 gap-1 text-sm'>
            <File className='h-3.5 w-3.5' />
            <span className='sr-only sm:not-sr-only'>Exportar</span>
          </Button>
        </div>
      </div>

      {/* Exibição da semana */}
      <TabsContent value='week'>
        <Card x-chunk='dashboard-05-chunk-3'>
          <CardHeader className='px-7'>
            <CardTitle>Transações</CardTitle>
            <CardDescription>Últimas transações da semana.</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionTable
              transactions={transactions}
              isLoading={isLoading || isUserLoading}
              error={error}
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Exibição do mês */}
      <TabsContent value='month'>
        <Card x-chunk='dashboard-05-chunk-3'>
          <CardHeader className='px-7'>
            <CardTitle>Transações</CardTitle>
            <CardDescription>
              Transações do mês selecionado: {months[selectedMonth - 1]} /{' '}
              {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionTable
              transactions={transactions}
              isLoading={isLoading || isUserLoading}
              error={error}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export { ReleaseTabs };
