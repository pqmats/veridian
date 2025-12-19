
import React, { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { 
  TrendingUp, 
  Plus, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  X, 
  Edit2, 
  Trash2, 
  ShieldCheck, 
  Sparkles,
  Info,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { Investment, InvestmentType } from '../types';

const Investments: React.FC = () => {
  const { investments, addInvestment, updateInvestment, removeInvestment, goals } = useFinancial();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Investment | null>(null);

  const [formData, setFormData] = useState<Partial<Investment>>({
    name: '',
    type: InvestmentType.RENDA_FIXA,
    valueInvested: 0,
    currentValue: 0,
    startDate: new Date().toISOString().split('T')[0],
    institution: '',
    goalId: '',
    notes: ''
  });

  const handleOpenModal = (item: Investment | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        type: InvestmentType.RENDA_FIXA,
        valueInvested: 0,
        currentValue: 0,
        startDate: new Date().toISOString().split('T')[0],
        institution: '',
        goalId: '',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now().toString(),
    } as Investment;

    if (editingItem) {
      updateInvestment(payload);
    } else {
      addInvestment(payload);
    }
    setIsModalOpen(false);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const totalInvested = investments.reduce((acc, curr) => acc + curr.valueInvested, 0);
  const currentTotal = investments.reduce((acc, curr) => acc + curr.currentValue, 0);
  const totalGain = currentTotal - totalInvested;
  const totalGainPerc = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  const distribution = Object.values(InvestmentType).map(type => {
    const value = investments.filter(i => i.type === type).reduce((acc, curr) => acc + curr.currentValue, 0);
    return { type, value, perc: currentTotal > 0 ? (value / currentTotal) * 100 : 0 };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Investimentos</h1>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em]">Cresça seu patrimônio com inteligência e visão de futuro.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#00E676] text-[#0B0B0B] px-8 py-4 rounded-[1.25rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-2xl shadow-[#00E676]/20 active:scale-95"
        >
          <Plus size={18} /> Novo Ativo
        </button>
      </div>

      {/* Visão Geral Patrimonial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#141414] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={240} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between gap-8">
            <div className="space-y-1">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Patrimônio Investido</p>
              <h2 className="text-5xl font-black text-white tracking-tighter">{formatCurrency(currentTotal)}</h2>
            </div>
            <div className="flex flex-wrap gap-8">
               <div className="space-y-1">
                 <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Lucro Total</p>
                 <div className={`flex items-center gap-2 font-black ${totalGain >= 0 ? 'text-[#00E676]' : 'text-red-400'}`}>
                   {totalGain >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                   {formatCurrency(totalGain)} ({totalGainPerc.toFixed(2)}%)
                 </div>
               </div>
               <div className="space-y-1">
                 <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Ativos Cadastrados</p>
                 <p className="font-black text-white">{investments.length} Ativos</p>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#141414] to-[#0B0B0B] p-8 rounded-[2.5rem] border border-[#00E676]/20 shadow-xl flex flex-col justify-between group">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#00E676]">
              <Sparkles size={18} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Alocação de Carteira</span>
            </div>
            <div className="space-y-4">
               {distribution.filter(d => d.value > 0).map(d => (
                 <div key={d.type} className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase">
                     <span className="text-gray-400">{d.type}</span>
                     <span className="text-white">{d.perc.toFixed(1)}%</span>
                   </div>
                   <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                     <div className="bg-[#00E676] h-full" style={{ width: `${d.perc}%` }}></div>
                   </div>
                 </div>
               ))}
               {investments.length === 0 && (
                 <p className="text-gray-500 text-xs text-center py-8 font-medium">Nenhum ativo para analisar distribuição.</p>
               )}
            </div>
          </div>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-6">Dica: Diversifique para reduzir riscos.</p>
        </div>
      </div>

      {/* Lista de Ativos */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-white uppercase tracking-tight ml-2">Sua Carteira</h3>
        {investments.length === 0 ? (
          <div className="bg-[#141414] p-20 rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-gray-600 mb-6">
               <Briefcase size={32} />
            </div>
            <h4 className="text-2xl font-black uppercase tracking-tight mb-2">Carteira Vazia</h4>
            <p className="text-gray-500 max-w-sm font-medium leading-relaxed mb-10">Adicione seu primeiro investimento para começar a acompanhar sua evolução patrimonial.</p>
            <button onClick={() => handleOpenModal()} className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#00E676] hover:text-[#0B0B0B] transition-all">Começar agora</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investments.map(inv => {
              const gain = inv.currentValue - inv.valueInvested;
              const gainPerc = (gain / inv.valueInvested) * 100;
              return (
                <div key={inv.id} className="bg-[#141414] p-8 rounded-[2.5rem] border border-white/5 space-y-6 group hover:border-[#00E676]/30 transition-all relative overflow-hidden">
                   <div className="flex justify-between items-start">
                     <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${inv.type === InvestmentType.RENDA_VARIAVEL ? 'bg-blue-500/10 text-blue-400 border-blue-400/20' : 'bg-[#00E676]/10 text-[#00E676] border-[#00E676]/20'}`}>
                        {inv.type}
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => handleOpenModal(inv)} className="p-2 text-gray-600 hover:text-white transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => removeInvestment(inv.id)} className="p-2 text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                     </div>
                   </div>
                   
                   <div>
                     <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">{inv.institution || 'Custódia Veridian'}</p>
                     <h4 className="text-xl font-black text-white tracking-tight uppercase group-hover:text-[#00E676] transition-colors">{inv.name}</h4>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Valor Atual</p>
                         <p className="text-lg font-black text-white">{formatCurrency(inv.currentValue)}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Resultado</p>
                         <p className={`text-sm font-black ${gain >= 0 ? 'text-[#00E676]' : 'text-red-400'}`}>
                           {gain >= 0 ? '+' : ''}{gainPerc.toFixed(2)}%
                         </p>
                      </div>
                   </div>

                   <div className="pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center">
                         <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Aplicado em {new Date(inv.startDate).toLocaleDateString('pt-BR')}</span>
                         <ShieldCheck size={14} className="text-gray-800" />
                      </div>
                   </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] w-full max-w-lg rounded-[3rem] border border-white/10 p-10 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-8">{editingItem ? 'Editar Ativo' : 'Novo Investimento'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Nome do Ativo</label>
                <input 
                  type="text" required
                  placeholder="Ex: CDB Banco Veridian 110% CDI"
                  className="w-full bg-[#0B0B0B] border border-white/10 rounded-2xl p-5 focus:border-[#00E676]/50 focus:outline-none transition-all font-bold text-sm text-white"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Tipo</label>
                  <select 
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-2xl p-5 focus:border-[#00E676]/50 focus:outline-none font-bold text-sm text-white appearance-none"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as InvestmentType})}
                  >
                    {Object.values(InvestmentType).map(t => <option key={t} value={t} className="bg-[#141414]">{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Instituição</label>
                  <input 
                    type="text"
                    placeholder="Corretora/Banco"
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-2xl p-5 focus:border-[#00E676]/50 focus:outline-none font-bold text-sm text-white"
                    value={formData.institution}
                    onChange={e => setFormData({...formData, institution: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Valor Aplicado</label>
                  <input 
                    type="number" required step="0.01"
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-2xl p-5 focus:border-[#00E676]/50 focus:outline-none font-bold text-sm text-white"
                    value={formData.valueInvested}
                    onChange={e => setFormData({...formData, valueInvested: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Valor Atual</label>
                  <input 
                    type="number" required step="0.01"
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-2xl p-5 focus:border-[#00E676]/50 focus:outline-none font-bold text-sm text-white"
                    value={formData.currentValue}
                    onChange={e => setFormData({...formData, currentValue: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Data da Aplicação</label>
                  <input 
                    type="date" required
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-2xl p-5 focus:border-[#00E676]/50 focus:outline-none font-bold text-sm text-white"
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Vincular à Meta</label>
                  <select 
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-2xl p-5 focus:border-[#00E676]/50 focus:outline-none font-bold text-sm text-white appearance-none"
                    value={formData.goalId}
                    onChange={e => setFormData({...formData, goalId: e.target.value})}
                  >
                    <option value="">Nenhuma</option>
                    {goals.map(g => <option key={g.id} value={g.id} className="bg-[#141414]">{g.title}</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-[#00E676] text-[#0B0B0B] rounded-2xl font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-2xl shadow-[#00E676]/20 active:scale-95">
                {editingItem ? 'Salvar Alterações' : 'Confirmar Investimento'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;
