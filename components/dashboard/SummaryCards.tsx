'use client';

import { calculateMonthlyExpenses, formatCurrency } from '@/lib/utils';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingDown, TrendingUp, PiggyBank, CreditCard } from 'lucide-react';

export function SummaryCards() {
  const { transactions, budgets, currentMonth } = useFinance();

  // Calculate total expenses for the current month
  const totalExpenses = calculateMonthlyExpenses(transactions, currentMonth);
  
  // Calculate total budget for the current month
  const totalBudget = budgets
    .filter((b) => b.month === currentMonth)
    .reduce((sum, b) => sum + b.amount, 0);
  
  // Calculate remaining budget
  const remainingBudget = totalBudget - totalExpenses;
  
  // Calculate percentage of budget spent
  const percentageSpent = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0;
  
  // Calculate income (positive transactions)
  const totalIncome = transactions
    .filter((t) => t.date.startsWith(currentMonth) && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate savings (income - expenses)
  const savings = totalIncome - totalExpenses;

  const cards = [
    {
      title: "Monthly Expenses",
      value: totalExpenses,
      icon: <TrendingUp className="h-5 w-5" />,
      iconClass: "bg-destructive/10 text-destructive",
    },
    {
      title: "Monthly Income",
      value: totalIncome,
      icon: <TrendingDown className="h-5 w-5" />,
      iconClass: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      title: "Budget Remaining",
      value: remainingBudget,
      icon: <CreditCard className="h-5 w-5" />,
      iconClass: "bg-primary/10 text-primary",
      subtitle: `${percentageSpent}% of budget used`,
    },
    {
      title: "Monthly Savings",
      value: savings,
      icon: <PiggyBank className="h-5 w-5" />,
      iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      valueClass: savings < 0 ? 'text-destructive' : 'text-green-600 dark:text-green-400',
    },
  ];

  return (
    <>
      {cards.map((card, index) => (
        <Card key={index} className="transition-all hover:scale-[1.02] hover:shadow-lg">
          <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.valueClass || ''}`}>
                {formatCurrency(card.value)}
              </p>
              {card.subtitle && (
                <p className="text-xs text-muted-foreground">
                  {card.subtitle}
                </p>
              )}
            </div>
            <div className={`p-2 rounded-full ${card.iconClass}`}>
              {card.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}