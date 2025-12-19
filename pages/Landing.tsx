
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, TrendingUp, Cpu, Zap } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00E676] rounded-lg flex items-center justify-center font-bold text-[#0B0B0B] shadow-[0_0_15px_rgba(0,230,118,0.4)]">V</div>
          <span className="text-xl font-bold tracking-tight">VERIDIAN</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#beneficios" className="hover:text-white transition-colors">Vantagens</a>
          <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
          <a href="#precos" className="hover:text-white transition-colors">Planos</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/auth')} className="text-sm font-medium hover:text-[#00E676]">Entrar</button>
          <button onClick={() => navigate('/auth')} className="bg-[#00E676] text-black px-5 py-2 rounded-full text-sm font-bold hover:brightness-110 transition-all">Começar agora</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8">
          <div className="w-2 h-2 bg-[#00E676] rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-[#00E676]">Simplifique sua vida financeira</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
          Sua liberdade começa <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E676] to-[#00c853]">com clareza absoluta.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          O Veridian ajuda você a organizar gastos, planejar metas e prever seu futuro financeiro com segurança e inteligência.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button onClick={() => navigate('/auth')} className="w-full md:w-auto px-8 py-4 bg-[#00E676] text-[#0B0B0B] rounded-full text-lg font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,230,118,0.2)]">
            Criar minha conta <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="beneficios" className="max-w-7xl mx-auto px-8 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Shield, title: 'Segurança total', desc: 'Dados protegidos com as melhores tecnologias de criptografia do mercado.' },
            { icon: TrendingUp, title: 'Previsões reais', desc: 'Entenda como estará seu saldo nos próximos meses com base nos seus hábitos.' },
            { icon: Cpu, title: 'Inteligência Financeira', desc: 'Dicas personalizadas para ajudar você a poupar e investir melhor.' },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-[#141414] rounded-3xl border border-white/5 hover:border-[#00E676]/30 transition-all duration-500 group">
              <div className="w-12 h-12 bg-[#00E676]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="text-[#00E676]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="bg-[#141414] py-24">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-16">Organização em 3 passos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {[
              { n: '01', title: 'Lance seus gastos', desc: 'Anote suas rendas e despesas fixas para termos uma visão real do seu caixa.' },
              { n: '02', title: 'Crie suas metas', desc: 'Defina o que você quer conquistar. Nós calculamos o caminho para você chegar lá.' },
              { n: '03', title: 'Acompanhe a evolução', desc: 'Receba alertas e insights para manter seu planejamento sempre em dia.' },
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col items-center">
                <div className="text-6xl font-black text-white/5 absolute -top-10">{step.n}</div>
                <div className="z-10 bg-[#0B0B0B] w-12 h-12 rounded-full border border-[#00E676] flex items-center justify-center font-bold text-[#00E676] mb-6 shadow-[0_0_10px_rgba(0,230,118,0.3)]">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold mb-3 z-10">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#00E676] rounded flex items-center justify-center font-bold text-[#0B0B0B] text-xs">V</div>
            <span className="font-bold tracking-tight">VERIDIAN</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-white">Privacidade</a>
            <a href="#" className="hover:text-white">Termos</a>
            <a href="#" className="hover:text-white">Contato</a>
          </div>
          <p className="text-sm text-gray-600">© 2024 Veridian. Sua vida financeira em outro nível.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
