'use client';

import Link from 'next/link';
import { BarChart3, PiggyBank, DollarSign, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { useFinance } from '@/context/FinanceContext';
import { Button } from '@/components/ui/button';
import { getMonthName } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();
  const { currentMonth } = useFinance();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: <BarChart3 className="h-5 w-5 mr-2" />,
    },
    {
      label: 'Transactions',
      href: '/transactions',
      icon: <DollarSign className="h-5 w-5 mr-2" />,
    },
    {
      label: 'Budget',
      href: '/budget',
      icon: <PiggyBank className="h-5 w-5 mr-2" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <PiggyBank className="h-6 w-6" />
            <span className="font-bold">Finance Visualizer</span>
          </Link>
          <div className="ml-4 text-sm text-muted-foreground">
            {getMonthName(currentMonth + '-01')}
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm flex items-center font-medium transition-colors hover:text-primary',
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t">
        <nav className="flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center py-2 text-xs font-medium transition-colors hover:text-primary',
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          <Link
            href="/settings"
            className={cn(
              'flex flex-1 flex-col items-center justify-center py-2 text-xs font-medium transition-colors hover:text-primary',
              pathname === '/settings'
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <Settings className="h-5 w-5 mb-1" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}