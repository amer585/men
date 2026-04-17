import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Loader2, User } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const SchoolAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'أهلاً بك في بوابة مدرستنا. أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم بخصوص بيانات الطلاب أو الجداول الدراسية؟' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // API key loaded from environment variable (set in Netlify dashboard or .env)
      const apiKey = process.env.GEMINI_API_KEY;
      
      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-2.5-flash";
      
      const systemInstruction = `
        أنت مساعد ذكي لمنصة "مدرستنا"، وهي بوابة مدرسية مصرية.
        تحدث باللغة العربية بأسلوب رسمي وودود.
        ساعد أولياء الأمور والطلاب في معرفة الدرجات، الجداول، والتعليمات المدرسية.
        كن موجزاً ومفيداً.
      `;

      const response = await ai.models.generateContent({
        model: model,
        contents: [
          ...messages.map(m => ({
             role: m.role,
             parts: [{ text: m.text }]
          })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const text = response.text || "عذراً، حدث خطأ في معالجة طلبك.";
      setMessages(prev => [...prev, { role: 'model', text: text }]);

    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tl-none' 
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-tr-none shadow-sm'
              }`}
            >
              <div className="flex items-start gap-2">
                 {msg.role === 'model' && <div className="mt-0.5 min-w-[16px]"><Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" /></div>}
                 <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tr-none border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400">جاري الكتابة...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك..."
            className="flex-1 p-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white p-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className={`w-4 h-4 ${isLoading ? 'opacity-0' : ''}`} />
            {isLoading && <span className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-4 h-4 animate-spin" /></span>}
          </button>
        </form>
      </div>
    </div>
  );
};