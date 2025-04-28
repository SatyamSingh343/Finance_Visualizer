'use client';

import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

export function BudgetList({ onEdit }) {
  const { budgets, categories, deleteBudget, transactions, currentMonth } = useFinance();
  const [deleteId, setDeleteId] = useState(null);
  
  // Filter budgets by current month
  const filteredBudgets = budgets
    .filter(budget => budget.month === currentMonth)
    .sort((a, b) => {
      const categoryA = categories.find(c => c.id === a.categoryId)?.name || '';
      const categoryB = categories.find(c => c.id === b.categoryId)?.name || '';
      return categoryA.localeCompare(categoryB);
    });

  // Calculate spending by category
  const spendingByCategory = {};
  transactions
    .filter(t => t.date.startsWith(currentMonth) && t.amount < 0)
    .forEach(t => {
      if (!spendingByCategory[t.categoryId]) {
        spendingByCategory[t.categoryId] = 0;
      }
      spendingByCategory[t.categoryId] += Math.abs(t.amount);
    });

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteBudget(deleteId);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      {filteredBudgets.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-background">
          <p className="text-muted-foreground">No budgets for this month</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => {
                const category = categories.find(c => c.id === budget.categoryId);
                const spent = spendingByCategory[budget.categoryId] || 0;
                const remaining = budget.amount - spent;
                const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                
                return (
                  <TableRow key={budget.id}>
                    <TableCell>
                      {category && (
                        <Badge variant="outline">{category.name}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(budget.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(spent)}
                    </TableCell>
                    <TableCell className={`text-right ${remaining < 0 ? 'text-destructive' : ''}`}>
                      {formatCurrency(remaining)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={Math.min(percentage, 100)} 
                          className={percentage > 100 ? 'bg-destructive/20' : ''}
                        />
                        <span className="text-xs w-12 text-muted-foreground">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(budget)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(budget.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this budget? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}