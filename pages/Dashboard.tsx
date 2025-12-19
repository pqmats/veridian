
import React, { useState, useEffect } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  CreditCard as CreditCardIcon,
  ShieldAlert,
  Clock,
  Plus,
  CalendarDays,
  RotateCw,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Trophy
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TransactionType } from '../types';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { transactions, cards, profile, budgets, achievements, goals } = useFinancial();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Meta em destaque
  const featuredGoal = goals.find(g => g.isFeatured) || goals[0];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const filteredTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });

  const totalIncome = filteredTransactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, curr) => acc + curr.amount, 0);
  const currentBalance = totalIncome - totalExpense;
  
  const financialScore = transactions.length > 0 ? Math.min(100, Math.max(0, 50 + (totalIncome > totalExpense ? 15 : 0) - (totalExpense > (totalIncome * 0.8) ? 10 : 0))) : 0;

  const getHealthStatus = () => {
    const ratio = totalExpense / (totalIncome || 1);
    if (ratio < 0.6) return { label: 'Saudável', color: 'text-[#00E676]', bg: 'bg-[#00E676]/10', icon: CheckCircle2, msg: 'Seu mês está equilibrado e você está poupando bem.' };
    if (ratio < 0.85) return { label: 'Atenção', color: 'text-[#F2C94C]', bg: 'bg-[#F2C94C]/10', icon: Info, msg: 'Você já utilizou boa parte da sua renda. Cuidado com gastos extras.' };
    return { label: 'Risco', color: 'text-[#EB5757]', bg: 'bg-[#EB5757]/10', icon: AlertTriangle, msg: 'Gastos elevados detectados. Revise suas assinaturas e lazer.' };
  };

  const health = getHealthStatus();

  const groupedTransactions = filteredTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).reduce((groups: any, t) => {
    const date = new Date(t.date).toLocaleDateString('pt-BR');
    if (!groups[date]) groups[date] = [];
    groups[date].push(t);
    return groups;
  }, {});

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      
      {/* 11. Objetivo Financeiro Dinâmico */}
      <div className="bg-[#141414] p-6 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Trophy size={80} />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00E676] mb-1">Foco do Período</p>
            <h2 className="text-xl font-bold">
              {featuredGoal ? `Meta: ${featuredGoal.title}` : `Poupar ${formatCurrency(profile.monthlySavingsTarget)}`}
            </h2>
          </div>
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="flex-1">
              <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-2">
                <span>{featuredGoal ? `Progresso: ${formatCurrency(featuredGoal.currentAmount)}` : `Hoje: ${formatCurrency(currentBalance > 0 ? currentBalance : 0)}`}</span>
                <span>
                  {featuredGoal 
                    ? Math.min(100, Math.floor((featuredGoal.currentAmount / featuredGoal.targetAmount) * 100)) 
                    : Math.min(100, Math.floor(((currentBalance > 0 ? currentBalance : 0) / profile.monthlySavingsTarget) * 100))}%
                </span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#00E676] h-full transition-all duration-1000 shadow-[0_0_10px_#00E676]" 
                  style={{ width: `${featuredGoal ? (featuredGoal.currentAmount / featuredGoal.targetAmount * 100) : (currentBalance / profile.monthlySavingsTarget * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Dashboard */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-[#141414] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Olá, <span className="text-[#00E676]">{profile.name.split(' ')[0]}</span></h1>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mt-3 ${health.bg} ${health.color} text-[10px] font-black uppercase tracking-widest border border-current/10`}>
                <health.icon size={12} /> Status: {health.label}
              </div>
              <p className="text-gray-400 text-sm mt-3 font-medium max-w-sm">{health.msg}</p>
            </div>
            
            <div className="bg-[#0B0B0B]/50 p-4 rounded-3xl border border-white/5 backdrop-blur-md flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="bg-transparent text-[11px] font-black text-white outline-none cursor-pointer">
                  {months.map((m, i) => <option key={m} value={i} className="bg-[#141414]">{m}</option>)}
                </select>
                <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="bg-transparent text-[11px] font-black text-white outline-none cursor-pointer">
                   {[2023, 2024, 2025].map(y => <option key={y} value={y} className="bg-[#141414]">{y}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={handleRefresh} className={`p-2 bg-white/5 rounded-xl transition-all ${isRefreshing ? 'animate-spin text-[#00E676]' : 'text-gray-500'}`}><RotateCw size={14} /></button>
                <button onClick={() => navigate('/transactions')} className="flex-1 py-2 px-4 bg-[#00E676] text-[#0B0B0B] rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"><Plus size={14} /> Novo</button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 bg-gradient-to-br from-[#141414] to-[#0B0B0B] p-8 rounded-[2.5rem] border border-[#00E676]/20 shadow-xl flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-2 text-[#00E676] mb-4">
              <Sparkles size={18} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Insight do Coach</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              "{totalExpense > (totalIncome * 0.2) ? `Você gastou ${formatCurrency(totalExpense)} este mês. Sabia que se poupar 10% disso, em 1 ano terá ${formatCurrency(totalExpense * 1.2)}?` : 'Seu comportamento está exemplar. Continue focando nas suas metas de longo prazo!'}"
            </p>
          </div>
          <button onClick={() => navigate('/ai')} className="mt-6 flex items-center gap-2 text-[10px] font-black text-[#00E676] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
            Simular cenário <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Grid Principal: Mesmos dados do Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#141414] p-6 rounded-3xl border border-white/5 shadow-xl"><p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Entradas</p><h3 className="text-2xl font-black text-[#00E676]">{formatCurrency(totalIncome)}</h3></div>
            <div className="bg-[#141414] p-6 rounded-3xl border border-white/5 shadow-xl"><p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Saídas</p><h3 className="text-2xl font-black text-red-400">{formatCurrency(totalExpense)}</h3></div>
            <div onClick={() => setShowScoreModal(true)} className="bg-[#141414] p-6 rounded-3xl border border-[#00E676]/20 shadow-xl cursor-pointer hover:border-[#00E676]/40 transition-all group"><div className="flex justify-between items-center mb-1"><p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Score Veridian</p><Info size={12} className="text-gray-600 group-hover:text-[#00E676]" /></div><div className="flex items-end gap-2"><h3 className="text-2xl font-black text-white">{financialScore}</h3><span className="text-[9px] font-black text-[#00E676] mb-1">PONTOS</span></div><div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden"><div className="bg-[#00E676] h-full" style={{ width: `${financialScore}%` }}></div></div></div>
          </div>
          <div className="bg-[#141414] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <h2 className="text-xl font-black mb-8 uppercase tracking-tight">Controle por Categoria</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {budgets.map((b, i) => {
                const ratio = Math.min(100, (b.spent / b.limit) * 100);
                const isOver = b.spent > b.limit;
                return (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <p className="text-xs font-black uppercase tracking-widest text-white/80">{b.category}</p>
                      <p className={`text-[10px] font-bold ${isOver ? 'text-red-400' : 'text-gray-500'}`}>{formatCurrency(b.spent)} / {formatCurrency(b.limit)}</p>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 ${isOver ? 'bg-red-400' : 'bg-[#00E676]'}`} style={{ width: `${ratio}%` }}></div></div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-[#141414] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="flex justify-between items-center mb-8"><h2 className="text-xl font-black uppercase tracking-tight">Timeline Financeira</h2><button onClick={() => navigate('/transactions')} className="text-[10px] font-black text-[#00E676] uppercase tracking-[0.2em] hover:underline">Histórico Completo</button></div>
            <div className="space-y-10">
              {Object.entries(groupedTransactions).length === 0 ? (<div className="py-12 text-center text-gray-600 font-bold uppercase text-[10px] tracking-widest">Nenhum movimento.</div>) : (
                Object.entries(groupedTransactions).slice(0, 5).map(([date, items]: any) => (
                  <div key={date} className="relative pl-8 border-l border-white/5 space-y-4"><div className="absolute -left-1.5 top-0 w-3 h-3 bg-[#1C1C1C] border-2 border-[#00E676] rounded-full"></div><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{date}</p>
                    {items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-[#0B0B0B]/50 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                        <div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === TransactionType.INCOME ? 'bg-[#00E676]/10 text-[#00E676]' : 'bg-red-400/10 text-red-400'}`}>{item.type === TransactionType.INCOME ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}</div><div><p className="text-sm font-bold text-white group-hover:text-[#00E676] transition-colors">{item.description}</p><p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{item.category}</p></div></div>
                        <p className={`text-sm font-black ${item.type === TransactionType.INCOME ? 'text-[#00E676]' : 'text-white'}`}>{item.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(item.amount)}</p>
                      </div>))}
                  </div>)))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-[#141414] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="flex justify-between items-center mb-8"><h2 className="text-xs font-black uppercase tracking-widest text-white/80">Gestão de Cartões</h2><button onClick={() => navigate('/cards')} className="text-[9px] font-black text-[#00E676] uppercase tracking-widest">Ver Todos</button></div>
            <div className="space-y-6">
              {cards.map(card => {
                const limitProgress = (card.limitUsed / card.limitTotal) * 100;
                return (
                  <div key={card.id} className="space-y-4 p-5 bg-[#0B0B0B]/40 rounded-[2rem] border border-white/5 hover:border-[#00E676]/30 transition-all cursor-pointer">
                    <div className="flex justify-between items-start"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 text-[#00E676]"><CreditCardIcon size={16} /></div><p className="text-xs font-black uppercase tracking-widest">{card.name}</p></div><span className="text-[9px] font-bold text-gray-600 uppercase">Fatura: {formatCurrency(card.limitUsed)}</span></div>
                    <div className="space-y-2"><div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="bg-[#00E676] h-full" style={{ width: `${limitProgress}%` }}></div></div><div className="flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-widest"><span>Uso do limite</span><span>Vence em breve</span></div></div>
                  </div>);})}
            </div>
          </div>
        </div>
      </div>
      {/* Modal Score... */}
    </div>
  );
};

export default Dashboard;
