'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  LineChart,
  FilePlus,
  Package2,
  Settings,
  Users2,
} from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

const navLinks = [
  { href: '/inicio', label: 'Início', icon: Home },
  {
    href: '/nova-transacao',
    label: 'Adicionar nova Transação',
    icon: FilePlus,
  },
  { href: '/membros', label: 'Membros Familiar', icon: Users2 },
  { href: '/dashboard', label: 'Dashboard', icon: LineChart },
];

const AsideBar = () => {
  const pathname = usePathname();

  return (
    <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
      <nav className='flex flex-col items-center gap-4 px-2 sm:py-4'>
        {/* Ícone da Logo */}
        <Link
          href='/inicio'
          className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base'
        >
          <Package2 className='h-4 w-4 transition-all group-hover:scale-110' />
          <span className='sr-only'>Acme Inc</span>
        </Link>

        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Tooltip key={href}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className='h-5 w-5' />
                  <span className='sr-only'>{label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side='right'>{label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <nav className='mt-auto flex flex-col items-center gap-4 px-2 sm:py-4'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href='/configuracoes'
              className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'
            >
              <Settings className='h-5 w-5' />
              <span className='sr-only'>Configurações</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side='right'>Configurações</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
};

export { AsideBar };
