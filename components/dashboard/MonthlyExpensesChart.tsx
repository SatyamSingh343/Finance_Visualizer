'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardCard } from './DashboardCard';
import { useFinance } from '@/context/FinanceContext';
import { prepareMonthlyExpensesData } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { useTheme } from 'next-themes';

export function MonthlyExpensesChart() {
  const { transactions } = useFinance();
  const { theme } = useTheme();
  const chartData = prepareMonthlyExpensesData(transactions);
  
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const tooltipStyle = {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    border: 'none',
    borderRadius: '0.375rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: '0.75rem',
    color: textColor,
  };

  return (
    <DashboardCard
      title="Monthly Expenses"
      description="Your spending over the last 6 months"
    >
      <div className="pt-2 h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: textColor }} 
              axisLine={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `$${value}`} 
              tick={{ fill: textColor }} 
              axisLine={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(value as number), 'Expenses']}
              contentStyle={tooltipStyle}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--chart-1))" 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}