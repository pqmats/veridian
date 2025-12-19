
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum InvestmentType {
  RENDA_FIXA = 'Renda Fixa',
  RENDA_VARIAVEL = 'Renda Variável',
  FUNDOS = 'Fundos',
  CRIPTO = 'Cripto',
  RESERVA = 'Reserva/Caixa'
}

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  valueInvested: number;
  currentValue: number;
  startDate: string;
  institution?: string;
  goalId?: string; // Vinculação com metas
  notes?: string;
}

export interface Installment {
  id: string;
  totalAmount: number;
  remainingAmount: number;
  totalInstallments: number;
  currentInstallment: number;
  nextDueDate: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: TransactionType;
  isRecurring: boolean;
  installment?: Installment;
}

export enum CardBrand {
  MASTERCARD = 'Mastercard',
  VISA = 'Visa',
  AMEX = 'American Express',
  ELO = 'Elo'
}

export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  brand: CardBrand;
  limitTotal: number;
  limitUsed: number;
  closingDay: number;
  dueDay: number;
  color: string;
}

export interface CategoryBudget {
  category: string;
  limit: number;
  spent: number;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  deadline: string;
  icon: string;
  isFeatured: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
  description: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  date: string;
  read: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  password?: string;
  monthlyIncome: number;
  financialGoal: string;
  monthlySavingsTarget: number;
  plan: 'FREE' | 'PREMIUM';
  avatar?: string;
}

export interface FinancialState {
  transactions: Transaction[];
  cards: CreditCard[];
  goals: Goal[];
  investments: Investment[];
  budgets: CategoryBudget[];
  achievements: Achievement[];
  notifications: Notification[];
  profile: UserProfile;
  users: UserProfile[];
}
