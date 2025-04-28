'use client';

import { format, subMonths, addMonths, isAfter } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';

export function MonthSelector() {
  const { currentMonth, setCurrentMonth } = useFinance();
  
  // Parse the current month string to date object
  const currentDate = new Date(`${currentMonth}-01`);
  
  // Function to go to previous month
  const goToPrevMonth = () => {
    const prevMonth = subMonths(currentDate, 1);
    setCurrentMonth(format(prevMonth, 'yyyy-MM'));
  };
  
  // Function to go to next month
  const goToNextMonth = () => {
    const nextMonth = addMonths(currentDate, 1);
    // Don't allow going to future months beyond current month
    if (!isAfter(nextMonth, new Date())) {
      setCurrentMonth(format(nextMonth, 'yyyy-MM'));
    }
  };
  
  // Check if next month button should be disabled
  // (We don't want to allow navigation to future months)
  const isNextMonthDisabled = isAfter(
    addMonths(currentDate, 1),
    new Date()
  );

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        onClick={goToPrevMonth}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous month</span>
      </Button>
      
      <div className="text-sm font-medium">
        {format(currentDate, 'MMMM yyyy')}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={goToNextMonth}
        disabled={isNextMonthDisabled}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next month</span>
      </Button>
    </div>
  );
}