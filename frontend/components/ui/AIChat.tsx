'use client';

import { useState, useRef, useEffect } from 'react';
import { useUIStore } from '@/store/ui';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { X, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';

interface Message { role: 'user' | 'assistant'; content: string; }

const suggestions = ['What to see in Jaipur for 3 days?','Is September good for Kerala?','Suggest places under ₹15,000','What to pack for Ladakh?','Hidden gems in Himachal?','Best food cities in India'];

export function AIChat() {
  const { isAIChatOpen, toggleAIChat } = useUIStore();
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: `👋 Hi! I'm your MusafirX travel companion. Where would you like to wander next?` }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { if (isAIChatOpen) inputRef.current?.focus(); }, [isAIChatOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg = text.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    try {
      const res = await api.post<any>('/ai/chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'assistant', content: res.message }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble. Try again!" }]);
    } finally { setIsLoading(false); }
  };

  return (<>
    {!isAIChatOpen && (<button onClick={toggleAIChat} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-saffron text-white shadow-lg hover:bg-saffron-600 transition-all hover:scale-105 flex items-center justify-center group"><Sparkles className="w-6 h-6 group-hover:animate-pulse" /><span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald rounded-full animate-pulse" /></button>)}
    {isAIChatOpen && (<div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-8rem)] glass rounded-2xl shadow-2xl flex flex-col animate-scale-in">
      <div className="flex items-center justify-between p-4 border-b border-softgray"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-saffron/10 flex items-center justify-center"><Bot className="w-5 h-5 text-saffron" /></div><div><h3 className="font-semibold text-navy text-sm">MusafirX AI</h3><p className="text-xs text-emerald">{process.env.NEXT_PUBLIC_GEMINI_KEY ? 'Online' : 'Demo Mode'}</p></div></div><button onClick={toggleAIChat} className="p-1.5 rounded-lg hover:bg-softgray transition-colors"><X className="w-4 h-4" /></button></div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">{messages.map((msg,i)=>(<div key={i} className={cn('flex gap-2',msg.role==='user'?'justify-end':'justify-start')}>{msg.role==='assistant'&&<div className="w-7 h-7 rounded-lg bg-saffron/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Bot className="w-4 h-4 text-saffron" /></div>}<div className={cn('max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',msg.role==='user'?'bg-saffron text-white rounded-br-md':'bg-softgray text-charcoal rounded-bl-md')}>{msg.content}</div>{msg.role==='user'&&<div className="w-7 h-7 rounded-lg bg-navy/10 flex items-center justify-center flex-shrink-0 mt-0.5"><User className="w-4 h-4 text-navy" /></div>}</div>))}{isLoading&&<div className="flex gap-2"><div className="w-7 h-7 rounded-lg bg-saffron/10 flex items-center justify-center"><Bot className="w-4 h-4 text-saffron" /></div><div className="bg-softgray rounded-2xl rounded-bl-md px-4 py-3"><div className="flex gap-1"><span className="w-2 h-2 bg-saffron/50 rounded-full animate-bounce" /><span className="w-2 h-2 bg-saffron/50 rounded-full animate-bounce [animation-delay:0.1s]" /><span className="w-2 h-2 bg-saffron/50 rounded-full animate-bounce [animation-delay:0.2s]" /></div></div></div>}<div ref={messagesEndRef} /></div>
      {messages.length <= 1 && <div className="px-4 pb-2"><div className="flex flex-wrap gap-1.5">{suggestions.map((s,i)=><button key={i} onClick={()=>sendMessage(s)} className="px-3 py-1.5 rounded-full border border-softgray text-xs text-charcoal/70 hover:border-saffron hover:text-saffron transition-colors">{s}</button>)}</div></div>}
      <div className="p-4 border-t border-softgray"><form onSubmit={e=>{e.preventDefault();sendMessage(input);}} className="flex gap-2"><input ref={inputRef} type="text" value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask your travel question..." className="input-field flex-1 text-sm" disabled={isLoading}/><button type="submit" disabled={!input.trim()||isLoading} className="w-10 h-10 rounded-xl bg-saffron text-white flex items-center justify-center hover:bg-saffron-600 disabled:opacity-50 transition-colors flex-shrink-0"><Send className="w-4 h-4" /></button></form></div>
    </div>)}
  </>);
}