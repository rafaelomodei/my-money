'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Home, LineChart, Package2, PanelLeft, Users2 } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/shared/components/ui/sheet';

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case '/inicio':
      return 'Início';
    case '/nova-transacao':
      return 'Nova Transação';
    case '/dashboard':
      return 'Dashboard';
    case '/membros':
      return 'Membros';
    default:
      return 'My Money';
  }
};

const Header = () => {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  const isActive = (href: string): Boolean => href === pathname;

  return (
    <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
      <Sheet>
        <SheetTrigger asChild>
          <Button size='icon' variant='outline' className='sm:hidden'>
            <PanelLeft className='h-5 w-5' />
            <span className='sr-only'>Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='sm:max-w-xs'>
          <SheetTitle>{pageTitle}</SheetTitle> {/* Atualiza dinamicamente */}
          <nav className='grid gap-6 text-lg font-medium'>
            <SheetClose asChild>
              <Link
                href='/inicio'
                className={`flex items-center gap-4 px-2.5 ${
                  isActive('/inicio')
                    ? 'text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Home className='h-5 w-5' />
                Início
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href='/nova-transacao'
                className={`flex items-center gap-4 px-2.5 ${
                  isActive('/nova-transacao')
                    ? 'text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Package2 className='h-5 w-5' />
                Nova Transação
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href='/membros'
                className={`flex items-center gap-4 px-2.5 ${
                  isActive('/membros')
                    ? 'text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Users2 className='h-5 w-5' />
                Membros Familiar
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href='/dashboard'
                className={`flex items-center gap-4 px-2.5 ${
                  isActive('/dashboard')
                    ? 'text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LineChart className='h-5 w-5' />
                Dashboard
              </Link>
            </SheetClose>
          </nav>
        </SheetContent>
      </Sheet>

      <h1 className='text-lg font-semibold'>{pageTitle}</h1>

      <div className='relative ml-auto flex-2 md:grow-0'>
        <p>Rafael Omodei</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='overflow-hidden rounded-full'
          >
            <Image
              src='https://www.pedigree.com.br/cdn-cgi/image/format=auto,q=90/sites/g/files/fnmzdf2401/files/2022-04/hero-icon-Savannah_0.png'
              width={36}
              height={36}
              alt='Avatar'
              className='overflow-hidden rounded-full'
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Configurações</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export { Header };
