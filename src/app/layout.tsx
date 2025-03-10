import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/shared/components/theme-provider';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

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
    <html lang='pt'>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem={false}
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
