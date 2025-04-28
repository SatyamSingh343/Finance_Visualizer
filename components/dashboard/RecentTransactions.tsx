'use client';

import { useFinance } from '@/context/FinanceContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DashboardCard } from './DashboardCard';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/lib/types';
import { filterTransactionsByMonth } from '@/lib/utils';

interface RecentTransactionsProps {
  limit?: number;
  compact?: boolean;
}

export function RecentTransactions({ limit = 5, compact = false }: RecentTransactionsProps) {
  const { transactions, categories, currentMonth } = useFinance();
  
  const recentTransactions = filterTransactionsByMonth(transactions, currentMonth)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return (
    <DashboardCard title="Recent Transactions">
      <div className="space-y-2">
        {recentTransactions.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No transactions for this month
          </div>
        ) : (
          recentTransactions.map((transaction) => {
            const category = categories.find(
              (c) => c.id === transaction.categoryId
            );
            
            return (
              <div
                key={transaction.id}
                className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors ${
                  compact ? 'py-2' : 'p-3'
                } hover:shadow-sm`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`${
                    transaction.amount < 0 
                      ? 'bg-destructive/10 text-destructive' 
                      : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                    } p-2 rounded-full`}
                  >
                    {transaction.amount < 0 ? (
                      <ArrowUpIcon className="h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className={`font-medium ${compact ? 'text-sm' : ''}`}>
                      {transaction.description}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      {formatDate(transaction.date)}
                      {category && (
                        <Badge variant="outline" className="text-xs bg-primary/5">
                          {category.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`${
                  transaction.amount < 0 
                    ? 'text-destructive' 
                    : 'text-emerald-600 dark:text-emerald-400'
                  } font-medium ${compact ? 'text-sm' : ''}`}
                >
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardCard>
  );
}