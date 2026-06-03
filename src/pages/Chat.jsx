import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import DailyVerse from '../components/DailyVerse';
import LimitModal from '../components/LimitModal';
import { trackEvent } from '../utils/tracking';
import RafaelGuide from '../components/RafaelGuide';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const WELCOME_MSG = {
  role: 'model',
  content: '🕊️ ¡Bienvenido a Selah Vida! Soy Rafael, tu acompañante espiritual. Comparte conmigo lo que hay en tu corazón — tus alegrías, tus cargas, tus dudas — y juntos buscaremos la sabiduría de Dios en las Escrituras. ¿En qué puedo ayudarte hoy?',
};

const VERSE_BOOKS = 'Génesis|Éxodo|Levítico|Números|Deuteronomio|Josué|Jueces|Rut|Samuel|Reyes|Crónicas|Esdras|Nehemías|Ester|Job|Salmo|Salmos|Proverbios|Eclesiastés|Cantares|Isaías|Jeremías|Lamentaciones|Ezequiel|Daniel|Oseas|Joel|Amós|Abdías|Jonás|Miqueas|Nahúm|Habacuc|Sofonías|Hageo|Zacarías|Malaquías|Mateo|Marcos|Lucas|Juan|Hechos|Romanos|Corintios|Gálatas|Efesios|Filipenses|Colosenses|Tesalonicenses|Timoteo|Tito|Filemón|Hebreos|Santiago|Pedro|Juan|Judas|Apocalipsis';

function highlightVerses(text) {
  if (!text) return null;
  const parts = [];
  let lastIdx = 0;
  const re = new RegExp(`\\b(${VERSE_BOOKS})\\s+\\d+:\\d+(-\\d+)?\\b`, 'gi');
  let match;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    parts.push(
      <span key={lastIdx} className="text-gold font-semibold">📖 {match[0]}</span>
    );
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }
  return parts.length > 0 ? parts : null;
}

function findPrayerRange(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  let start = -1;
  let end = -1;

  for (let i = 0; i < lines.length; i++) {
    const lower = lines[i].toLowerCase();

    if (start === -1) {
      if (lower.startsWith('querido padre') || lower.startsWith('señor,') || lower.startsWith('dios mío,')) {
        start = i;
        continue;
      }

      const isInvite = lower.includes('vamos a orar') || lower === 'oremos' || lower.includes('te invito a orar');
      if (isInvite) {
        for (let j = i + 1; j < lines.length; j++) {
          const nl = lines[j].toLowerCase();
          if (nl.startsWith('querido padre') || nl.startsWith('señor,') || nl.startsWith('dios mío,')) {
            start = j;
            i = j - 1;
            break;
          }
        }
        continue;
      }
    }

    if (start !== -1 && end === -1 && (lower === 'amén' || lower === 'amén.')) {
      end = i;
      break;
    }
  }

  if (start !== -1 && end !== -1) return { start, end };
  return null;
}

