'use client';

import { useState } from 'react';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { FinanceProvider, useFinance } from '@/context/FinanceContext';
import { MonthSelector } from '@/components/dashboard/MonthSelector';
import { BudgetList } from '@/components/budget/BudgetList';
import { BudgetForm } from '@/components/budget/BudgetForm';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BudgetComparisonChart } from '@/components/dashboard/BudgetComparisonChart';

function BudgetPage() {
  const [open, setOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const handleNewBudget = () => {
    setEditingBudget(null);
    setOpen(true);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBudget(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container px-4 py-6 md:py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Budget</h1>
          <div className="flex gap-2 items-center">
            <MonthSelector />
            <Button onClick={handleNewBudget} className="flex items-center gap-1">
              <PlusIcon className="h-4 w-4" />
              <span>Add</span>
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <BudgetComparisonChart />
          <BudgetList onEdit={handleEditBudget} />
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Edit Budget' : 'Add Budget'}
              </DialogTitle>
            </DialogHeader>
            <BudgetForm 
              budget={editingBudget} 
              onComplete={handleClose} 
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

export default function BudgetWrapper() {
  return (
    <FinanceProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BudgetPage />
      </ThemeProvider>
    </FinanceProvider>
  );
}