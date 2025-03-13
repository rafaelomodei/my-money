import { AsideBar } from '@/shared/components/organisms/AsideBar';
import { Header } from '@/shared/components/organisms/Header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Money',
  description: 'Gerencie suas financias',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <AsideBar />
      <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
        <Header />
        {children}
      </div>
    </div>
  );
}
