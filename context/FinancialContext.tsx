
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FinancialState, Transaction, CreditCard, Goal, UserProfile, CategoryBudget, Achievement, TransactionType, Notification, Investment } from '../types';
import { INITIAL_STATE } from '../constants';

interface FinancialContextType extends FinancialState {
  addTransaction: (t: Transaction) => void;
  updateTransaction: (t: Transaction) => void;
  removeTransaction: (id: string) => void;
  addCard: (c: CreditCard) => void;
  updateCard: (c: CreditCard) => void;
  removeCard: (id: string) => void;
  addGoal: (g: Goal) => void;
  updateGoal: (g: Goal) => void;
  removeGoal: (id: string) => void;
  addInvestment: (i: Investment) => void;
  updateInvestment: (i: Investment) => void;
  removeInvestment: (id: string) => void;
  updateProfile: (p: Partial<UserProfile>) => void;
  registerUser: (u: UserProfile) => void;
  validateLogin: (email: string, pass: string) => UserProfile | null;
  updateBudget: (category: string, limit: number) => void;
  unlockAchievement: (id: string) => void;
  markNotificationsRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'date' | 'read'>) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);
const STORAGE_KEY = 'veridian_finance_core_v6';

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FinancialState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.users) parsed.users = [];
        if (!parsed.investments) parsed.investments = [];
        return parsed;
      } catch (e) {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addTransaction = (t: Transaction) => {
    setState(prev => ({ ...prev, transactions: [t, ...prev.transactions] }));
  };

  const updateTransaction = (t: Transaction) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(item => item.id === t.id ? t : item)
    }));
  };

  const removeTransaction = (id: string) => {
    setState(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }));
  };

  const addCard = (c: CreditCard) => {
    setState(prev => ({ ...prev, cards: [...prev.cards, c] }));
  };

  const updateCard = (c: CreditCard) => {
    setState(prev => ({ ...prev, cards: prev.cards.map(item => item.id === c.id ? c : item) }));
  };

  const removeCard = (id: string) => {
    setState(prev => ({ ...prev, cards: prev.cards.filter(c => c.id !== id) }));
  };

  const addGoal = (g: Goal) => {
    setState(prev => {
      const updatedGoals = g.isFeatured 
        ? prev.goals.map(goal => ({ ...goal, isFeatured: false })).concat(g)
        : [...prev.goals, g];
      return { ...prev, goals: updatedGoals };
    });
  };

  const updateGoal = (g: Goal) => {
    setState(prev => {
      let updatedGoals = prev.goals.map(item => item.id === g.id ? g : item);
      if (g.isFeatured) {
        updatedGoals = updatedGoals.map(item => item.id !== g.id ? { ...item, isFeatured: false } : item);
      }
      return { ...prev, goals: updatedGoals };
    });
  };

  const removeGoal = (id: string) => {
    setState(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
  };

  const addInvestment = (i: Investment) => {
    setState(prev => ({ ...prev, investments: [...prev.investments, i] }));
  };

  const updateInvestment = (i: Investment) => {
    setState(prev => ({
      ...prev,
      investments: prev.investments.map(item => item.id === i.id ? i : item)
    }));
  };

  const removeInvestment = (id: string) => {
    setState(prev => ({ ...prev, investments: prev.investments.filter(i => i.id !== id) }));
  };

  const updateProfile = (p: Partial<UserProfile>) => {
    setState(prev => {
      const newProfile = { ...prev.profile, ...p };
      const updatedUsers = prev.users.map(u => 
        u.email.toLowerCase() === newProfile.email.toLowerCase() ? { ...u, ...p } : u
      );
      return { ...prev, profile: newProfile, users: updatedUsers };
    });
  };

  const registerUser = (u: UserProfile) => {
    setState(prev => {
      const userExists = prev.users.find(existing => existing.email.toLowerCase() === u.email.toLowerCase());
      if (userExists) return prev;
      return { ...prev, users: [...prev.users, u] };
    });
  };

  const validateLogin = (email: string, pass: string) => {
    const foundUser = state.users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === pass
    );
    if (foundUser) {
      setState(prev => ({ ...prev, profile: foundUser }));
      return foundUser;
    }
    return null;
  };

  const updateBudget = (category: string, limit: number) => {
    setState(prev => ({
      ...prev,
      budgets: prev.budgets.map(b => b.category === category ? { ...b, limit } : b)
    }));
  };

  const unlockAchievement = (id: string) => {
    setState(prev => ({
      ...prev,
      achievements: prev.achievements.map(a => a.id === id ? { ...a, unlocked: true } : a)
    }));
  };

  const markNotificationsRead = () => {
    setState(prev => ({ ...prev, notifications: prev.notifications.map(n => ({ ...n, read: true })) }));
  };

  const addNotification = (n: Omit<Notification, 'id' | 'date' | 'read'>) => {
    const newNotif: Notification = { ...n, id: Date.now().toString(), date: new Date().toISOString(), read: false };
    setState(prev => ({ ...prev, notifications: [newNotif, ...prev.notifications].slice(0, 20) }));
  };

  return (
    <FinancialContext.Provider value={{ 
      ...state, 
      addTransaction, updateTransaction, removeTransaction, 
      addCard, updateCard, removeCard, 
      addGoal, updateGoal, removeGoal,
      addInvestment, updateInvestment, removeInvestment,
      updateProfile, registerUser, validateLogin,
      updateBudget, unlockAchievement, markNotificationsRead, addNotification
    }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) throw new Error('useFinancial must be used within a FinancialProvider');
  return context;
};
