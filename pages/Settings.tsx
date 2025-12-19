
import React, { useState, useRef, useEffect } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { User, Shield, Zap, Save, Camera, Mail, Loader2, Check, Download, FileJson, FileText, Users } from 'lucide-react';

const Settings: React.FC = () => {
  const { profile, updateProfile, transactions } = useFinancial();
  const [activeTab, setActiveTab] = useState('perfil');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
  }, [profile]);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      updateProfile({ name, email });
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const exportData = (type: 'CSV' | 'JSON') => {
    const dataStr = JSON.stringify(transactions);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `veridian_export_${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const tabs = [
    { id: 'perfil', label: 'Meus Dados', icon: User },
    { id: 'backup', label: 'Dados & Backup', icon: Download },
    { id: 'familia', label: 'Modo Família', icon: Users },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
  ];

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">Ajustes da Conta</h1>
          <p className="text-gray-500 font-bold mt-1 uppercase tracking-widest text-[10px]">Customize sua experiência financeira premium.</p>
        </div>
        {showSuccess && (
          <div className="bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-bounce">
            <Check size={14} /> Perfil Sincronizado
          </div>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border
              ${activeTab === tab.id ? 'bg-[#00E676] text-[#0B0B0B] border-[#00E676] shadow-xl shadow-[#00E676]/20' : 'bg-[#141414] text-gray-500 hover:text-white border-white/5 hover:bg-[#1C1C1C]'}`}
          >
            <tab.icon size={16} /> 
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-[#141414] rounded-[3rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
        {activeTab === 'perfil' && (
          <div className="space-y-10">
            {/* Perfil Content... (Previous implementation) */}
             <div className="flex items-center gap-10 flex-col md:flex-row">
              <div className="relative group">
                <div className="w-40 h-40 bg-[#0B0B0B] rounded-[2.5rem] border-4 border-white/5 flex items-center justify-center text-[#00E676] text-6xl font-black shadow-inner overflow-hidden group-hover:border-[#00E676]/40 transition-all duration-500">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-all" />
                  ) : (
                    profile.name.charAt(0).toUpperCase()
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-4 bg-[#00E676] text-[#0B0B0B] rounded-2xl shadow-2xl hover:scale-110 transition-transform border-4 border-[#141414]"
                >
                  <Camera size={20} />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => updateProfile({ avatar: reader.result as string });
                    reader.readAsDataURL(file);
                  }
                }} />
              </div>
              <div className="text-center md:text-left space-y-2">
                <p className="text-3xl font-black text-white tracking-tighter uppercase">{profile.name}</p>
                <span className="px-3 py-1 bg-[#00E676]/10 text-[#00E676] rounded-full text-[9px] font-black uppercase tracking-widest border border-[#00E676]/20">Membro {profile.plan}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0B0B0B] border border-white/5 rounded-2xl py-5 px-6 focus:border-[#00E676]/50 focus:outline-none text-sm font-bold text-white shadow-inner" placeholder="Nome completo" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#0B0B0B] border border-white/5 rounded-2xl py-5 px-6 focus:border-[#00E676]/50 focus:outline-none text-sm font-bold text-white shadow-inner" placeholder="E-mail" />
            </div>
            <button onClick={handleSave} disabled={isLoading} className="flex items-center justify-center gap-3 px-12 py-5 bg-[#00E676] text-[#0B0B0B] rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all w-full md:w-auto shadow-2xl shadow-[#00E676]/30">
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Salvar Alterações
            </button>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
              <h3 className="text-xl font-black uppercase mb-4 tracking-tight">Exportar Meus Dados</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed uppercase tracking-widest mb-8">
                No Veridian, acreditamos que seus dados são seus. Você pode exportar seu histórico completo para auditoria ou uso em outras ferramentas a qualquer momento.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => exportData('CSV')} className="flex items-center justify-center gap-3 p-6 bg-[#1C1C1C] rounded-2xl border border-white/5 hover:border-[#00E676]/40 transition-all group">
                   <FileText size={24} className="text-gray-500 group-hover:text-[#00E676]" />
                   <div className="text-left">
                     <p className="text-xs font-black uppercase">Exportar para CSV</p>
                     <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">Compatível com Excel/Sheets</p>
                   </div>
                </button>
                <button onClick={() => exportData('JSON')} className="flex items-center justify-center gap-3 p-6 bg-[#1C1C1C] rounded-2xl border border-white/5 hover:border-[#00E676]/40 transition-all group">
                   <FileJson size={24} className="text-gray-500 group-hover:text-[#00E676]" />
                   <div className="text-left">
                     <p className="text-xs font-black uppercase">Exportar para JSON</p>
                     <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">Para desenvolvedores</p>
                   </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'familia' && (
          <div className="py-16 text-center space-y-8 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-[#00E676]/10 rounded-full flex items-center justify-center mx-auto border border-[#00E676]/20">
              <Users size={32} className="text-[#00E676]" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black tracking-tighter uppercase">Veridian Família</h3>
              <p className="text-gray-500 max-w-md mx-auto font-medium leading-relaxed uppercase tracking-widest text-[10px]">
                Em breve, você poderá convidar parceiros ou familiares para gerir orçamentos compartilhados, mantendo contas individuais e visão de caixa unificada.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00E676]/10 text-[#00E676] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#00E676]/20">
              Feature em Desenvolvimento Premium
            </div>
          </div>
        )}

        {activeTab === 'seguranca' && (
          <div className="space-y-8">
             <div className="p-8 bg-[#0B0B0B]/50 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:border-[#00E676]/20 transition-all">
                <div className="space-y-1">
                  <p className="font-black text-xs uppercase tracking-widest text-white/90">Biometria e 2FA</p>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Reforce a segurança do seu patrimônio digital.</p>
                </div>
                <div className="w-14 h-7 bg-[#1C1C1C] rounded-full relative p-1 cursor-pointer">
                  <div className="w-5 h-5 bg-gray-600 rounded-full"></div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
