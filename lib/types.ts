// Core data types for the application

export type Transaction = {
  id: string;
  amount: number;
  date: string;
  description: string;
  categoryId: string;
};

export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export type Budget = {
  id: string;
  categoryId: string;
  amount: number;
  month: string; // Format: YYYY-MM
};

// For chart data
export type ChartData = {
  name: string;
  value: number;
  color?: string;
};

// Month summary type
export type MonthlySummary = {
  month: string;
  income: number;
  expenses: number;
  savings: number;
};

// For insight generation
export type SpendingInsight = {
  type: 'info' | 'warning' | 'success';
  message: string;
};