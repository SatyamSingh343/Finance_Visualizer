'use client';

import { useState } from 'react';
import { FinanceProvider } from '@/context/FinanceContext';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { TransactionList } from '@/components/transactions/TransactionList';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';

// Define Transaction type properly
interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

function TransactionsPage() {
  const [open, setOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleNewTransaction = () => {
    setEditingTransaction(null);
    setOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
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
          <Button 
            onClick={handleNewTransaction} 
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <PlusIcon className="h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        <TransactionList onEdit={handleEditTransaction} />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
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
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TransactionsPage />
      </ThemeProvider>
    </FinanceProvider>
  );
}
