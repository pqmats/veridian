
import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  CreditCard, 
  Target, 
  LineChart, 
  Bot, 
  Settings, 
  LogOut,
  Zap,
  Bell,
  X,
  TrendingUp
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

interface LayoutProps {
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ onLogout }) => {
  const { profile, notifications, markNotificationsRead } = useFinancial();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Início', path: '/dashboard' },
    { icon: ArrowRightLeft, label: 'Lançamentos', path: '/transactions' },
    { icon: CreditCard, label: 'Cartões', path: '/cards' },
    { icon: TrendingUp, label: 'Investimentos', path: '/investments' }, // Nova rota
    { icon: Target, label: 'Minhas Metas', path: '/goals' },
    { icon: LineChart, label: 'Evolução', path: '/predictions' },
    { icon: Bot, label: 'Dicas de IA', path: '/ai' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleNotifications = () => {
    if (!showNotifications) {
      markNotificationsRead();
    }
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="flex min-h-screen bg-[#0B0B0B] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141414] border-r border-white/5 flex flex-col fixed h-screen z-20">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00E676] rounded-lg flex items-center justify-center font-bold text-[#0B0B0B] shadow-[0_0_15px_rgba(0,230,118,0.3)]">
              V
            </div>
            <span className="text-xl font-bold tracking-tight">VERIDIAN</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative
                ${isActive 
                  ? 'bg-white/5 text-[#00E676]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-[#00E676] rounded-r-full shadow-[0_0_10px_#00E676]" />
                  )}
                  <item.icon size={20} className={isActive ? 'text-[#00E676]' : ''} />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}

          <div className="relative pt-4 mt-4 border-t border-white/5" ref={notifRef}>
            <button
              onClick={handleToggleNotifications}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${showNotifications ? 'bg-white/5 text-[#00E676]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Bell size={20} />
              <span className="font-medium">Notificações</span>
              {unreadCount > 0 && (
                <span className="absolute right-4 w-5 h-5 bg-[#00E676] text-[#0B0B0B] text-[10px] font-black flex items-center justify-center rounded-full border-2 border-[#141414]">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute left-[calc(100%+16px)] top-0 w-80 bg-[#1C1C1C] border border-white/10 rounded-[2.5rem] shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in slide-in-from-left-4 backdrop-blur-xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Centro de Mensagens</span>
                  <button onClick={() => setShowNotifications(false)} className="text-gray-600 hover:text-white transition-colors"><X size={14} /></button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center text-gray-600 text-[10px] font-black uppercase">Sua caixa está vazia.</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="p-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          {n.type === 'warning' && <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>}
                          {n.type === 'success' && <div className="w-1.5 h-1.5 bg-[#00E676] rounded-full"></div>}
                          <p className="text-[11px] font-black text-white uppercase tracking-tight">{n.title}</p>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <NavLink
            to="/settings"
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative
              ${isActive 
                ? 'bg-white/5 text-[#00E676]' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'}
            `}
          >
            <Settings size={20} />
            <span className="font-medium">Ajustes</span>
          </NavLink>
        </nav>

        <div className="p-6">
          <div className="bg-[#1C1C1C] rounded-2xl p-4 mb-4 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-[#00E676]" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">PLANO {profile.plan}</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-3 leading-tight font-medium">Potencialize seu futuro com o Veridian Pro.</p>
            <button className="w-full py-2 bg-[#00E676] text-[#0B0B0B] rounded-lg text-xs font-bold hover:brightness-110 transition-all">
              Fazer Upgrade
            </button>
          </div>

          <button 
            onClick={() => { onLogout(); navigate('/'); }}
            className="flex items-center gap-3 px-4 py-2 w-full text-gray-500 hover:text-red-400 transition-colors group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Sair com segurança</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
