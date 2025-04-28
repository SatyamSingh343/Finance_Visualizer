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
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Define form schema
const formSchema = z.object({
  description: z.string().min(2, { message: 'Description is required' }),
  amount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num !== 0;
    }, 
    { message: 'Amount must be a non-zero number' }
  ),
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)), 
    { message: 'Valid date is required' }
  ),
  categoryId: z.string({ required_error: 'Category is required' }),
  type: z.enum(['expense', 'income']),
});

export function TransactionForm({ transaction, onComplete }) {
  const { addTransaction, updateTransaction, categories, currentMonth } = useFinance();
  
  const defaultType = transaction ? 
    (transaction.amount < 0 ? 'expense' : 'income') : 
    'expense';
    
  const defaultAmount = transaction ? 
    Math.abs(transaction.amount).toString() : 
    '';
  
  // Define form with default values
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: transaction?.description || '',
      amount: defaultAmount,
      date: transaction?.date || format(new Date(), 'yyyy-MM-dd'),
      categoryId: transaction?.categoryId || '',
      type: defaultType,
    },
  });

  function onSubmit(values) {
    // Convert amount to number and adjust sign based on type
    const amount = parseFloat(values.amount);
    const adjustedAmount = values.type === 'expense' ? -amount : amount;
    
    const transactionData = {
      description: values.description,
      amount: adjustedAmount,
      date: values.date,
      categoryId: values.categoryId,
    };
    
    if (transaction) {
      updateTransaction({
        ...transactionData,
        id: transaction.id,
      });
    } else {
      addTransaction(transactionData);
    }
    
    onComplete();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-2"
                >
                  <FormItem className="flex items-center space-x-1 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="expense" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Expense</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-1 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="income" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Income</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Groceries, Rent, Salary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
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
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
                  {categories.map((category) => (
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
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit">
            {transaction ? 'Update' : 'Add'} Transaction
          </Button>
        </div>
      </form>
    </Form>
  );
}