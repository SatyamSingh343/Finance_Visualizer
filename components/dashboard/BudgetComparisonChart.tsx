'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DashboardCard } from './DashboardCard';
import { useFinance } from '@/context/FinanceContext';
import { prepareBudgetComparisonData } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { useTheme } from 'next-themes';

export function BudgetComparisonChart() {
  const { transactions, budgets, categories, currentMonth } = useFinance();
  const { theme } = useTheme();
  
  const chartData = prepareBudgetComparisonData(
    transactions,
    budgets,
    categories,
    currentMonth
  );
  
  // Restructure data for the chart (group by category)
  const processedData = [];
  const uniqueCategories = new Set();
  
  for (let i = 0; i < chartData.length; i += 2) {
    if (i + 1 < chartData.length) {
      const category = chartData[i].name;
      uniqueCategories.add(category);
      
      processedData.push({
        name: category,
        budget: chartData[i].value,
        actual: chartData[i + 1].value,
      });
    }
  }
  
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

  // If no data
  if (processedData.length === 0) {
    return (
      <DashboardCard title="Budget vs. Actual">
        <div className="flex items-center justify-center h-[250px] text-muted-foreground">
          No budget data available for this month
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Budget vs. Actual">
      <div className="pt-2 h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDark ? '#374151' : '#e5e7eb'} />
            <XAxis 
              type="number" 
              tickFormatter={(value) => `$${value}`} 
              tick={{ fill: textColor }} 
              axisLine={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fill: textColor }} 
              axisLine={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
              tickLine={false}
              width={100}
            />
            <Tooltip 
              formatter={(value) => formatCurrency(value as number)}
              contentStyle={tooltipStyle}
            />
            <Legend />
            <Bar 
              dataKey="budget" 
              name="Budget" 
              fill="hsl(var(--primary))" 
              radius={[0, 4, 4, 0]}
              animationDuration={1500}
            />
            <Bar 
              dataKey="actual" 
              name="Actual" 
              fill="hsl(var(--chart-2))"
              radius={[0, 4, 4, 0]}
              animationDuration={1500} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}