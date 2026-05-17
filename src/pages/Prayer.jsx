import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const CATEGORIES = [
  { id: 'ansiedad', icon: '😰', label: 'Ansiedad y Paz', gradient: 'from-blue-300 to-blue-600', desc: 'Entregá tus cargas a Dios y encontralo descanso' },
  { id: 'sanidad', icon: '🙏', label: 'Sanidad', gradient: 'from-green-300 to-green-600', desc: 'Oramos por sanidad física, emocional y espiritual' },
  { id: 'familia', icon: '👨‍👩‍👧', label: 'Familia', gradient: 'from-amber-300 to-amber-600', desc: 'Por nuestros hogares, padres e hijos' },
  { id: 'trabajo', icon: '💼', label: 'Trabajo y Finanzas', gradient: 'from-purple-300 to-purple-600', desc: 'Dios provee y guía en cada área' },
  { id: 'gratitud', icon: '🙌', label: 'Gratitud', gradient: 'from-yellow-300 to-yellow-600', desc: 'Un corazón agradecido honra a Dios' },
  { id: 'arrepentimiento', icon: '😔', label: 'Arrepentimiento', gradient: 'from-rose-300 to-rose-600', desc: 'Volvé a Dios con corazón sincero' },
  { id: 'fe', icon: '✝️', label: 'Fe y Propósito', gradient: 'from-indigo-300 to-indigo-600', desc: 'Fortalece tu fe y caminá en propósito' },
];

export default function Prayer() {
  const { isPremium, user } = useAuth();
  const [screen, setScreen] = useState('categories');
  const [category, setCategory] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [prayerEnded, setPrayerEnded] = useState(false);
  const chatEnd = useRef(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const startPrayer = async (cat) => {
    setCategory(cat);
    setMessages([]);
    setPrayerEnded(false);
    setLoading(true);
    setScreen('prayer');

    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/prayer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category: cat.id, message: '', history: [] }),
      });
      if (!res.ok) {
        const data = await res.json();
        if (data.premiumRequired) { setScreen('categories'); return; }
        throw new Error(data.error || 'Error al iniciar la oración');
      }
      const data = await res.json();
      setMessages([{ role: 'assistant', content: data.response }]);
      if (data.isFinal) setPrayerEnded(true);
    } catch (err) {
      setMessages([{ role: 'assistant', content: 'Lo siento, hubo un error al iniciar la oración. Intentalo de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || prayerEnded) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const token = await getToken();
      const history = [...messages, { role: 'user', content: userMsg }];
      const res = await fetch(`${API_BASE}/prayer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category: category.id, message: userMsg, history }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      if (data.isFinal) setPrayerEnded(true);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Lo siento, hubo un error. Intentalo de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (!isPremium) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="text-5xl mb-4">⭐</div>
        <h2 className="font-serif text-xl font-bold mb-2">Función exclusiva</h2>
        <p className="text-dark-blue/60 text-sm mb-6">Oración Guiada es exclusiva para usuarios Premium.</p>
      </div>
    );
  }

  if (screen === 'categories') {
    return (
      <div className="h-full flex flex-col px-4 sm:px-6 py-6 overflow-y-auto">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🙏</div>
          <h1 className="font-serif text-2xl font-bold text-dark-blue">Oración Guiada</h1>
          <p className="text-dark-blue/50 text-sm mt-1 max-w-md mx-auto">
            Elegí un tema y dejá que Rafael guíe tu oración
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => startPrayer(cat)}
              className="group relative overflow-hidden rounded-2xl text-left hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <div className={`bg-gradient-to-br ${cat.gradient} p-5 h-full`}>
                <div className="text-4xl mb-2">{cat.icon}</div>
                <h3 className="font-serif font-bold text-white text-base drop-shadow-sm">{cat.label}</h3>
                <p className="text-xs text-white/80 mt-1 leading-relaxed">{cat.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto pb-[72px]">
        {/* Header */}
        <div className={`bg-gradient-to-r ${CATEGORIES.find((c) => c.id === category?.id)?.gradient || 'from-gold to-gold-dark'} px-4 sm:px-6 py-5 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 left-4 text-6xl">✝️</div>
            <div className="absolute bottom-1 right-8 text-4xl">🕯️</div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-1">
              <button
                onClick={() => { setScreen('categories'); setPrayerEnded(false); }}
                className="text-white/80 hover:text-white text-sm flex items-center gap-1"
              >
                &larr; Temas
              </button>
              <span className="text-white/60 text-xs bg-white/20 px-3 py-1 rounded-full">
                {category?.icon} {category?.label}
              </span>
            </div>
            <h2 className="font-serif text-lg font-bold text-white">Orando por {category?.label?.toLowerCase()}</h2>
            <p className="text-white/70 text-xs mt-0.5">Rafael te guía en oración</p>
          </div>
        </div>

        {/* Messages */}
        <div className="px-4 sm:px-6 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gold/10 text-dark-blue rounded-br-md'
                  : 'bg-white border border-gold/10 text-dark-blue shadow-sm rounded-bl-md'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gold/10 rounded-2xl rounded-bl-md p-4 text-sm text-dark-blue/60">
                <span className="animate-pulse">Escribiendo...</span>
              </div>
            </div>
          )}

          {prayerEnded && (
            <div className="text-center pt-2">
              <button
                onClick={() => setScreen('categories')}
                className="bg-gold text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gold-dark transition-colors"
              >
                🙏 Nueva oración
              </button>
            </div>
          )}

          <div ref={chatEnd} />
        </div>
      </div>

      {/* Input - fixed at bottom */}
      {!prayerEnded && (
        <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-gold/10 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}>
          <div className="flex gap-2 sm:gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu petición..."
              className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-gold/20 bg-cream focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm placeholder:text-xs sm:placeholder:text-sm min-w-0"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="shrink-0 bg-gold text-white px-3 py-2 rounded-full text-xs font-semibold hover:bg-gold-dark transition-colors disabled:opacity-40"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
