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

const Resume = () => {
  return (
    <Card className='overflow-hidden' x-chunk='dashboard-05-chunk-4'>
      <CardHeader className='flex flex-row items-start bg-muted/50'>
        <div className='grid gap-0.5'>
          <CardTitle className='group flex items-center gap-2 text-lg'>
            Resumo
          </CardTitle>
          <CardDescription>Junho, 2024</CardDescription>
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
        <div className='grid gap-3'>
          <div className='font-semibold'>Receitas</div>
          <ul className='grid gap-3'>
            <li className='flex items-center justify-between'>
              <span className='text-muted-foreground'>Leega - Rafael</span>
              <span>R$ 250.00</span>
            </li>
            <li className='flex items-center justify-between'>
              <span className='text-muted-foreground'>
                Bolsa mestrado - Maria
              </span>
              <span>R$ 49.00</span>
            </li>
          </ul>
          <Separator className='my-2' />
          <div className='font-semibold'>Dispesas</div>
          <ul className='grid gap-3'>
            <li className='flex items-center justify-between'>
              <span className='text-muted-foreground'>Santander - Rafael</span>
              <span>R$ 250.00</span>
            </li>
            <li className='flex items-center justify-between'>
              <span className='text-muted-foreground'>Nubank - Rafael</span>
              <span>R$ 49.00</span>
            </li>
            <li className='flex items-center justify-between'>
              <span className='text-muted-foreground'>Nubank - Maria</span>
              <span>R$ 49.00</span>
            </li>
            <li className='flex items-center justify-between'>
              <span className='text-muted-foreground'>Casa</span>
              <span>R$ 1,627.00</span>
            </li>
          </ul>
          <Separator className='my-2' />
          <div className='font-semibold'>Total</div>
          <ul className='grid gap-3'>
            <li className='flex items-center justify-between'>
              <span className='text-muted-foreground'>+ Receita</span>
              <span>R$ 250.00</span>
            </li>
            <li className='flex items-center justify-between'>
              <span className='text-muted-foreground'>- Dispesa</span>
              <span>R$ 49.00</span>
            </li>
            <li className='flex items-center justify-between'>
              <span className='text-muted-foreground'>= Valor final</span>
              <span>R$ 49.00</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className='flex flex-row items-center border-t bg-muted/50 px-6 py-3'>
        <div className='text-xs text-muted-foreground'>
          Navegue entre os meses
        </div>
        <Pagination className='ml-auto mr-0 w-auto'>
          <PaginationContent>
            <PaginationItem>
              <Button size='icon' variant='outline' className='h-6 w-6'>
                <ChevronLeft className='h-3.5 w-3.5' />
                <span className='sr-only'>Voltar mês</span>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button size='icon' variant='outline' className='h-6 w-6'>
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
