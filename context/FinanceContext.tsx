'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, Category, Budget, SpendingInsight } from '@/lib/types';
import { generateId, getCurrentMonth } from '@/lib/utils';
import { defaultCategories, sampleTransactions, sampleBudgets, generateInsights } from '@/lib/data';

type FinanceContextType = {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  insights: SpendingInsight[];
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  // State for transactions, categories, and budgets
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [budgets, setBudgets] = useState<Budget[]>(sampleBudgets);
  const [insights, setInsights] = useState<SpendingInsight[]>([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());

  // Update insights when transactions, budgets, or current month changes
  useEffect(() => {
    const newInsights = generateInsights(transactions, budgets, categories, currentMonth);
    setInsights(newInsights);
  }, [transactions, budgets, categories, currentMonth]);

  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: generateId() };
    setTransactions([...transactions, newTransaction]);
  };

  // Update a transaction
  const updateTransaction = (transaction: Transaction) => {
    setTransactions(
      transactions.map((t) => (t.id === transaction.id ? transaction : t))
    );
  };

  // Delete a transaction
  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // Add a new budget
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget = { ...budget, id: generateId() };
    setBudgets([...budgets, newBudget]);
  };

  // Update a budget
  const updateBudget = (budget: Budget) => {
    setBudgets(budgets.map((b) => (b.id === budget.id ? budget : b)));
  };

  // Delete a budget
  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter((b) => b.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        budgets,
        insights,
        currentMonth,
        setCurrentMonth,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}