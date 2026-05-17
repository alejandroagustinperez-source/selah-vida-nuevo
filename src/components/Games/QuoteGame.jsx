import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const OPTION_LABELS = ['a', 'b', 'c', 'd'];

export default function QuoteGame({ onBack }) {
  const [screen, setScreen] = useState('start');
  const [quotes, setQuotes] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [error, setError] = useState('');
  const feedbackTimeout = useRef(null);
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
      setScreen('result');
    }
  };

  if (!isPremium) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="text-5xl mb-4">⭐</div>
        <h2 className="font-serif text-xl font-bold mb-2">Función exclusiva</h2>
        <p className="text-dark-blue/60 text-sm mb-6">Esta función es exclusiva para usuarios Premium.</p>
        <button onClick={onBack} className="text-gold text-sm font-medium hover:underline">Volver a juegos</button>
      </div>
    );
  }

  if (screen === 'start') {
    return (
      <div className="h-full flex flex-col px-6 py-6 overflow-y-auto">
        <button onClick={onBack} className="self-start text-dark-blue/50 hover:text-dark-blue text-sm mb-4">&larr; Volver a juegos</button>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-5xl mb-3">🗣️</div>
          <h2 className="font-serif text-2xl font-bold mb-2">¿Quién dijo esto?</h2>
          <p className="text-dark-blue/60 text-sm max-w-sm mb-6">
            Te mostramos una cita bíblica y 4 personajes. Adiviná quién lo dijo.
            5 rondas con explicación al final de cada una.
          </p>
          <button
            onClick={startGame}
            className="bg-gold text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-gold-dark transition-colors"
          >
            Comenzar
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'loading') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-dark-blue/60 text-sm">Preparando citas bíblicas...</p>
      </div>
    );
  }

  if (screen === 'error') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="text-4xl mb-4">❌</div>
        <p className="text-dark-blue/70 mb-2 text-sm">{error}</p>
        <button onClick={startGame} className="bg-gold text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gold-dark transition-colors">Intentar de nuevo</button>
        <button onClick={onBack} className="text-dark-blue/50 text-sm mt-3 hover:text-dark-blue">Volver a juegos</button>
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="text-6xl mb-4">{correctCount === 5 ? '🎉' : correctCount >= 3 ? '👏' : '💪'}</div>
        <h2 className="font-serif text-2xl font-bold mb-1">¡Juego terminado!</h2>
        <div className="bg-white rounded-2xl px-8 py-5 border border-gold/10 mb-6">
          <div className="text-4xl font-bold text-gold">{correctCount}<span className="text-dark-blue/30 text-2xl">/{quotes.length}</span></div>
          <p className="text-dark-blue/50 text-xs mt-1">
            {correctCount === 5 ? '¡Conocés las Escrituras!' :
             correctCount >= 3 ? '¡Muy bien!' :
             'Seguí explorando la Biblia'}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={startGame} className="bg-gold text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gold-dark transition-colors">Jugar de nuevo</button>
          <button onClick={onBack} className="bg-white border border-gold/10 text-dark-blue px-6 py-2.5 rounded-full text-sm font-medium hover:border-gold/30 transition-colors">Volver a juegos</button>
        </div>
      </div>
    );
  }

  const q = quotes[currentQ];
  if (!q) return null;

  return (
    <div className="h-full flex flex-col px-6 py-6 overflow-y-auto">
      <button onClick={onBack} className="self-start text-dark-blue/50 hover:text-dark-blue text-sm mb-4">&larr; Volver a juegos</button>
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-dark-blue/50 bg-white px-3 py-1 rounded-full border border-gold/10">
            {currentQ + 1} / {quotes.length}
          </span>
          <span className="text-xs text-gold font-medium bg-gold/10 px-3 py-1 rounded-full">
            ¿Quién dijo?
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-gold/10 p-6 mb-5">
          <div className="text-3xl text-center mb-3">🗣️</div>
          <p className="font-serif text-lg text-dark-blue leading-relaxed text-center italic">
            &ldquo;{q.quote}&rdquo;
          </p>
          <p className="text-xs text-dark-blue/40 text-center mt-3">{q.reference}</p>
        </div>

        {!showFeedback ? (
          <div className="grid gap-2.5">
            {OPTION_LABELS.map((key, idx) => (
              <button
                key={key}
                onClick={() => handleAnswer(key)}
                className="bg-white border border-gold/10 rounded-2xl p-4 text-left hover:border-gold/30 hover:shadow-sm transition-all active:scale-[0.98]"
              >
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-cream text-dark-blue/60 flex items-center justify-center text-xs font-semibold">
                    {key.toUpperCase()}
                  </span>
                  <span className="text-sm text-dark-blue leading-relaxed">{q.options[key]}</span>
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
                let bg = 'bg-white border-gold/10 opacity-60';
                if (isCorrect) bg = 'bg-green-50 border-green-400 opacity-100';
                else if (isSelected && !isCorrect) bg = 'bg-red-50 border-red-300 opacity-100';

                return (
                  <div key={key} className={`border rounded-2xl p-4 ${bg}`}>
                    <div className="flex items-start gap-3">
                      <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                        isCorrect ? 'bg-green-500 text-white' :
                        isSelected && !isCorrect ? 'bg-red-500 text-white' :
                        'bg-cream text-dark-blue/40'
                      }`}>
                        {isCorrect ? '✓' : isSelected ? '✗' : key.toUpperCase()}
                      </span>
                      <span className={`text-sm leading-relaxed ${isCorrect ? 'text-green-700' : 'text-dark-blue/50'}`}>
                        {q.options[key]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`rounded-2xl p-4 text-sm leading-relaxed ${
              selected === q.correct
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-amber-50 border border-amber-200 text-amber-700'
            }`}>
              <p className="font-semibold mb-1">
                {selected === q.correct ? '¡Correcto! 🎉' : 'Incorrecto'}
              </p>
              <p>{q.explanation}</p>
            </div>

            <button
              onClick={nextQuote}
              className="w-full bg-gold text-white py-3 rounded-full font-semibold text-sm hover:bg-gold-dark transition-colors"
            >
              {currentQ + 1 < quotes.length ? 'Siguiente' : 'Ver resultado'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
