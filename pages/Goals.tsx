
import React, { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { Target, Plus, Plane, Shield, Home, Car, X, Edit2, Trash2, LayoutDashboard } from 'lucide-react';
import { Goal } from '../types';

const Goals: React.FC = () => {
  const { goals, addGoal, updateGoal, removeGoal } = useFinancial();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Goal | null>(null);

  const [formData, setFormData] = useState<Partial<Goal>>({
    title: '',
    targetAmount: 0,
    currentAmount: 0,
    monthlyContribution: 0,
    deadline: new Date().toISOString().split('T')[0],
    icon: 'Target',
    isFeatured: false
  });

  const icons = [
    { name: 'Target', component: Target },
    { name: 'Plane', component: Plane },
    { name: 'Shield', component: Shield },
    { name: 'Home', component: Home },
    { name: 'Car', component: Car }
  ];

  const handleOpenModal = (item: Goal | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        targetAmount: 0,
        currentAmount: 0,
        monthlyContribution: 0,
        deadline: new Date().toISOString().split('T')[0],
        icon: 'Target',
        isFeatured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now().toString(),
    } as Goal;

    if (editingItem) {
      updateGoal(payload);
    } else {
      addGoal(payload);
    }
    setIsModalOpen(false);
  };

  const getIcon = (iconName: string) => {
    const icon = icons.find(i => i.name === iconName) || icons[0];
    return <icon.component size={24} />;
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Metas & Conquistas</h1>
          <p className="text-gray-400 font-medium">Visualize seu progresso rumo à liberdade financeira.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#00E676] text-[#0B0B0B] px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,230,118,0.2)]"
        >
          <Plus size={18} /> Nova Meta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {goals.length === 0 && (
           <div className="col-span-full py-20 bg-[#141414] rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-[#00E676]/10 rounded-3xl flex items-center justify-center mb-6 border border-[#00E676]/20">
                <Target size={32} className="text-[#00E676]" />
              </div>
              <h3 className="text-xl font-black uppercase">Para onde vamos hoje?</h3>
              <p className="text-gray-500 mb-8 max-w-sm font-medium uppercase text-[10px] tracking-widest">Dê um nome e um valor ao seu sonho. Veridian ajudará você a chegar lá.</p>
              <button onClick={() => handleOpenModal()} className="bg-[#00E676] text-[#0B0B0B] px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all">
                Criar Primeiro Sonho
              </button>
           </div>
        )}

        {goals.map(goal => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return (
            <div key={goal.id} className={`bg-[#141414] p-8 rounded-[2.5rem] border space-y-6 group transition-all relative overflow-hidden ${goal.isFeatured ? 'border-[#00E676]/30 shadow-[0_0_20px_rgba(0,230,118,0.05)]' : 'border-white/5'}`}>
              {goal.isFeatured && (
                <div className="absolute top-4 right-8 flex items-center gap-2 bg-[#00E676]/10 text-[#00E676] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#00E676]/20">
                  <LayoutDashboard size={10} /> Destaque Dashboard
                </div>
              )}
              
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.1)]">
                  {getIcon(goal.icon)}
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex gap-2 mb-2">
                    <button onClick={() => handleOpenModal(goal)} className="p-2 text-gray-500 hover:text-[#00E676] transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => removeGoal(goal.id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Prazo Final</span>
                  <p className="font-bold text-sm uppercase">{new Date(goal.deadline).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">{goal.title}</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Alvo: {formatCurrency(goal.targetAmount)}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black text-[#00E676] tracking-widest">{progress.toFixed(1)}%</span>
                  <span className="text-gray-500 font-bold uppercase tracking-widest">{formatCurrency(goal.currentAmount)} acumulados</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                  <div className="bg-[#00E676] h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_#00E676]" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] w-full max-w-lg rounded-[3rem] border border-white/10 p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-8">{editingItem ? 'Editar Meta' : 'Nova Meta'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Título do Objetivo</label>
                <input 
                  type="text" required
                  placeholder="Ex: Compra do Novo Carro"
                  className="w-full bg-[#0B0B0B] border border-white/10 rounded-2xl p-5 focus:border-[#00E676]/50 focus:outline-none transition-all font-bold text-sm"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Valor Total Alvo</label>
                  <input 
                    type="number" required
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-2xl p-5 focus:border-[#00E676]/50 focus:outline-none font-bold text-sm"
                    value={formData.targetAmount}
                    onChange={e => setFormData({...formData, targetAmount: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Já tenho guardado</label>
                  <input 
                    type="number"
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-2xl p-5 focus:border-[#00E676]/50 focus:outline-none font-bold text-sm"
                    value={formData.currentAmount}
                    onChange={e => setFormData({...formData, currentAmount: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Aporte Mensal Estimado</label>
                  <input 
                    type="number"
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-2xl p-5 focus:border-[#00E676]/50 focus:outline-none font-bold text-sm"
                    value={formData.monthlyContribution}
                    onChange={e => setFormData({...formData, monthlyContribution: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Até quando?</label>
                  <input 
                    type="date" required
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-2xl p-5 focus:border-[#00E676]/50 focus:outline-none font-bold text-sm"
                    value={formData.deadline}
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-5 bg-[#0B0B0B]/50 rounded-2xl border border-white/5">
                 <div className="flex items-center gap-3">
                   <LayoutDashboard size={20} className="text-[#00E676]" />
                   <div>
                     <p className="text-xs font-black uppercase tracking-widest">Destaque Dashboard</p>
                     <p className="text-[9px] font-bold text-gray-600 uppercase">Exibir progresso no topo do início</p>
                   </div>
                 </div>
                 <button 
                  type="button"
                  onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
                  className={`w-12 h-6 rounded-full relative transition-colors ${formData.isFeatured ? 'bg-[#00E676]' : 'bg-gray-800'}`}
                 >
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isFeatured ? 'left-7' : 'left-1'}`} />
                 </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-3 px-1">Escolha um Ícone</label>
                <div className="flex justify-between">
                  {icons.map(icon => (
                    <button 
                      key={icon.name}
                      type="button"
                      onClick={() => setFormData({...formData, icon: icon.name})}
                      className={`p-5 rounded-2xl border transition-all ${formData.icon === icon.name ? 'bg-[#00E676]/20 border-[#00E676] text-[#00E676]' : 'bg-white/5 border-white/5 text-gray-500'}`}
                    >
                      <icon.component size={24} />
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-[#00E676] text-[#0B0B0B] rounded-2xl font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-2xl shadow-[#00E676]/20 active:scale-95">
                {editingItem ? 'Salvar Alterações' : 'Confirmar Meta'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
