import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card';

const DashboardHeaderSkeleton = () => (
  <section className='rounded-lg border bg-background p-6 shadow-sm'>
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='space-y-2'>
        <Skeleton className='h-6 w-44 sm:w-52' />
        <Skeleton className='h-4 w-full max-w-[420px]' />
      </div>
      <div className='flex w-full flex-col gap-2 sm:w-auto sm:flex-row'>
        <Skeleton className='h-10 w-full sm:w-36' />
        <Skeleton className='h-10 w-full sm:w-36' />
      </div>
    </div>
  </section>
);

const ChartCardSkeleton = () => (
  <Card className='flex flex-col'>
    <CardHeader className='items-center pb-0'>
      <CardTitle>
        <Skeleton className='h-6 w-48' />
      </CardTitle>
      <CardDescription>
        <Skeleton className='mt-2 h-4 w-40' />
      </CardDescription>
    </CardHeader>
    <CardContent className='flex flex-1 items-center justify-center pb-0'>
      <Skeleton className='h-[220px] w-[220px] rounded-full sm:h-[250px] sm:w-[250px]' />
    </CardContent>
    <CardFooter className='flex-col gap-2 text-sm'>
      <Skeleton className='h-4 w-52' />
      <Skeleton className='h-4 w-64' />
    </CardFooter>
  </Card>
);

const DashboardSkeleton = () => (
  <main className='flex-1 p-4 sm:px-6 sm:py-0'>
    <div className='flex flex-col gap-6'>
      <DashboardHeaderSkeleton />
      <section className='grid gap-4 md:grid-cols-2'>
        <ChartCardSkeleton />
        <ChartCardSkeleton />
      </section>
    </div>
  </main>
);

export { DashboardSkeleton };
