'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFinance } from '@/context/FinanceContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define form schema
const formSchema = z.object({
  categoryId: z.string({ required_error: 'Category is required' }),
  amount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 
    { message: 'Amount must be a positive number' }
  ),
});

export function BudgetForm({ budget, onComplete }) {
  const { addBudget, updateBudget, categories, currentMonth } = useFinance();
  
  // Get existing budget categories to prevent duplicates
  const existingBudgetCategories = new Set();
  if (budget) {
    existingBudgetCategories.add(budget.categoryId);
  }
  
  // Define form with default values
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: budget?.categoryId || '',
      amount: budget ? budget.amount.toString() : '',
    },
  });

  function onSubmit(values) {
    // Convert amount to number
    const amount = parseFloat(values.amount);
    
    const budgetData = {
      categoryId: values.categoryId,
      amount: amount,
      month: currentMonth,
    };
    
    if (budget) {
      updateBudget({
        ...budgetData,
        id: budget.id,
      });
    } else {
      addBudget(budgetData);
    }
    
    onComplete();
  }

  // Filter out categories that already have budgets (except the one being edited)
  const availableCategories = categories.filter(
    category => !existingBudgetCategories.has(category.id) || category.id === budget?.categoryId
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                  <Input 
                    type="number"
                    step="0.01"
                    min="0.01" 
                    placeholder="0.00" 
                    className="pl-8"
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit">
            {budget ? 'Update' : 'Add'} Budget
          </Button>
        </div>
      </form>
    </Form>
  );
}