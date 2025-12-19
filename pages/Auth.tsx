
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const { registerUser, validateLogin, users } = useFinancial();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const authenticatedUser = validateLogin(email, password);
      if (authenticatedUser) {
        onLogin();
        navigate('/dashboard');
      } else {
        const userExists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (userExists) {
          setError('Senha incorreta. Tente novamente.');
        } else {
          setError('E-mail não encontrado. Verifique os dados ou crie uma conta.');
        }
      }
    } else {
      if (step === 1) {
        const alreadyRegistered = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (alreadyRegistered) {
          setError('Este e-mail já está sendo usado.');
          return;
        }
        setStep(2);
      } else {
        // Fix: Added missing monthlySavingsTarget to satisfy UserProfile interface
        const newUser = {
          name,
          email: email.toLowerCase(),
          password,
          monthlyIncome: 0,
          financialGoal: 'Organização Geral',
          monthlySavingsTarget: 500,
          plan: 'FREE' as const
        };
        
        registerUser(newUser);
        validateLogin(newUser.email, newUser.password);
        onLogin();
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col md:flex-row">
      {/* Lado Esquerdo */}
      <div className="hidden md:flex md:w-1/2 bg-[#141414] p-12 flex-col justify-between border-r border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#00E676]/5 to-transparent pointer-events-none"></div>
        
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-10">
          <ArrowLeft size={20} /> Voltar para o site
        </button>
        
        <div className="z-10">
          <h2 className="text-5xl font-black mb-6 leading-tight tracking-tighter">
            Tome o controle do seu <br />
            <span className="text-[#00E676]">futuro financeiro.</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-md font-medium">
            Bem-vindo ao Veridian. Gestão inteligente para quem busca clareza e resultados.
          </p>
        </div>
        
        <div className="flex items-center gap-4 p-6 bg-[#1C1C1C] rounded-[2rem] border border-white/5 shadow-2xl z-10">
          <div className="w-12 h-12 bg-[#00E676]/10 rounded-2xl flex items-center justify-center border border-[#00E676]/20">
            <Sparkles className="text-[#00E676]" size={24} />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed italic">
            "A forma mais simples e elegante de organizar meu dinheiro."
          </p>
        </div>
      </div>

      {/* Lado Direito */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 relative">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#00E676] rounded-[1.5rem] flex items-center justify-center font-black text-[#0B0B0B] text-3xl mx-auto mb-8 shadow-2xl shadow-[#00E676]/30">V</div>
            <h1 className="text-4xl font-black mb-3 tracking-tighter uppercase">
              {isLogin ? 'Bem-vindo de volta' : step === 1 ? 'Crie sua conta' : 'Defina sua senha'}
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
              {isLogin ? 'Acesse sua conta para continuar' : 'Comece sua jornada financeira hoje'}
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-black uppercase tracking-widest">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isLogin ? (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Seu E-mail</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00E676] transition-colors" size={18} />
                    <input 
                      type="email" 
                      required 
                      autoComplete="username"
                      placeholder="seu@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#141414] border border-white/5 rounded-2xl py-5 pl-14 pr-4 focus:border-[#00E676]/50 focus:outline-none transition-all text-sm font-bold text-white" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Sua Senha</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00E676] transition-colors" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      autoComplete="current-password"
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#141414] border border-white/5 rounded-2xl py-5 pl-14 pr-14 focus:border-[#00E676]/50 focus:outline-none transition-all text-sm font-bold text-white" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#00E676] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            ) : step === 1 ? (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Como quer ser chamado?</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00E676] transition-colors" size={18} />
                    <input 
                      type="text" 
                      required 
                      autoComplete="name"
                      placeholder="Seu nome" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full bg-[#141414] border border-white/5 rounded-2xl py-5 pl-14 pr-4 focus:border-[#00E676]/50 focus:outline-none transition-all text-sm font-bold text-white" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Seu Melhor E-mail</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00E676] transition-colors" size={18} />
                    <input 
                      type="email" 
                      required 
                      autoComplete="email"
                      placeholder="seu@email.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full bg-[#141414] border border-white/5 rounded-2xl py-5 pl-14 pr-4 focus:border-[#00E676]/50 focus:outline-none transition-all text-sm font-bold text-white" 
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Crie uma senha forte</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00E676] transition-colors" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      autoComplete="new-password"
                      placeholder="No mínimo 8 caracteres" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#141414] border border-white/5 rounded-2xl py-5 pl-14 pr-14 focus:border-[#00E676]/50 focus:outline-none transition-all text-sm font-bold text-white" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#00E676] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="w-full py-5 bg-[#00E676] text-[#0B0B0B] rounded-[1.25rem] font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-2xl shadow-[#00E676]/20 active:scale-95">
              {isLogin ? 'Entrar agora' : step === 1 ? 'Próximo' : 'Concluir cadastro'}
            </button>
          </form>

          <div className="mt-12 text-center text-xs font-bold uppercase tracking-widest">
            <span className="text-gray-600">
              {isLogin ? 'Ainda não tem conta?' : 'Já tem uma conta?'}
            </span>{' '}
            <button 
              onClick={() => { setIsLogin(!isLogin); setStep(1); setError(''); setShowPassword(false); }}
              className="text-[#00E676] hover:underline"
            >
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
