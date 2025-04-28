'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DashboardCard } from './DashboardCard';
import { useFinance } from '@/context/FinanceContext';
import { prepareCategoryChartData } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { useTheme } from 'next-themes';

export function CategoryDistributionChart() {
  const { transactions, categories, currentMonth } = useFinance();
  const { theme } = useTheme();
  
  const chartData = prepareCategoryChartData(transactions, categories, currentMonth);
  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);
  
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

  // Only show top 5 categories in the chart
  const topCategories = chartData.slice(0, 5);
  
  // If there are more than 5 categories, group the rest as "Other"
  if (chartData.length > 5) {
    const otherValue = chartData.slice(5).reduce((sum, item) => sum + item.value, 0);
    if (otherValue > 0) {
      topCategories.push({
        name: 'Other',
        value: otherValue,
        color: 'chart-5',
      });
    }
  }

  // If no data
  if (topCategories.length === 0) {
    return (
      <DashboardCard title="Spending by Category">
        <div className="flex items-center justify-center h-[250px] text-muted-foreground">
          No spending data available for this month
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Spending by Category">
      <div className="flex flex-col h-[250px]">
        <div className="text-sm text-muted-foreground mb-1">
          Total: {formatCurrency(totalExpenses)}
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={topCategories}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              animationDuration={1500}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {topCategories.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`hsl(var(--${entry.color}))`}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => formatCurrency(value as number)}
              contentStyle={tooltipStyle}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}