
import React, { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { Plus, Filter, Search, Trash2, Edit2, ArrowUpCircle, ArrowDownCircle, X } from 'lucide-react';
import { TransactionType, Transaction } from '../types';

const Transactions: React.FC = () => {
  const { transactions, removeTransaction, addTransaction, updateTransaction } = useFinancial();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Transaction | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Transaction>>({
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: 'Geral',
    type: TransactionType.EXPENSE,
    isRecurring: false
  });

  const handleOpenModal = (item: Transaction | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: 'Geral',
        type: TransactionType.EXPENSE,
        isRecurring: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now().toString(),
    } as Transaction;

    if (editingItem) {
      updateTransaction(payload);
    } else {
      addTransaction(payload);
    }
    setIsModalOpen(false);
  };

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lançamentos</h1>
          <p className="text-gray-400">Gerencie seu fluxo de caixa diário.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#00E676] text-[#0B0B0B] px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,230,118,0.1)]"
        >
          <Plus size={20} /> Novo Lançamento
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
          <input 
            type="text" 
            placeholder="Buscar transação..."
            className="w-full bg-[#141414] border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:border-[#00E676] focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-[#141414] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Data</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Descrição</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Valor</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.map(t => (
                <tr key={t.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {t.type === TransactionType.INCOME ? (
                        <ArrowUpCircle size={18} className="text-[#00E676]" />
                      ) : (
                        <ArrowDownCircle size={18} className="text-red-400" />
                      )}
                      <div>
                        <p className="font-medium">{t.description}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">{t.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${t.type === TransactionType.INCOME ? 'text-[#00E676]' : 'text-white'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(t)} className="p-2 text-gray-500 hover:text-[#00E676] transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => removeTransaction(t.id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-gray-600">
                    Nenhum lançamento encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] w-full max-w-lg rounded-3xl border border-white/10 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-6">{editingItem ? 'Editar Lançamento' : 'Novo Lançamento'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: TransactionType.INCOME})}
                  className={`py-3 rounded-xl font-bold border transition-all ${formData.type === TransactionType.INCOME ? 'bg-[#00E676] text-[#0B0B0B] border-[#00E676]' : 'bg-white/5 border-white/5 text-gray-500'}`}
                >
                  Receita
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: TransactionType.EXPENSE})}
                  className={`py-3 rounded-xl font-bold border transition-all ${formData.type === TransactionType.EXPENSE ? 'bg-red-500 text-white border-red-500' : 'bg-white/5 border-white/5 text-gray-500'}`}
                >
                  Despesa
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Descrição</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Mercado Veridiano"
                  className="w-full bg-[#0B0B0B] border border-white/10 rounded-xl p-4 focus:border-[#00E676] focus:outline-none transition-all"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Valor</label>
                  <input 
                    type="number" 
                    required
                    step="0.01"
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-xl p-4 focus:border-[#00E676] focus:outline-none transition-all"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Data</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-[#0B0B0B] border border-white/10 rounded-xl p-4 focus:border-[#00E676] focus:outline-none transition-all"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Categoria</label>
                <select 
                  className="w-full bg-[#0B0B0B] border border-white/10 rounded-xl p-4 focus:border-[#00E676] focus:outline-none transition-all appearance-none"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option>Geral</option>
                  <option>Alimentação</option>
                  <option>Moradia</option>
                  <option>Transporte</option>
                  <option>Lazer</option>
                  <option>Saúde</option>
                  <option>Salário</option>
                </select>
              </div>

              <button type="submit" className="w-full py-4 bg-[#00E676] text-[#0B0B0B] rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-[#00E676]/10">
                {editingItem ? 'Salvar Alterações' : 'Confirmar Lançamento'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
