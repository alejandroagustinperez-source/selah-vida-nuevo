import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const LABELS = ['A', 'B', 'C', 'D'];

export default function VerseGame({ onBack, onComplete }) {
  const { isPremium } = useAuth();
  const [screen, setScreen] = useState('start');
  const [verses, setVerses] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const fetchVerses = async () => {
    setScreen('loading');
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: 'verse' }),
      });
      if (!res.ok) throw new Error('Error al obtener versículos');
      const data = await res.json();
      setVerses(data.verses);
      setCurrentIdx(0);
      setScore(0);
      setAnswered(null);
      setShowResult(false);
      setScreen('playing');
    } catch {
      setScreen('error');
    }
  };

  const handleAnswer = (option) => {
    if (answered) return;
    const current = verses[currentIdx];
    const isCorrect = option === current.correct;
    setAnswered(option);
    setShowResult(true);
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIdx < verses.length - 1) {
      setCurrentIdx((i) => i + 1);
      setAnswered(null);
      setShowResult(false);
    } else {
      setScreen('result');
      onComplete?.('verse_game');
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
          <div className="text-5xl mb-3">📖</div>
          <h2 className="font-serif text-2xl font-bold mb-2">Adivina el Versículo</h2>
          <p className="text-dark-blue/60 text-sm max-w-sm mb-6">
            Te mostramos un versículo completo. Elegí la referencia bíblica correcta entre las 4 opciones.
          </p>
          <button
            onClick={fetchVerses}
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
        <p className="text-dark-blue/60 text-sm">Preparando versículos...</p>
      </div>
    );
  }

  if (screen === 'error') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="text-4xl mb-4">❌</div>
        <p className="text-dark-blue/70 mb-2 text-sm">Error al cargar los versículos</p>
        <button onClick={fetchVerses} className="bg-gold text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gold-dark transition-colors">Intentar de nuevo</button>
        <button onClick={onBack} className="text-dark-blue/50 text-sm mt-3 hover:text-dark-blue">Volver a juegos</button>
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div className="h-full flex flex-col px-6 py-6 overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full">
          <div className="text-5xl mb-3">{score === verses.length ? '🎉' : score >= 3 ? '👏' : '💪'}</div>
          <h2 className="font-serif text-2xl font-bold mb-1">
            {score === verses.length ? '¡Perfecto!' : score >= 3 ? '¡Muy bien!' : '¡Sigue intentando!'}
          </h2>
          <p className="text-dark-blue/60 text-sm mb-6">
            Acertaste <span className="text-gold font-bold text-lg">{score}</span> de <span className="font-bold">{verses.length}</span> versículos
          </p>
          <div className="flex gap-3 w-full max-w-xs">
            <button onClick={fetchVerses} className="flex-1 bg-gold text-white py-3 rounded-full text-sm font-semibold hover:bg-gold-dark transition-colors">Jugar de nuevo</button>
            <button onClick={onBack} className="flex-1 bg-white border border-gold/10 text-dark-blue py-3 rounded-full text-sm font-medium hover:border-gold/30 transition-colors">Volver</button>
          </div>
        </div>
      </div>
    );
  }

  const current = verses[currentIdx];
  if (!current) return null;

  return (
    <div className="h-full flex flex-col px-6 py-6 overflow-y-auto">
      <button onClick={onBack} className="self-start text-dark-blue/50 hover:text-dark-blue text-sm mb-4">&larr; Volver a juegos</button>
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        {/* Progress */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {verses.map((_, i) => (
            <div key={i} className={`w-6 h-1.5 rounded-full transition-colors ${i < currentIdx ? 'bg-gold' : i === currentIdx ? 'bg-gold/70' : 'bg-gold/20'}`} />
          ))}
          <span className="text-xs text-dark-blue/40 ml-2">{currentIdx + 1}/{verses.length}</span>
        </div>

        {/* Verse card */}
        <div className="bg-white rounded-2xl border border-gold/10 p-6 mb-6">
          <div className="text-3xl text-center mb-4">📖</div>
          <p className="font-serif text-lg text-dark-blue leading-relaxed text-center italic">
            &ldquo;{current.text}&rdquo;
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-5">
          {current.options.map((opt, i) => {
            const isSelected = answered === opt;
            const isCorrectOpt = opt === current.correct;
            let btnClass = 'bg-white border-gold/20 hover:border-gold/40 hover:bg-cream';
            if (answered) {
              if (isCorrectOpt) btnClass = 'bg-green-50 border-green-400 text-green-800';
              else if (isSelected) btnClass = 'bg-red-50 border-red-300 text-red-700';
              else btnClass = 'bg-white/50 border-gold/10 text-dark-blue/40';
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                disabled={!!answered}
                className={`w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-sm font-medium transition-all min-h-[52px] touch-action-manipulation cursor-pointer ${btnClass}`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  answered
                    ? isCorrectOpt
                      ? 'bg-green-500 text-white'
                      : isSelected
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    : 'bg-gold/10 text-gold'
                }`}>
                  {LABELS[i]}
                </span>
                <span className="leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showResult && (
          <div className={`rounded-2xl p-4 mb-5 text-center ${
            answered === current.correct
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`font-semibold text-sm ${answered === current.correct ? 'text-green-700' : 'text-red-600'}`}>
              {answered === current.correct
                ? '✅ ¡Correcto!'
                : `❌ Incorrecto — La respuesta correcta es ${current.correct}`}
            </p>
            {current.explanation && (
              <p className="text-xs text-dark-blue/60 mt-2 leading-relaxed">{current.explanation}</p>
            )}
          </div>
        )}

        {/* Next button */}
        {showResult && (
          <button
            onClick={handleNext}
            className="w-full bg-gold text-white py-3.5 rounded-full font-semibold text-sm hover:bg-gold-dark transition-colors cursor-pointer touch-action-manipulation min-h-[48px]"
          >
            {currentIdx < verses.length - 1 ? 'Siguiente versículo →' : 'Ver puntaje'}
          </button>
        )}
      </div>
    </div>
  );
}
