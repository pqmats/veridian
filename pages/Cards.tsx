
import React, { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { Plus, Wallet, ShieldCheck, X, Edit2, Trash2, CreditCard as CardIcon } from 'lucide-react';
import { CardBrand, CreditCard } from '../types';

const Cards: React.FC = () => {
  const { cards, addCard, updateCard, removeCard } = useFinancial();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CreditCard | null>(null);

  const [formData, setFormData] = useState<Partial<CreditCard>>({
    name: '',
    bank: '',
    brand: CardBrand.MASTERCARD,
    limitTotal: 0,
    limitUsed: 0,
    closingDay: 1,
    dueDay: 10,
    color: '#00E676'
  });

  const handleOpenModal = (item: CreditCard | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        bank: '',
        brand: CardBrand.MASTERCARD,
        limitTotal: 0,
        limitUsed: 0,
        closingDay: 1,
        dueDay: 10,
        color: '#00E676'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now().toString(),
    } as CreditCard;

    if (editingItem) {
      updateCard(payload);
    } else {
      addCard(payload);
    }
    setIsModalOpen(false);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Meus Cartões</h1>
          <p className="text-gray-400">Controle seus limites e faturas em um só lugar.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#00E676] text-[#0B0B0B] px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,230,118,0.1)]"
        >
          <Plus size={20} /> Adicionar Cartão
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.length === 0 && (
           <div className="col-span-full py-20 bg-[#141414] rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <CardIcon size={32} className="text-gray-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sem cartões registrados</h3>
              <p className="text-gray-500 mb-8 max-w-sm">Para uma análise preditiva completa, adicione seus cartões de crédito.</p>
              <button onClick={() => handleOpenModal()} className="bg-[#00E676] text-black px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all">
                Cadastrar Agora
              </button>
           </div>
        )}

        {cards.map(card => (
          <div key={card.id} className="space-y-4 group">
            <div 
              style={{ backgroundColor: card.color }}
              className="relative aspect-[1.58/1] rounded-3xl p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-transform group-hover:-translate-y-2 duration-300"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex justify-between items-start z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Wallet size={24} className="text-white/60" />
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex gap-2 mb-2">
                    <button onClick={() => handleOpenModal(card)} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                      <Edit2 size={14} className="text-white" />
                    </button>
                    <button onClick={() => removeCard(card.id)} className="p-2 bg-white/10 rounded-lg hover:bg-red-500/50 transition-colors">
                      <Trash2 size={14} className="text-white" />
                    </button>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">{card.bank}</p>
                  <p className="text-sm font-bold text-white/90">{card.brand}</p>
                </div>
              </div>
              <div className="z-10">
                <p className="text-white/40 text-xs mb-1">LIMITADO PARA USO PREMIUM</p>
                <h3 className="text-xl font-medium tracking-wide">{card.name}</h3>
              </div>
            </div>

            <div className="bg-[#141414] p-6 rounded-3xl border border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold">Limite Utilizado</span>
                <span className="text-xs text-gray-500">{((card.limitUsed / card.limitTotal) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="bg-[#00E676] h-full rounded-full" style={{ width: `${(card.limitUsed / card.limitTotal) * 100}%` }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Gasto</p>
                  <p className="font-bold">{formatCurrency(card.limitUsed)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Disponível</p>
                  <p className="font-bold text-[#00E676]">{formatCurrency(card.limitTotal - card.limitUsed)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] w-full max-w-lg rounded-3xl border border-white/10 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-6">{editingItem ? 'Editar Cartão' : 'Novo Cartão'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Apelido do Cartão</label>
                  <input 
                    type="text" required
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-xl p-4 focus:border-[#00E676] focus:outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Banco</label>
                  <input 
                    type="text" required
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-xl p-4 focus:border-[#00E676] focus:outline-none"
                    value={formData.bank}
                    onChange={e => setFormData({...formData, bank: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Bandeira</label>
                  <select 
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-xl p-4 focus:border-[#00E676] focus:outline-none appearance-none"
                    value={formData.brand}
                    onChange={e => setFormData({...formData, brand: e.target.value as CardBrand})}
                  >
                    {Object.values(CardBrand).map(brand => <option key={brand} value={brand}>{brand}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cor do Cartão</label>
                  <input 
                    type="color"
                    className="w-full h-[56px] bg-[#0B0B0B] border border-white/10 rounded-xl p-1 focus:border-[#00E676] focus:outline-none"
                    value={formData.color}
                    onChange={e => setFormData({...formData, color: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Limite Total</label>
                  <input 
                    type="number" required
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-xl p-4 focus:border-[#00E676] focus:outline-none"
                    value={formData.limitTotal}
                    onChange={e => setFormData({...formData, limitTotal: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Limite Utilizado</label>
                  <input 
                    type="number" required
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-xl p-4 focus:border-[#00E676] focus:outline-none"
                    value={formData.limitUsed}
                    onChange={e => setFormData({...formData, limitUsed: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dia Fechamento</label>
                  <input 
                    type="number" min="1" max="31" required
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-xl p-4 focus:border-[#00E676] focus:outline-none"
                    value={formData.closingDay}
                    onChange={e => setFormData({...formData, closingDay: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dia Vencimento</label>
                  <input 
                    type="number" min="1" max="31" required
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-xl p-4 focus:border-[#00E676] focus:outline-none"
                    value={formData.dueDay}
                    onChange={e => setFormData({...formData, dueDay: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-[#00E676] text-[#0B0B0B] rounded-xl font-bold hover:brightness-110 transition-all mt-4">
                {editingItem ? 'Atualizar Cartão' : 'Cadastrar Cartão'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
