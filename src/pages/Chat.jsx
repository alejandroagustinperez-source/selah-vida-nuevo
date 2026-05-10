import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';

const WELCOME_MSG = {
  role: 'model',
  content: '🕊️ ¡Bienvenido a Selah Vida! Soy Rafael, tu acompañante espiritual. Comparte conmigo lo que hay en tu corazón — tus alegrías, tus cargas, tus dudas — y juntos buscaremos la sabiduría de Dios en las Escrituras. ¿En qué puedo ayudarte hoy?',
};

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [usage, setUsage] = useState(null);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    fetchUsage();
  }, []);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const fetchUsage = async () => {
    try {
      const token = await getToken();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/user/usage`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsage(data);
    } catch (err) {
      console.error('Error fetching usage:', err);
    } finally {
      setLoadingUsage(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const token = await getToken();
      const history = messages
        .filter((m) => m.role !== 'system')
        .slice(1)
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();

      if (res.status === 403 && data.premiumRequired) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            content: `🙏 Has alcanzado el límite de 20 mensajes gratuitos de hoy.\n\nActualizá a **Premium** por solo **$4.99/mes** para seguir conversando sin límites y acceder a todas las funcionalidades.`,
            premiumBlock: true,
          },
        ]);
        return;
      }

      if (!res.ok) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: 'model', content: data.response }]);
      setUsage(data.usage);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intentá de nuevo.' },
      ]);
    } finally {
      setSending(false);
    }
  };

  const remaining = usage ? usage.limit - usage.messagesCount : 20;

  return (
    <div className="h-full flex flex-col bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-gold/10 px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-serif text-lg font-bold leading-tight">Rafael</h1>
          <p className="text-xs text-dark-blue/50">Tu acompañante espiritual</p>
        </div>
        <div className="flex items-center gap-4">
          {!loadingUsage && !usage?.isPremium && (
            <span className="text-xs text-dark-blue/50 bg-cream px-3 py-1 rounded-full">
              {remaining}/20 mensajes
            </span>
          )}
          {usage?.isPremium && (
            <span className="text-xs text-gold bg-gold/10 px-3 py-1 rounded-full font-semibold">Premium</span>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gold text-white rounded-br-md'
                  : msg.premiumBlock
                    ? 'bg-amber-50 border border-amber-200 text-dark-blue rounded-bl-md'
                    : 'bg-white border border-gold/10 text-dark-blue rounded-bl-md shadow-sm'
              }`}
            >
              {msg.premiumBlock ? (
                <>
                  <p className="whitespace-pre-wrap mb-3">{msg.content}</p>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); window.open('https://selah-vida.hotmart.com/premium', '_blank'); }}
                    className="inline-block bg-gold text-white text-sm px-6 py-2.5 rounded-full font-semibold hover:bg-gold-dark transition-colors"
                  >
                    Obtener Premium — $4.99/mes
                  </a>
                </>
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-white border border-gold/10 rounded-2xl rounded-bl-md px-5 py-3 text-sm text-dark-blue/50">
              <span className="animate-pulse">Escribiendo</span>
              <span className="animate-pulse">.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gold/10 bg-white px-4 py-4 shrink-0">
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribí tu mensaje..."
            disabled={sending || (!usage?.isPremium && remaining <= 0)}
            className="flex-1 px-5 py-3 rounded-full border border-gold/20 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={sending || !input.trim() || (!usage?.isPremium && remaining <= 0)}
            className="bg-gold text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-gold-dark transition-colors disabled:opacity-40 shrink-0"
          >
            Enviar
          </button>
        </form>
        {!usage?.isPremium && remaining <= 0 && (
          <p className="text-center text-xs text-amber-600 mt-2">
            Límite diario alcanzado. Actualizá a Premium para seguir conversando.
          </p>
        )}
      </div>
    </div>
  );
}
