'use client';

import { useState } from 'react';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { FinanceProvider, useFinance } from '@/context/FinanceContext';
import { MonthSelector } from '@/components/dashboard/MonthSelector';
import { TransactionList } from '@/components/transactions/TransactionList';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function TransactionsPage() {
  const [open, setOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleNewTransaction = () => {
    setEditingTransaction(null);
    setOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container px-4 py-6 md:py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <div className="flex gap-2 items-center">
            <MonthSelector />
            <Button onClick={handleNewTransaction} className="flex items-center gap-1">
              <PlusIcon className="h-4 w-4" />
              <span>Add</span>
            </Button>
          </div>
        </div>
        
        <TransactionList onEdit={handleEditTransaction} />
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </DialogTitle>
            </DialogHeader>
            <TransactionForm 
              transaction={editingTransaction} 
              onComplete={handleClose} 
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

export default function TransactionsWrapper() {
  return (
    <FinanceProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TransactionsPage />
      </ThemeProvider>
    </FinanceProvider>
  );
}