
import React from 'react';
import { useFinancial } from '../context/FinancialContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Sparkles, Info, TrendingUp, AlertTriangle } from 'lucide-react';
import { TransactionType } from '../types';

const Predictions: React.FC = () => {
  const { transactions } = useFinancial();

  const monthlyIncomes = transactions.filter(t => t.type === TransactionType.INCOME).reduce((a, b) => a + b.amount, 0);
  const monthlyExpenses = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((a, b) => a + b.amount, 0);
  const monthlyBalance = monthlyIncomes - monthlyExpenses;
  
  const currentBalance = transactions.length > 0 ? 5000 : 0; 

  const projectionData = [
    { name: 'Hoje', value: currentBalance },
    { name: 'Mês 1', value: currentBalance + monthlyBalance },
    { name: 'Mês 2', value: currentBalance + (monthlyBalance * 2) },
    { name: 'Mês 3', value: currentBalance + (monthlyBalance * 3) },
    { name: 'Mês 4', value: currentBalance + (monthlyBalance * 4) },
    { name: 'Mês 5', value: currentBalance + (monthlyBalance * 5) },
    { name: 'Mês 6', value: currentBalance + (monthlyBalance * 6) },
  ];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Navegação Preditiva</h1>
          <p className="text-gray-400">O seu patrimônio líquido projetado pela IA Core.</p>
        </div>
        <div className="bg-[#00E676]/10 px-4 py-2 rounded-xl flex items-center gap-2 border border-[#00E676]/20">
          <Sparkles size={16} className="text-[#00E676]" />
          <span className="text-xs font-bold text-[#00E676] uppercase tracking-wider">Veridian Engine Active</span>
        </div>
      </div>

      <div className="bg-[#141414] p-8 rounded-3xl border border-white/5 relative">
        {transactions.length === 0 && (
           <div className="absolute inset-0 z-10 bg-[#141414]/80 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center text-center p-8">
              <TrendingUp size={48} className="text-[#00E676] mb-6 opacity-40 animate-pulse" />
              <h3 className="text-2xl font-bold mb-4">Cálculo Futuro Pendente</h3>
              <p className="text-gray-400 max-w-md mb-8">Precisamos de pelo menos uma receita recorrente para simular seu crescimento patrimonial nos próximos 6 meses.</p>
              <button onClick={() => window.location.hash = '#/transactions'} className="bg-[#00E676] text-black px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#00E676]/20">Alimentar IA</button>
           </div>
        )}

        <div className="h-[400px] w-full mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1C1C1C" />
              <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1C1C1C', border: 'none', borderRadius: '12px' }}
                itemStyle={{ color: '#00E676' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#00E676" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#00E676', strokeWidth: 0 }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Predictions;
