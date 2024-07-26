import * as React from 'react';

import { File, ListFilter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ReleaseTabs = () => {
  return (
    <Tabs defaultValue='month'>
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
            <CardTitle>Lançamentos</CardTitle>
            <CardDescription>Ultimos lançamentos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className='hidden sm:table-cell'>Tipo</TableHead>
                  <TableHead className='hidden sm:table-cell'>Meio</TableHead>
                  <TableHead className='hidden sm:table-cell'>Status</TableHead>
                  <TableHead className='hidden md:table-cell'>Data da compra</TableHead>
                  <TableHead className='text-right'>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow >
                  <TableCell>
                    <div className='font-medium'>Posto de gasolina</div>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    Crédito
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    Santander
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    pago
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    2023-06-23
                  </TableCell>
                  <TableCell className='text-right'>$250.00</TableCell>
                </TableRow>
                
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export { ReleaseTabs };
