'use client';

import { useState } from 'react';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { MonthSelector } from '@/components/dashboard/MonthSelector';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { MonthlyExpensesChart } from '@/components/dashboard/MonthlyExpensesChart';
import { CategoryDistributionChart } from '@/components/dashboard/CategoryDistributionChart';
import { BudgetComparisonChart } from '@/components/dashboard/BudgetComparisonChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { InsightsCard } from '@/components/dashboard/InsightsCard';
import { FinanceProvider } from '@/context/FinanceContext';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';

function Dashboard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1 container px-4 py-6 md:py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Financial Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <MonthSelector />
            <Button 
              onClick={() => setOpen(true)} 
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              <PlusIcon className="h-4 w-4" />
              Add Transaction
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCards />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card-hover rounded-xl bg-card shadow-lg">
              <MonthlyExpensesChart />
            </div>
            <div className="card-hover rounded-xl bg-card shadow-lg">
              <RecentTransactions limit={5} compact />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-hover rounded-xl bg-card shadow-lg">
              <CategoryDistributionChart />
            </div>
            <div className="card-hover rounded-xl bg-card shadow-lg">
              <BudgetComparisonChart />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-hover rounded-xl bg-card shadow-lg">
              <RecentTransactions limit={10} />
            </div>
            <div className="card-hover rounded-xl bg-card shadow-lg">
              <InsightsCard />
            </div>
          </div>
        </div>

        {/* Dialog for Add Transaction */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm 
              transaction={null} 
              onComplete={() => setOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <FinanceProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <Dashboard />
      </ThemeProvider>
    </FinanceProvider>
  );
}
