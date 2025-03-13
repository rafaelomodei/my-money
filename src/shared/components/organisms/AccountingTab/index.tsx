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
import { TransactionDTO } from '@/shared/interface/transaction/transaction.dto';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useState } from 'react';
import { TransactionTable } from '@/shared/components/molecules/TransactionTable/TransactionTable';

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

const fetchTransactionsOfWeek = async (): Promise<TransactionDTO[]> => {
  console.info('Buscando transações da semana...');
  const startDate = startOfWeek(new Date(), { weekStartsOn: 0 }); // Domingo
  const endDate = endOfWeek(new Date(), { weekStartsOn: 0 }); // Sábado
  return await transactionServer.getByDateRange(startDate, endDate);
};

const fetchTransactionsOfMonth = async (
  year: number,
  month: number
): Promise<TransactionDTO[]> => {
  console.info(`Buscando transações do mês ${month}/${year}...`);
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(new Date(year, month - 1));
  return await transactionServer.getByDateRange(startDate, endDate);
};

const ReleaseTabs = () => {
  const [selectedTab, setSelectedTab] = useState('week'); // 🔹 Aba selecionada
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 🔹 Mês atual
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // 🔹 Ano atual

  const {
    data: transactions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['transactions', selectedTab, selectedMonth, selectedYear],
    queryFn: async () => {
      if (selectedTab === 'week') {
        return fetchTransactionsOfWeek();
      } else if (selectedTab === 'month') {
        return fetchTransactionsOfMonth(selectedYear, selectedMonth);
      }
      return [];
    },
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
              isLoading={isLoading}
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
              isLoading={isLoading}
              error={error}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export { ReleaseTabs };
