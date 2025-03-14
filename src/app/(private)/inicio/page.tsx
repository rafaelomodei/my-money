'use client';
import { HeaderInfo } from '@/shared/components/organisms/HeaderInfo';
import { ReleaseTabs } from '@/shared/components/organisms/AccountingTab';
import { Resume } from '@/shared/components/organisms/Resume';

const Dashboard = () => {
  return (
    <>
      <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
        <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
          <HeaderInfo />
          <ReleaseTabs />
        </div>
        <div>
          <Resume />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
