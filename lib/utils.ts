import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Transaction, Category, Budget, ChartData } from './types';
import { format, parse, isValid } from 'date-fns';

// Utility for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

// Format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
}

// Get month name from date string
export function getMonthName(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMMM yyyy');
}

// Parse date string to Date object
export function parseDate(dateString: string): Date {
  const date = parse(dateString, 'yyyy-MM-dd', new Date());
  return isValid(date) ? date : new Date();
}

// Get current month in YYYY-MM format
export function getCurrentMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

// Filter transactions by month
export function filterTransactionsByMonth(
  transactions: Transaction[],
  month: string
): Transaction[] {
  return transactions.filter((t) => t.date.startsWith(month));
}

// Get transactions by category
export function getTransactionsByCategory(
  transactions: Transaction[],
  categoryId: string
): Transaction[] {
  return transactions.filter((t) => t.categoryId === categoryId);
}

// Calculate total expenses for a given month
export function calculateMonthlyExpenses(
  transactions: Transaction[],
  month: string
): number {
  return Math.abs(
    filterTransactionsByMonth(transactions, month)
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );
}

// Prepare data for pie chart (category breakdown)
export function prepareCategoryChartData(
  transactions: Transaction[],
  categories: Category[],
  month: string
): ChartData[] {
  const monthTransactions = filterTransactionsByMonth(transactions, month);
  
  // Group expenses by category
  const expensesByCategory: Record<string, number> = {};
  
  monthTransactions.forEach((transaction) => {
    if (transaction.amount < 0) { // Only count expenses
      if (!expensesByCategory[transaction.categoryId]) {
        expensesByCategory[transaction.categoryId] = 0;
      }
      expensesByCategory[transaction.categoryId] += Math.abs(transaction.amount);
    }
  });
  
  // Convert to chart data format
  return Object.entries(expensesByCategory).map(([categoryId, value]) => {
    const category = categories.find((c) => c.id === categoryId);
    return {
      name: category ? category.name : 'Unknown',
      value,
      color: category ? `chart-${category.color}` : 'chart-5',
    };
  }).sort((a, b) => b.value - a.value); // Sort by value (highest first)
}

// Prepare data for monthly expenses bar chart
export function prepareMonthlyExpensesData(
  transactions: Transaction[],
  monthsToShow: number = 6
): ChartData[] {
  const now = new Date();
  const result: ChartData[] = [];
  
  for (let i = 0; i < monthsToShow; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = format(date, 'yyyy-MM');
    const monthName = format(date, 'MMM');
    
    const monthlyExpense = calculateMonthlyExpenses(transactions, monthStr);
    
    result.unshift({
      name: monthName,
      value: monthlyExpense,
    });
  }
  
  return result;
}

// Prepare budget vs actual data for comparison chart
export function prepareBudgetComparisonData(
  transactions: Transaction[],
  budgets: Budget[],
  categories: Category[],
  month: string
): ChartData[] {
  const result: ChartData[] = [];
  const monthTransactions = filterTransactionsByMonth(transactions, month);
  
  // Calculate actual spending by category
  const spendingByCategory: Record<string, number> = {};
  
  monthTransactions.forEach((transaction) => {
    if (transaction.amount < 0) { // Only count expenses
      if (!spendingByCategory[transaction.categoryId]) {
        spendingByCategory[transaction.categoryId] = 0;
      }
      spendingByCategory[transaction.categoryId] += Math.abs(transaction.amount);
    }
  });
  
  // Add budget and actual data for each category
  categories.forEach((category) => {
    const budget = budgets.find(
      (b) => b.categoryId === category.id && b.month === month
    );
    
    const budgetAmount = budget ? budget.amount : 0;
    const actualAmount = spendingByCategory[category.id] || 0;
    
    if (budgetAmount > 0 || actualAmount > 0) {
      result.push({
        name: category.name,
        value: budgetAmount,
        color: 'primary',
      });
      
      result.push({
        name: `${category.name} (Actual)`,
        value: actualAmount,
        color: actualAmount > budgetAmount ? 'destructive' : 'chart-2',
      });
    }
  });
  
  return result;
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}