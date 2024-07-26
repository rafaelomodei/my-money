import * as React from 'react';

import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const HeaderInfo = () => {
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
          <Button>+ Adicionar nova transação</Button>
        </CardFooter>
      </Card>
      <Card className='sm:col-span-2' x-chunk='dashboard-05-chunk-1'>
        <CardHeader className='pb-2'>
          <CardDescription>+ Receita</CardDescription>
          <CardTitle className='flex gap-4 text-4xl'>
            <p className='text-xl content-end'>R$</p>9,897.56
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-xs text-muted-foreground'>
            Total do mês de julho
          </div>
        </CardContent>
        <CardFooter>
          <Progress value={25} aria-label='25% increase' />
        </CardFooter>
      </Card>
      <Card className='sm:col-span-2' x-chunk='dashboard-05-chunk-2'>
        <CardHeader className='pb-2'>
          <CardDescription>- Dispesa</CardDescription>
          <CardTitle className='flex gap-4 text-4xl'>
            <p className='text-xl content-end'>R$</p>9,897.56
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-xs text-muted-foreground'>
            Total do mês de julho
          </div>
        </CardContent>
        <CardFooter>
          <Progress value={12} aria-label='12% increase' />
        </CardFooter>
      </Card>
    </div>
  );
};

export { HeaderInfo };
