
import { FinancialState } from './types';

export const COLORS = {
  bgPrimary: '#0B0B0B',
  bgSecondary: '#141414',
  bgTertiary: '#1C1C1C',
  accent: '#00E676',
  success: '#00E676',
  warning: '#F2C94C',
  error: '#EB5757',
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
};

export const INITIAL_STATE: FinancialState = {
  profile: {
    name: "Visitante",
    email: "",
    monthlyIncome: 0,
    financialGoal: "Organização Geral",
    monthlySavingsTarget: 500,
    plan: 'FREE',
  },
  transactions: [],
  cards: [],
  goals: [],
  investments: [],
  budgets: [
    { category: 'Alimentação', limit: 1500, spent: 0 },
    { category: 'Lazer', limit: 500, spent: 0 },
    { category: 'Transporte', limit: 800, spent: 0 },
    { category: 'Moradia', limit: 2500, spent: 0 }
  ],
  achievements: [
    { id: '1', title: 'Primeiro Passo', icon: '🎯', unlocked: false, description: 'Realizou o primeiro lançamento no Veridian.' },
    { id: '2', title: 'Mestre do Orçamento', icon: '💰', unlocked: false, description: 'Manteve todas as categorias no azul por 30 dias.' },
    { id: '3', title: 'Poupador Elite', icon: '🏆', unlocked: false, description: 'Alcançou sua primeira meta financeira.' }
  ],
  notifications: [
    { id: 'n1', title: 'Bem-vindo ao Veridian', message: 'Comece configurando seu orçamento mensal para ter previsões precisas.', type: 'info', date: new Date().toISOString(), read: false },
    { id: 'n2', title: 'Meta em Destaque', message: 'Você agora pode escolher qual meta quer acompanhar diretamente no Dashboard.', type: 'success', date: new Date().toISOString(), read: false }
  ],
  users: [],
};