function MessageContent({ content }) {
  const trimmed = content?.trim() || '';
  const prayerRange = findPrayerRange(trimmed);
  const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);

  if (prayerRange) {
    const before = lines.slice(0, prayerRange.start).join('\n');
    const prayer = lines.slice(prayerRange.start, prayerRange.end + 1).join('\n');
    const after = lines.slice(prayerRange.end + 1).join('\n');

    return (
      <div className="space-y-2">
        {before && (highlightVerses(before) ? <p className="whitespace-pre-wrap">{highlightVerses(before)}</p> : <p className="whitespace-pre-wrap">{before}</p>)}
        <div className="bg-purple-50/80 border border-purple-200/50 rounded-2xl px-5 py-5 text-center italic text-sm leading-relaxed text-dark-blue/85 shadow-sm">
          <div className="text-2xl mb-3">🙏</div>
          <p className="whitespace-pre-wrap">{prayer}</p>
          <div className="text-2xl mt-3">🙏</div>
        </div>
        {after && (highlightVerses(after) ? <p className="whitespace-pre-wrap">{highlightVerses(after)}</p> : <p className="whitespace-pre-wrap">{after}</p>)}
      </div>
    );
  }

  const verseParts = highlightVerses(trimmed);
  if (verseParts) {
    return <p className="whitespace-pre-wrap">{verseParts}</p>;
  }

  return <p className="whitespace-pre-wrap">{content}</p>;
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
  const { user, isPremium } = useAuth();
  const location = useLocation();
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [usage, setUsage] = useState(null);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [hideLimit, setHideLimit] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [loadingChat, setLoadingChat] = useState(true);
  const bottomRef = useRef(null);
  const chatIdRef = useRef(null);
  const premiumRef = useRef(isPremium);
  premiumRef.current = isPremium;

  const hasInteracted = messages.length > 1;
  const used = usage?.messagesCount ?? 0;
  const limit = usage?.limit ?? 20;
  const resetIn = usage?.resetIn ?? 0;
  const atLimit = !isPremium && used >= limit;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!atLimit) setHideLimit(false);
  }, [atLimit]);

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

  // Initialize / respond to URL search changes (load chat or new chat)
  useEffect(() => {
    const init = async () => {
      setLoadingChat(true);
      setMessages([WELCOME_MSG]);
      setChatId(null);
      chatIdRef.current = null;

      await fetchUsage();

      const params = new URLSearchParams(location.search);
      const loadChatId = params.get('id');

      if (loadChatId) {
        console.log('[Chat Debug] Loading chat:', loadChatId);
        try {
          const token = await getToken();
          const res = await fetch(`${API_BASE}/chats?id=${loadChatId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setMessages(data.messages || [WELCOME_MSG]);
            setChatId(data.id);
            chatIdRef.current = data.id;
            console.log('[Chat Debug] Chat loaded:', data.id, 'msgs:', data.messages?.length);
          }
        } catch (err) {
          console.error('[Chat Debug] Error loading chat:', err);
        }
      }

      setLoadingChat(false);
    };
    init();
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save effect: creates chat + saves messages for premium users
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => {
    if (!isPremium || loadingChat) return;
    if (messages.length <= 1) return;

    const msgs = messagesRef.current;
    console.log('[Chat Debug] Auto-save queued, messages:', msgs.length, 'chatId:', chatIdRef.current);

    const doSave = async () => {
      const currentMsgs = messagesRef.current;

      // Create chat if needed
      if (!chatIdRef.current) {
        console.log('[Chat Debug] Creating new chat...');
        try {
          const token = await getToken();
          const res = await fetch(`${API_BASE}/chats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ title: 'Nueva conversación', messages: currentMsgs }),
          });
          const data = await res.json();
          if (data?.id) {
            chatIdRef.current = data.id;
            setChatId(data.id);
            console.log('[Chat Debug] Chat CREATED:', data.id);
          } else {
            console.error('[Chat Debug] Chat creation FAILED:', data);
            return;
          }
        } catch (err) {
          console.error('[Chat Debug] Error creating chat:', err);
          return;
        }
      }

      // Update title from first user message
      const firstUserMsg = currentMsgs.find((m) => m.role === 'user');
      let title = 'Nueva conversación';
      if (firstUserMsg) {
        title = firstUserMsg.content.slice(0, 50);
        if (firstUserMsg.content.length > 50) title += '…';
      }

      // Save messages
      console.log('[Chat Debug] Saving chat:', chatIdRef.current, 'title:', title);
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE}/chats`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id: chatIdRef.current, messages: currentMsgs, title }),
        });
        const data = await res.json();
        console.log('[Chat Debug] Chat saved:', data?.id ? 'OK' : 'FAIL', data?.error || '');
      } catch (err) {
        console.error('[Chat Debug] Error saving chat:', err);
      }
    };

    const timer = setTimeout(doSave, 800);
    return () => clearTimeout(timer);
  }, [messages, isPremium, loadingChat]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendText = async (text) => {
    if (!text || sending) return;

    const userMsg = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setSending(true);

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
        const limitMsg = {
          role: 'model',
          content: `🙏 Has alcanzado el límite de 20 mensajes gratuitos de hoy.\n\nActualizá a **Premium** por solo **$4.99/mes** para seguir conversando sin límites y acceder a todas las funcionalidades.`,
          premiumBlock: true,
        };
        const finalMessages = [...updatedMessages, limitMsg];
        setMessages(finalMessages);
        setUsage((prev) => prev ? { ...prev, messagesCount: Math.min(prev.messagesCount || 0, 20) } : prev);
        return;
      }

      if (!res.ok) throw new Error(data.error);

      const modelMsg = { role: 'model', content: data.response };
      const finalMessages = [...updatedMessages, modelMsg];
      setMessages(finalMessages);
      trackEvent('message_sent');
      if (data.usage && typeof data.usage.messagesCount === 'number') {
        setUsage(data.usage);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intentá de nuevo.' },
      ]);
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

  if (loadingChat) {
    return (
      <div className="flex items-center justify-center h-full" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="text-lg animate-pulse" style={{ color: '#C9922A' }}>Cargando…</div>
      </div>
    );
  }

  return (
    <>
    <div className="flex flex-col h-full" style={{ backgroundColor: '#FAF7F2' }}>
      {/* Header */}
      <header className="flex-shrink-0 px-6 py-3 flex items-center justify-between" style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E0D0' }}>
        <div className="flex items-center gap-3">
          <img src="/rafael-avatar.png" alt="Rafael" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #C9922A' }} />
          <div>
            <h1 className="font-serif font-bold leading-tight" style={{ fontSize: '18px', color: '#0F3D3D' }}>Rafael</h1>
            <p style={{ color: '#C9922A', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tu acompañante espiritual</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!loadingUsage && !isPremium && (
            <span className={`text-xs px-3 py-1 rounded-full ${atLimit ? 'bg-amber-50 text-amber-700 font-medium' : ''}`}
              style={!atLimit ? { color: 'rgba(15,61,61,0.5)', backgroundColor: '#E8E0D0' } : {}}>
              {used}/{limit} mensajes
            </span>
          )}
          {isPremium && (
            <span style={{ backgroundColor: '#C9922A', color: '#FAF7F2', fontSize: '11px', padding: '4px 12px', borderRadius: '2px', fontFamily: "'Playfair Display', serif" }}>Premium</span>
          )}
        </div>
      </header>

      {/* Approaching limit warning */}
      {!isPremium && used >= 15 && used < limit && (
        <div className="flex-shrink-0 px-6 py-2 text-center" style={{ backgroundColor: 'rgba(201,146,42,0.08)', borderBottom: '1px solid rgba(201,146,42,0.2)' }}>
          <p className="text-xs" style={{ color: '#8B1A1A' }}>
            Te quedan <span className="font-semibold">{limit - used}</span> mensajes hoy.{' '}
            Con Premium tenés mensajes ilimitados.{' '}
            <a
              href="https://pay.hotmart.com/Q105734847S"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: '#C9922A' }}
            >
              Ver planes →
            </a>
          </p>
        </div>
      )}

      {/* Limit reached modal/banner */}
      {atLimit && !hideLimit && (
        <LimitModal resetIn={resetIn} onClose={() => setHideLimit(true)} />
      )}

      {/* Messages - scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl mx-auto w-full" style={{ backgroundColor: '#FAF7F2', paddingBottom: '16px', WebkitOverflowScrolling: 'touch' }}>
        <DailyVerse />
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="text-sm leading-relaxed"
              style={{
                maxWidth: '65%',
                padding: '12px 18px',
                ...(msg.role === 'user'
                  ? { backgroundColor: '#0F3D3D', color: '#FAF7F2', borderRadius: '12px 0 12px 12px' }
                  : msg.premiumBlock
                    ? { backgroundColor: 'rgba(201,146,42,0.08)', border: '1px solid rgba(201,146,42,0.2)', color: '#0F3D3D', borderRadius: '0 12px 12px 12px', borderLeft: '3px solid #C9922A' }
                    : { backgroundColor: '#FFFFFF', border: '1px solid #E8E0D0', color: '#2C2C2C', borderRadius: '0 12px 12px 12px' }
                ),
              }}
            >
              {msg.premiumBlock ? (
                <>
                  <p className="whitespace-pre-wrap mb-3">{msg.content}</p>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); window.open('https://pay.hotmart.com/Q105734847S', '_blank'); }}
                    className="inline-block text-sm px-6 py-2.5 rounded-lg font-semibold transition-colors"
                    style={{ backgroundColor: '#C9922A', color: '#FAF7F2' }}
                  >
                    Obtener Premium — $4.99/mes
                  </a>
                </>
              ) : (
                <MessageContent content={msg.content} />
              )}
            </div>
          </div>
        ))}

        {/* Emotion quick-select buttons */}
        {!hasInteracted && !sending && (
          <div className="py-2">
            <p className="text-center mb-3" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#0F3D3D', fontSize: '15px' }}>¿Cómo te sentís hoy?</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {EMOTIONS.map((e) => (
                <button
                  key={e.label}
                  onClick={() => handleEmotion(e.emoji, e.label)}
                  className="flex items-center gap-2 px-3 py-2.5 text-left transition-colors"
                  style={{
                    border: '1px solid #E8E0D0',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#0F3D3D',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C9922A'; e.currentTarget.style.backgroundColor = '#FAF7F2'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E8E0D0'; e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
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
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D0', borderRadius: '0 12px 12px 12px', padding: '12px 18px', color: '#2C2C2C', fontSize: '14px' }}>
              <span className="animate-pulse">Escribiendo</span>
              <span className="animate-pulse">.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input - flex-shrink-0 at bottom */}
      <div className="flex-shrink-0" style={{ backgroundColor: '#FAF7F2', borderTop: '1px solid #E8E0D0', padding: '16px 24px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={sending || atLimit}
            style={{
              flex: 1, minWidth: 0,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E0D0',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#2C2C2C',
              padding: '12px 16px',
            }}
            className="disabled:opacity-40"
            onFocus={(e) => e.target.style.borderColor = '#C9922A'}
            onBlur={(e) => e.target.style.borderColor = '#E8E0D0'}
          />
          <button
            type="submit"
            disabled={sending || !input.trim() || atLimit}
            style={{
              backgroundColor: '#0F3D3D',
              color: '#FAF7F2',
              borderRadius: '6px',
              padding: '12px 20px',
              fontSize: '13px',
              letterSpacing: '0.08em',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
            className="disabled:opacity-40"
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#C9922A'; }}
            onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#0F3D3D'; }}
          >
            Enviar
          </button>
        </form>
        {atLimit && (
          <p className="text-center text-xs mt-2" style={{ color: '#8B1A1A' }}>
            Límite alcanzado. Se reinicia en {Math.floor(resetIn / 3600000)}h {Math.floor((resetIn % 3600000) / 60000)}m.
          </p>
        )}
      </div>
    </div>
      <RafaelGuide sectionKey="chat" message="Hola, soy Rafael 👋 Estoy aquí para escucharte y acompañarte en tu fe. Podés contarme lo que sentís, hacer preguntas sobre la Biblia, pedir oración o simplemente charlar. No hay tema prohibido — estoy disponible las 24 horas." />
    </>
  );
}
