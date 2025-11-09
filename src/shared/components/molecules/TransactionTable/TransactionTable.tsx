'use client';

import { Badge } from '@/shared/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  TRANSACTION_CATEGORY_LABEL,
  TransactionCategory,
  TransactionDTO,
} from '@/shared/interface/transaction/transaction.dto';
import { formatDate } from '@/shared/utils/date';

interface TransactionTableProps {
  transactions: TransactionDTO[] | undefined;
  isLoading: boolean;
  error: unknown;
}

const TransactionTable = ({
  transactions,
  isLoading,
  error,
}: TransactionTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead className='hidden sm:table-cell'>Categoria</TableHead>
          <TableHead className='hidden sm:table-cell'>Tipo</TableHead>
          <TableHead className='hidden sm:table-cell'>Banco</TableHead>
          <TableHead className='hidden sm:table-cell'>Status</TableHead>
          <TableHead className='hidden md:table-cell'>Data da compra</TableHead>
          <TableHead className='text-right'>Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7} className='text-center'>
              Carregando...
            </TableCell>
          </TableRow>
        ) : error ? (
          <TableRow>
            <TableCell colSpan={7} className='text-center text-red-500'>
              Erro ao carregar as transações.
            </TableCell>
          </TableRow>
        ) : transactions?.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={7}
              className='text-center text-muted-foreground'
            >
              Nenhuma transação encontrada.
            </TableCell>
          </TableRow>
        ) : (
          transactions?.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className='font-medium'>{transaction.label}</div>
              </TableCell>
              <TableCell className='hidden sm:table-cell'>
                <Badge
                  variant={
                    transaction.category === TransactionCategory.INCOME
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {
                    TRANSACTION_CATEGORY_LABEL[
                      transaction.category ?? TransactionCategory.EXPENSE
                    ]
                  }
                </Badge>
              </TableCell>
              <TableCell className='hidden sm:table-cell'>
                {transaction.type}
              </TableCell>
              <TableCell className='hidden sm:table-cell'>
                {transaction.bank}
              </TableCell>
              <TableCell className='hidden sm:table-cell'>
                <Badge variant='secondary'>{transaction.paymentStatus}</Badge>
              </TableCell>
              <TableCell className='hidden md:table-cell'>
                {formatDate(transaction.paymentDate)}
              </TableCell>
              <TableCell className='text-right'>{`R$ ${transaction.value.toFixed(
                2
              )}`}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export { TransactionTable };
