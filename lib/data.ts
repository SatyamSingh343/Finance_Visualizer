import { Category, Transaction, Budget, SpendingInsight } from './types';
import { formatCurrency } from './utils';

// Predefined categories
export const defaultCategories: Category[] = [
  { id: 'housing', name: 'Housing', color: 'chart-1', icon: 'home' },
  { id: 'food', name: 'Food & Dining', color: 'chart-2', icon: 'utensils' },
  { id: 'transportation', name: 'Transportation', color: 'chart-3', icon: 'car' },
  { id: 'entertainment', name: 'Entertainment', color: 'chart-4', icon: 'film' },
  { id: 'utilities', name: 'Utilities', color: 'chart-5', icon: 'zap' },
  { id: 'shopping', name: 'Shopping', color: 'chart-1', icon: 'shopping-bag' },
  { id: 'healthcare', name: 'Healthcare', color: 'chart-2', icon: 'heart' },
  { id: 'personal', name: 'Personal', color: 'chart-3', icon: 'user' },
  { id: 'education', name: 'Education', color: 'chart-4', icon: 'book' },
  { id: 'other', name: 'Other', color: 'chart-5', icon: 'more-horizontal' },
];

// Sample transactions
export const sampleTransactions: Transaction[] = [
  {
    id: '1',
    amount: -1200,
    date: '2025-05-01',
    description: 'Monthly rent',
    categoryId: 'housing',
  },
  {
    id: '2',
    amount: -85.75,
    date: '2025-05-03',
    description: 'Grocery shopping',
    categoryId: 'food',
  },
  {
    id: '3',
    amount: -45.50,
    date: '2025-05-05',
    description: 'Gas station',
    categoryId: 'transportation',
  },
  {
    id: '4',
    amount: -25.99,
    date: '2025-05-08',
    description: 'Movie tickets',
    categoryId: 'entertainment',
  },
  {
    id: '5',
    amount: -120.45,
    date: '2025-05-10',
    description: 'Electricity bill',
    categoryId: 'utilities',
  },
  {
    id: '6',
    amount: -89.99,
    date: '2025-05-15',
    description: 'New shoes',
    categoryId: 'shopping',
  },
  {
    id: '7',
    amount: -65.00,
    date: '2025-05-18',
    description: 'Doctor visit',
    categoryId: 'healthcare',
  },
  {
    id: '8',
    amount: -35.50,
    date: '2025-05-20',
    description: 'Books',
    categoryId: 'education',
  },
  {
    id: '9',
    amount: -22.50,
    date: '2025-05-22',
    description: 'Haircut',
    categoryId: 'personal',
  },
  {
    id: '10',
    amount: -18.75,
    date: '2025-05-25',
    description: 'Coffee shop',
    categoryId: 'food',
  },
];

// Sample budgets
export const sampleBudgets: Budget[] = [
  { id: '1', categoryId: 'housing', amount: 1500, month: '2025-05' },
  { id: '2', categoryId: 'food', amount: 400, month: '2025-05' },
  { id: '3', categoryId: 'transportation', amount: 200, month: '2025-05' },
  { id: '4', categoryId: 'entertainment', amount: 150, month: '2025-05' },
  { id: '5', categoryId: 'utilities', amount: 250, month: '2025-05' },
  { id: '6', categoryId: 'shopping', amount: 200, month: '2025-05' },
  { id: '7', categoryId: 'healthcare', amount: 150, month: '2025-05' },
  { id: '8', categoryId: 'education', amount: 100, month: '2025-05' },
  { id: '9', categoryId: 'personal', amount: 100, month: '2025-05' },
  { id: '10', categoryId: 'other', amount: 100, month: '2025-05' },
];

// Generate insights based on transactions and budgets
export function generateInsights(
  transactions: Transaction[],
  budgets: Budget[],
  categories: Category[],
  currentMonth: string
): SpendingInsight[] {
  const insights: SpendingInsight[] = [];
  
  // Filter transactions for current month
  const monthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  
  // Calculate total spending
  const totalSpending = Math.abs(
    monthTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );
  
  // Calculate spending by category
  const spendingByCategory: Record<string, number> = {};
  monthTransactions.forEach(t => {
    if (t.amount < 0) {
      if (!spendingByCategory[t.categoryId]) {
        spendingByCategory[t.categoryId] = 0;
      }
      spendingByCategory[t.categoryId] += Math.abs(t.amount);
    }
  });
  
  // Check budget vs actual
  budgets.forEach(budget => {
    if (budget.month === currentMonth) {
      const spending = spendingByCategory[budget.categoryId] || 0;
      const category = categories.find(c => c.categoryId === budget.categoryId);
      const categoryName = category ? category.name : budget.categoryId;
      
      if (spending > budget.amount) {
        insights.push({
          type: 'warning',
          message: `You've exceeded your ${categoryName} budget by ${formatCurrency(spending - budget.amount)}.`
        });
      } else if (spending > budget.amount * 0.9) {
        insights.push({
          type: 'info',
          message: `You're approaching your ${categoryName} budget (${formatCurrency(spending)} of ${formatCurrency(budget.amount)}).`
        });
      } else if (spending < budget.amount * 0.5) {
        insights.push({
          type: 'success',
          message: `You're well under your ${categoryName} budget (${formatCurrency(spending)} of ${formatCurrency(budget.amount)}).`
        });
      }
    }
  });
  
  // Find highest spending category
  let highestSpending = 0;
  let highestCategory = '';
  
  Object.entries(spendingByCategory).forEach(([categoryId, amount]) => {
    if (amount > highestSpending) {
      highestSpending = amount;
      highestCategory = categoryId;
    }
  });
  
  if (highestCategory) {
    const category = categories.find(c => c.id === highestCategory);
    if (category) {
      insights.push({
        type: 'info',
        message: `Your highest spending category is ${category.name} (${formatCurrency(highestSpending)}).`
      });
    }
  }
  
  // Check for unusual spending patterns
  const categoryPercentages: Record<string, number> = {};
  Object.entries(spendingByCategory).forEach(([categoryId, amount]) => {
    categoryPercentages[categoryId] = amount / totalSpending;
  });
  
  Object.entries(categoryPercentages).forEach(([categoryId, percentage]) => {
    if (percentage > 0.4) { // If a category takes more than 40% of spending
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        insights.push({
          type: 'info',
          message: `${category.name} makes up ${Math.round(percentage * 100)}% of your monthly expenses.`
        });
      }
    }
  });
  
  return insights;
}