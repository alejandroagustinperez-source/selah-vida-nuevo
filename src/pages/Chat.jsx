import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const WELCOME_MSG = {
  role: 'model',
  content: '🕊️ ¡Bienvenido a Selah Vida! Soy Rafael, tu acompañante espiritual. Comparte conmigo lo que hay en tu corazón — tus alegrías, tus cargas, tus dudas — y juntos buscaremos la sabiduría de Dios en las Escrituras. ¿En qué puedo ayudarte hoy?',
};

function remainingTime() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const diff = tomorrow - now;
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${mins}m`;
}

const EMOTIONS = [
  { emoji: '😔', label: 'Triste' },
  { emoji: '😰', label: 'Ansioso' },
  { emoji: '😤', label: 'Enojado' },
  { emoji: '😔', label: 'Solo' },
  { emoji: '😕', label: 'Confundido' },
  { emoji: '🙏', label: 'Quiero orar' },
  { emoji: '💪', label: 'Necesito aliento' },
  { emoji: '💑', label: 'Problemas de pareja' },
  { emoji: '💰', label: 'Preocupación económica' },
  { emoji: '😴', label: 'Sin esperanza' },
];

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [usage, setUsage] = useState(null);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const bottomRef = useRef(null);

  const hasInteracted = messages.length > 1;

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
      const res = await fetch(`${API_BASE}/usage`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setLoadingUsage(false);
        return;
      }
      const data = await res.json();
      if (data && typeof data.messagesCount === 'number') {
        setUsage(data);
      }
    } catch (err) {
      console.error('Error fetching usage:', err);
    } finally {
      setLoadingUsage(false);
    }
  };

  const sendText = async (text) => {
    if (!text || sending) return;

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    // Optimistic update: increment usage count immediately
    setUsage((prev) => prev ? { ...prev, messagesCount: (prev.messagesCount || 0) + 1 } : prev);

    try {
      const token = await getToken();
      const history = messages
        .filter((m) => m.role !== 'system')
        .slice(1)
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));

      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
          history,
          userName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
        }),
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
        setUsage((prev) => prev ? { ...prev, messagesCount: Math.min(prev.messagesCount || 0, 20) } : prev);
        return;
      }

      if (!res.ok) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: 'model', content: data.response }]);
      if (data.usage && typeof data.usage.messagesCount === 'number') {
        setUsage(data.usage);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intentá de nuevo.' },
      ]);
      // Revert optimistic update on error
      setUsage((prev) => prev ? { ...prev, messagesCount: Math.max((prev.messagesCount || 0) - 1, 0) } : prev);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendText(input.trim());
  };

  const handleEmotion = (emoji, label) => {
    sendText(`Me siento ${label} ${emoji}`);
  };

  const used = usage?.messagesCount ?? 0;
  const limit = usage?.limit ?? 20;
  const isPremium = usage?.isPremium ?? false;
  const atLimit = !isPremium && used >= limit;

  return (
    <div className="h-full flex flex-col bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-gold/10 px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-serif text-lg font-bold leading-tight">Rafael</h1>
          <p className="text-xs text-dark-blue/50">Tu acompañante espiritual</p>
        </div>
        <div className="flex items-center gap-4">
          {!loadingUsage && !isPremium && (
            <span className={`text-xs px-3 py-1 rounded-full ${atLimit ? 'bg-amber-50 text-amber-700 font-medium' : 'text-dark-blue/50 bg-cream'}`}>
              {used}/{limit} mensajes
            </span>
          )}
          {isPremium && (
            <span className="text-xs text-gold bg-gold/10 px-3 py-1 rounded-full font-semibold">Premium</span>
          )}
        </div>
      </header>

      {/* Limit reached banner */}
      {atLimit && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-4 shrink-0">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4">
            <p className="text-sm text-amber-800 text-center sm:text-left">
              Alcanzaste el límite de {limit} mensajes gratuitos de hoy. Los mensajes se reinician en {remainingTime()}.
            </p>
            <a
              href="https://selah-vida.hotmart.com/premium"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-gold text-white text-sm px-6 py-2.5 rounded-full font-semibold hover:bg-gold-dark transition-colors"
            >
              Upgrade a Premium
            </a>
          </div>
        </div>
      )}

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

        {/* Emotion quick-select buttons */}
        {!hasInteracted && !sending && (
          <div className="py-2">
            <p className="text-xs text-dark-blue/40 text-center mb-3">¿Cómo te sentís hoy?</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {EMOTIONS.map((e) => (
                <button
                  key={e.label}
                  onClick={() => handleEmotion(e.emoji, e.label)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-gold/10 text-sm text-dark-blue/70 hover:bg-gold/10 hover:border-gold/30 hover:text-dark-blue transition-all text-left"
                >
                  <span className="text-base">{e.emoji}</span>
                  <span className="text-xs font-medium">{e.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

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
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={hasInteracted ? "Escribí tu mensaje..." : "O escribí lo que sientes..."}
            disabled={sending || atLimit}
            className="flex-1 px-5 py-3 rounded-full border border-gold/20 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={sending || !input.trim() || atLimit}
            className="bg-gold text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-gold-dark transition-colors disabled:opacity-40 shrink-0"
          >
            Enviar
          </button>
        </form>
        {atLimit && (
          <p className="text-center text-xs text-amber-600 mt-2">
            Límite alcanzado. Se reinicia en {remainingTime()}.
          </p>
        )}
      </div>
    </div>
  );
}
