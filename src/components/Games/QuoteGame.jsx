import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase';
import PremiumModal from '../../components/PremiumModal';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const OPTION_LABELS = ['a', 'b', 'c', 'd'];

export default function QuoteGame({ onBack, onComplete }) {
  const [screen, setScreen] = useState('start');
  const [quotes, setQuotes] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [error, setError] = useState('');
  const feedbackTimeout = useRef(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { isPremium } = useAuth();

  useEffect(() => {
    return () => { if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current); };
  }, []);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const startGame = async () => {
    setScreen('loading');
    setError('');
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: 'quote' }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al generar citas');
      }
      const data = await res.json();
      setQuotes(data.quotes || []);
      setCurrentQ(0);
      setCorrectCount(0);
      setSelected(null);
      setShowFeedback(false);
      setScreen('playing');
    } catch (err) {
      setError(err.message);
      setScreen('error');
    }
  };

  const handleAnswer = (optionKey) => {
    if (showFeedback) return;
    setSelected(optionKey);
    setShowFeedback(true);
    if (optionKey === quotes[currentQ].correct) {
      setCorrectCount((c) => c + 1);
    }
  };

  const nextQuote = () => {
    setSelected(null);
    setShowFeedback(false);
    if (currentQ + 1 < quotes.length) {
      setCurrentQ((c) => c + 1);
    } else {
      onComplete?.('quote_game');
      setScreen('result');
    }
  };

  if (screen === 'start') {
    return (
      <>
        <div className="h-full flex flex-col px-6 py-6 overflow-y-auto" style={{ background: '#FAF7F2' }}>
          <button onClick={onBack} className="self-start text-sm mb-4 hover:underline" style={{ color: '#6b6b6b' }}>&larr; Volver a juegos</button>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-[32px] mb-3 leading-none" style={{ color: '#C9922A' }}>❧</div>
            <h2 className="font-['Playfair_Display'] text-2xl font-bold mb-2" style={{ color: '#0F3D3D' }}>¿Quién dijo esto?</h2>
            <p className="text-sm max-w-sm mb-6" style={{ color: '#6b6b6b' }}>
              Te mostramos una cita bíblica y 4 personajes. Adiviná quién lo dijo.
              5 rondas con explicación al final de cada una.
            </p>
            <button
              onClick={() => { if (!isPremium) { setShowPremiumModal(true); } else { startGame(); } }}
              className="font-['Playfair_Display'] transition-colors"
              style={{ background: '#0F3D3D', color: '#FAF7F2', border: 'none', borderRadius: '4px', padding: '12px 32px', fontSize: '14px' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#C9922A'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#0F3D3D'}
            >
              Comenzar
            </button>
          </div>
        </div>
        <PremiumModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
      </>
    );
  }

  if (screen === 'loading') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6" style={{ background: '#FAF7F2' }}>
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-sm" style={{ color: '#6b6b6b' }}>Preparando citas bíblicas...</p>
      </div>
    );
  }

  if (screen === 'error') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6" style={{ background: '#FAF7F2' }}>
        <div className="text-4xl mb-4">❌</div>
        <p className="mb-2 text-sm" style={{ color: '#0F3D3D' }}>{error}</p>
        <button onClick={startGame} className="px-6 py-2.5 text-sm font-['Playfair_Display'] transition-colors" style={{ background: '#0F3D3D', color: '#FAF7F2', border: 'none', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.background = '#C9922A'} onMouseLeave={(e) => e.currentTarget.style.background = '#0F3D3D'}>Intentar de nuevo</button>
        <button onClick={onBack} className="text-sm mt-3 hover:underline" style={{ color: '#6b6b6b' }}>Volver a juegos</button>
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6" style={{ background: '#FAF7F2' }}>
        <div className="text-6xl mb-4">{correctCount === 5 ? '🎉' : correctCount >= 3 ? '👏' : '💪'}</div>
        <h2 className="font-['Playfair_Display'] text-2xl font-bold mb-1" style={{ color: '#0F3D3D' }}>¡Juego terminado!</h2>
        <div className="px-8 py-5 mb-6" style={{ background: '#fff', border: '1px solid #E8E0D0', borderRadius: '6px' }}>
          <div className="text-4xl font-bold" style={{ color: '#C9922A' }}>{correctCount}<span className="text-2xl" style={{ color: '#6b6b6b' }}>/{quotes.length}</span></div>
          <p className="text-xs mt-1" style={{ color: '#6b6b6b' }}>
            {correctCount === 5 ? '¡Conocés las Escrituras!' :
             correctCount >= 3 ? '¡Muy bien!' :
             'Seguí explorando la Biblia'}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={startGame} className="px-6 py-2.5 text-sm font-['Playfair_Display'] transition-colors" style={{ background: '#0F3D3D', color: '#FAF7F2', border: 'none', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.background = '#C9922A'} onMouseLeave={(e) => e.currentTarget.style.background = '#0F3D3D'}>Jugar de nuevo</button>
          <button onClick={onBack} className="px-6 py-2.5 text-sm font-medium transition-colors" style={{ background: '#fff', border: '1px solid #E8E0D0', color: '#0F3D3D', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#C9922A'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E8E0D0'}>Volver a juegos</button>
        </div>
      </div>
    );
  }

  const q = quotes[currentQ];
  if (!q) return null;

  return (
    <div className="h-full flex flex-col px-6 py-6 overflow-y-auto" style={{ background: '#FAF7F2' }}>
      <button onClick={onBack} className="self-start text-sm mb-4 hover:underline" style={{ color: '#6b6b6b' }}>&larr; Volver a juegos</button>
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs px-3 py-1" style={{ background: '#E8E0D0', color: '#0F3D3D', borderRadius: '4px' }}>
            {currentQ + 1} / {quotes.length}
          </span>
          <span className="text-xs px-3 py-1 font-medium" style={{ border: '1px solid #C9922A', color: '#C9922A', background: 'transparent', borderRadius: '4px' }}>
            ¿Quién dijo?
          </span>
        </div>

        <div className="p-6 mb-5" style={{ background: '#fff', border: '1px solid #E8E0D0', borderRadius: '6px' }}>
          <div className="text-center mb-3" style={{ color: '#C9922A', fontSize: '20px' }}>❧</div>
          <p className="font-['Playfair_Display'] text-base leading-relaxed text-center italic" style={{ color: '#0F3D3D' }}>
            &ldquo;{q.quote}&rdquo;
          </p>
          <p className="text-xs text-center mt-3" style={{ color: '#C9922A', letterSpacing: '0.08em' }}>{q.reference}</p>
        </div>

        {!showFeedback ? (
          <div className="grid gap-2.5">
            {OPTION_LABELS.map((key) => (
              <button
                key={key}
                onClick={() => handleAnswer(key)}
                className="text-left transition-all active:scale-[0.98]"
                style={{ background: '#fff', border: '1px solid #E8E0D0', borderRadius: '6px', padding: '14px 16px' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C9922A'; const badge = e.currentTarget.querySelector('.q-badge'); if (badge) { badge.style.background = '#C9922A'; badge.style.color = '#FAF7F2'; badge.style.borderColor = '#C9922A'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E8E0D0'; const badge = e.currentTarget.querySelector('.q-badge'); if (badge) { badge.style.background = '#FAF7F2'; badge.style.color = '#0F3D3D'; badge.style.borderColor = '#E8E0D0'; } }}
              >
                <div className="flex items-start gap-3">
                  <span className="q-badge shrink-0 w-7 h-7 flex items-center justify-center text-xs font-['Playfair_Display'] transition-all" style={{ background: '#FAF7F2', border: '1px solid #E8E0D0', color: '#0F3D3D', borderRadius: '4px' }}>
                    {key.toUpperCase()}
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: '#0F3D3D' }}>{q.options[key]}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-2.5">
              {OPTION_LABELS.map((key) => {
                const isCorrect = key === q.correct;
                const isSelected = key === selected;
                let borderColor = '#E8E0D0';
                let bg = '#fff';
                let badgeBg = '#FAF7F2';
                let badgeBorder = '#E8E0D0';
                let badgeColor = '#0F3D3D';
                let textColor = '#0F3D3D';
                if (isCorrect) { borderColor = '#0F3D3D'; bg = '#F0F7F4'; badgeBg = '#0F3D3D'; badgeBorder = '#0F3D3D'; badgeColor = '#FAF7F2'; }
                else if (isSelected && !isCorrect) { borderColor = '#8B1A1A'; bg = '#FDF5F5'; badgeBg = '#8B1A1A'; badgeBorder = '#8B1A1A'; badgeColor = '#FAF7F2'; }

                return (
                  <div key={key} className="p-4" style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: '6px' }}>
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-7 h-7 flex items-center justify-center text-xs font-['Playfair_Display']" style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeColor, borderRadius: '4px' }}>
                        {isCorrect ? '✓' : isSelected ? '✗' : key.toUpperCase()}
                      </span>
                      <span className="text-sm leading-relaxed" style={{ color: textColor }}>{q.options[key]}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 text-sm leading-relaxed" style={{ background: selected === q.correct ? '#F0F7F4' : '#FDF5F5', border: `1px solid ${selected === q.correct ? '#0F3D3D' : '#8B1A1A'}`, borderRadius: '6px', color: selected === q.correct ? '#0F3D3D' : '#8B1A1A' }}>
              <p className="font-semibold mb-1">
                {selected === q.correct ? '¡Correcto!' : 'Incorrecto'}
              </p>
              <p>{q.explanation}</p>
            </div>

            <button
              onClick={nextQuote}
              className="w-full py-3 text-sm font-['Playfair_Display'] transition-colors"
              style={{ background: '#0F3D3D', color: '#FAF7F2', border: 'none', borderRadius: '4px' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#C9922A'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#0F3D3D'}
            >
              {currentQ + 1 < quotes.length ? 'Siguiente' : 'Ver resultado'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
