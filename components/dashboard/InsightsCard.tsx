'use client';

import { useFinance } from '@/context/FinanceContext';
import { DashboardCard } from './DashboardCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';

export function InsightsCard() {
  const { insights } = useFinance();

  // Show no insights message if none available
  if (insights.length === 0) {
    return (
      <DashboardCard title="Spending Insights">
        <div className="text-center text-muted-foreground py-4">
          Not enough data to generate insights
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Spending Insights">
      <div className="space-y-3">
        {insights.map((insight, index) => {
          let icon;
          let alertClass;
          
          if (insight.type === 'warning') {
            icon = <AlertTriangleIcon className="h-4 w-4" />;
            alertClass = "border-yellow-500 dark:border-yellow-600 text-yellow-700 dark:text-yellow-500";
          } else if (insight.type === 'success') {
            icon = <CheckCircleIcon className="h-4 w-4" />;
            alertClass = "border-green-500 dark:border-green-600 text-green-700 dark:text-green-500";
          } else {
            icon = <InfoIcon className="h-4 w-4" />;
            alertClass = "border-blue-500 dark:border-blue-600 text-blue-700 dark:text-blue-500";
          }
          
          return (
            <Alert 
              key={index}
              className={`${alertClass} border-l-4 py-2`}
              variant="outline"
            >
              <div className="flex items-start gap-2">
                {icon}
                <AlertDescription>{insight.message}</AlertDescription>
              </div>
            </Alert>
          );
        })}
      </div>
    </DashboardCard>
  );
}