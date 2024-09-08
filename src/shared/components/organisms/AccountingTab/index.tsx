'use client';
import { useEffect, useState } from 'react';
import { File, ListFilter } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { transactionServer } from '@/shared/server';
import { TransactionDTO } from '@/shared/interface/transaction/transaction.dto';
import { formatDate } from '@/shared/utils/date';

const ReleaseTabs = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<TransactionDTO[] | null>(
    null
  );

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const transactionData = await transactionServer.getAll();
        if (transactionData) setTransactions(transactionData);
      } catch {
        (err: any) => console.error('Failed to fetch transaction data: ', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionData();
  }, []);
  return (
    <Tabs defaultValue='week'>
      <div className='flex items-center'>
        <TabsList>
          <TabsTrigger value='week'>Semana</TabsTrigger>
          <TabsTrigger value='month'>Mês</TabsTrigger>
          <TabsTrigger value='year'>Ano</TabsTrigger>
        </TabsList>
        <div className='ml-auto flex items-center gap-2'>
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
      <TabsContent value='week'>
        <Card x-chunk='dashboard-05-chunk-3'>
          <CardHeader className='px-7'>
            <CardTitle>Transações</CardTitle>
            <CardDescription>Ultimas transações.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className='hidden sm:table-cell'>Tipo</TableHead>
                  <TableHead className='hidden sm:table-cell'>Meio</TableHead>
                  <TableHead className='hidden sm:table-cell'>Status</TableHead>
                  <TableHead className='hidden md:table-cell'>
                    Data da compra
                  </TableHead>
                  <TableHead className='text-right'>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!isLoading &&
                  transactions?.map((transaction, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <div className='font-medium'>{transaction.label}</div>
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          {transaction.type}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          {transaction.bank}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          {transaction.paymentStatus}
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                          {formatDate(transaction.paymentDate)}
                        </TableCell>
                        <TableCell className='text-right'>{`R$ ${transaction.value}`}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export { ReleaseTabs };
