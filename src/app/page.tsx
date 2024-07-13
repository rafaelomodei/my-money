import * as React from 'react';

import { AsideBar } from '@/components/organisms/AsideBar';
import { Header } from '@/components/organisms/Header';
import { HeaderInfo } from '@/components/organisms/HeaderInfo';
import { ReleaseTabs } from '@/components/organisms/AccountingTab';
import { Resume } from '@/components/organisms/Resume';

const Dashboard = () => {
  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <AsideBar />
      <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
        <Header />
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
          <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
            <HeaderInfo />
            <ReleaseTabs />
          </div>
          <div>
            <Resume />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
