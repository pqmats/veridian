
import React, { useState, useRef, useEffect } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { Send, Bot, User, Sparkles, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
}

const SUGGESTED_PROMPTS = [
  "Meus investimentos estão bem distribuídos?",
  "Onde posso economizar este mês?",
  "O que acontece se eu parcelar uma compra de R$ 1000?",
  "Estou investindo de forma conservadora ou arriscada?",
  "Quando fico negativo se continuar assim?"
];

const AIAssistant: React.FC = () => {
  const { transactions, goals, profile, budgets, investments } = useFinancial();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: `Oi ${profile.name.split(' ')[0]}! Sou seu coach patrimonial no Veridian. Analisei seus gastos e sua carteira de investimentos e estou pronto para te ajudar a tomar melhores decisões. O que vamos planejar hoje?`, sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: textToSend, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const contextPrompt = `
        Você é um COACH PATRIMONIAL EMPÁTICO e INTELIGENTE no app Veridian.
        DADOS DO USUÁRIO:
        - Nome: ${profile.name}
        - Renda: R$ ${profile.monthlyIncome}
        - Objetivo de Poupança: R$ ${profile.monthlySavingsTarget}/mês
        - Gastos Atuais por Categoria: ${JSON.stringify(budgets)}
        - Carteira de Investimentos: ${JSON.stringify(investments)}
        - Metas Ativas: ${JSON.stringify(goals)}
        
        SUA MISSÃO:
        1. Responda como um mentor, não como um robô. Use "claro", "entendo", "olha só".
        2. Seja honesto sobre riscos financeiros e patrimoniais.
        3. Dê exemplos práticos e foque no longo prazo.
        4. Mantenha as respostas concisas (máx 4-5 linhas).
        
        PERGUNTA: ${textToSend}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contextPrompt,
      });

      const aiText = response.text || "Estou reajustando meus modelos de análise. Pode repetir a pergunta de outra forma?";
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: aiText, sender: 'ai' }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: "Tive um soluço nos meus algoritmos. Pode tentar de novo?", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-[#00E676]/10 rounded-2xl flex items-center justify-center border border-[#00E676]/20 shadow-[0_0_15px_rgba(0,230,118,0.1)]">
          <Bot className="text-[#00E676]" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Coach Patrimonial IA</h1>
          <p className="text-gray-400 text-sm font-medium">Análise inteligente dos seus gastos e investimentos.</p>
        </div>
      </div>

      <div className="flex-1 bg-[#141414] rounded-3xl border border-white/5 flex flex-col overflow-hidden relative shadow-2xl">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.sender === 'user' ? 'bg-[#00E676] text-[#0B0B0B]' : 'bg-[#1C1C1C] text-gray-500'}`}>
                  {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-[#00E676] text-[#0B0B0B] font-bold rounded-tr-none' : 'bg-[#1C1C1C] text-gray-300 border border-white/5 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-2 items-center text-[#00E676] text-[10px] font-black uppercase tracking-widest animate-pulse px-10">
                <span>Analisando portfólio...</span>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-[#0B0B0B]/30 border-t border-white/5">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <MessageSquare size={12} /> Sugestões Patrimoniais
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-xs px-3 py-2 bg-[#1C1C1C] text-gray-400 rounded-xl border border-white/5 hover:border-[#00E676]/40 hover:text-white transition-all font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-[#0B0B0B]/50 border-t border-white/5">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Pergunte sobre seus investimentos ou gastos..."
              className="w-full bg-[#1C1C1C] border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:border-[#00E676] focus:outline-none transition-all placeholder:text-gray-600 font-medium"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all ${input.trim() ? 'bg-[#00E676] text-[#0B0B0B] shadow-[0_0_15px_rgba(0,230,118,0.2)]' : 'bg-gray-800 text-gray-600'}`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
