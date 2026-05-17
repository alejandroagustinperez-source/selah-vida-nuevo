import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const LEVELS = [
  { key: 'fácil', label: 'Fácil', emoji: '🌱', desc: 'Preguntas básicas de la Biblia' },
  { key: 'medio', label: 'Medio', emoji: '📖', desc: 'Conocimiento intermedio' },
  { key: 'difícil', label: 'Difícil', emoji: '🔥', desc: 'Para expertos en las Escrituras' },
];

const OPTION_LABELS = ['a', 'b', 'c', 'd'];

export default function TriviaGame({ onBack }) {
  const [screen, setScreen] = useState('start');
  const [level, setLevel] = useState('fácil');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [error, setError] = useState('');
  const { isPremium } = useAuth();

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const startGame = async (selectedLevel) => {
    setLevel(selectedLevel);
    setScreen('loading');
    setError('');
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: 'trivia', params: { level: selectedLevel } }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al generar preguntas');
      }
      const data = await res.json();
      console.log('Trivia - Respuesta de Groq:', data);
      setQuestions(data.questions || []);
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

  const handleAnswer = (idx) => {
    if (showFeedback) return;
    setSelected(idx);
    setShowFeedback(true);
    if (questions[currentQ].options[idx] === questions[currentQ].correct) {
      setCorrectCount((c) => c + 1);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setShowFeedback(false);
    if (currentQ + 1 < questions.length) {
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
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">📝</div>
          <h2 className="font-serif text-2xl font-bold mb-2">Trivia Bíblica</h2>
          <p className="text-dark-blue/60 text-sm max-w-md mx-auto">
            Poné a prueba tu conocimiento de la Biblia con preguntas generadas por IA.
            Cada partida tiene 5 preguntas con 4 opciones.
          </p>
        </div>
        <div className="grid gap-3 max-w-sm mx-auto w-full">
          {LEVELS.map((l) => (
            <button
              key={l.key}
              onClick={() => startGame(l.key)}
              className="bg-white border border-gold/10 rounded-2xl p-4 text-left hover:border-gold/30 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{l.emoji}</span>
                <div>
                  <div className="font-semibold text-dark-blue">{l.label}</div>
                  <div className="text-xs text-dark-blue/50">{l.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'loading') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-dark-blue/60 text-sm">Generando preguntas de nivel {level}...</p>
      </div>
    );
  }

  if (screen === 'error') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="text-4xl mb-4">❌</div>
        <p className="text-dark-blue/70 mb-2 text-sm">{error}</p>
        <button onClick={() => startGame(level)} className="bg-gold text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gold-dark transition-colors">Intentar de nuevo</button>
        <button onClick={onBack} className="text-dark-blue/50 text-sm mt-3 hover:text-dark-blue">Volver a juegos</button>
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="text-6xl mb-4">{correctCount === 5 ? '🎉' : correctCount >= 3 ? '👏' : '💪'}</div>
        <h2 className="font-serif text-2xl font-bold mb-1">¡Juego terminado!</h2>
        <p className="text-dark-blue/60 text-sm mb-2">Nivel: {level}</p>
        <div className="bg-white rounded-2xl px-8 py-5 border border-gold/10 mb-6">
          <div className="text-4xl font-bold text-gold">{correctCount}<span className="text-dark-blue/30 text-2xl">/{questions.length}</span></div>
          <p className="text-dark-blue/50 text-xs mt-1">
            {correctCount === 5 ? '¡Perfecto! Eres un experto' :
             correctCount >= 3 ? '¡Buen trabajo!' :
             'Sigue practicando'}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => startGame(level)} className="bg-gold text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gold-dark transition-colors">Jugar de nuevo</button>
          <button onClick={onBack} className="bg-white border border-gold/10 text-dark-blue px-6 py-2.5 rounded-full text-sm font-medium hover:border-gold/30 transition-colors">Volver a juegos</button>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  if (!q) return null;

  const isCorrectAnswer = selected !== null && q.options[selected] === q.correct;

  return (
    <div className="h-full flex flex-col px-6 py-6 overflow-y-auto">
      <button onClick={onBack} className="self-start text-dark-blue/50 hover:text-dark-blue text-sm mb-4">&larr; Volver a juegos</button>
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-dark-blue/50 bg-white px-3 py-1 rounded-full border border-gold/10">
            {currentQ + 1} / {questions.length}
          </span>
          <span className="text-xs text-gold font-medium bg-gold/10 px-3 py-1 rounded-full">
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </span>
        </div>
        <div className="bg-white rounded-2xl border border-gold/10 p-6 mb-5">
          <h3 className="font-serif text-lg font-bold text-dark-blue leading-relaxed">{q.question}</h3>
        </div>
        <div className="grid gap-2.5">
          {OPTION_LABELS.map((key, idx) => {
            const isCorrect = q.options[idx] === q.correct;
            const isSelected = idx === selected;
            let bg = 'bg-white border-gold/10';
            if (!showFeedback) bg += ' hover:border-gold/30 hover:shadow-sm';
            if (showFeedback && isCorrect) bg = 'bg-green-50 border-green-400';
            else if (showFeedback && isSelected && !isCorrect) bg = 'bg-red-50 border-red-300';
            else if (isSelected) bg = 'bg-gold/10 border-gold';

            return (
              <button
                key={key}
                onClick={() => handleAnswer(idx)}
                disabled={showFeedback}
                className={`border rounded-2xl p-4 text-left transition-all active:scale-[0.98] disabled:active:scale-100 ${bg}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                    showFeedback && isCorrect ? 'bg-green-500 text-white' :
                    showFeedback && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                    isSelected ? 'bg-gold text-white' :
                    'bg-cream text-dark-blue/60'
                  }`}>
                    {showFeedback && isCorrect ? '✓' :
                     showFeedback && isSelected && !isCorrect ? '✗' :
                     key.toUpperCase()}
                  </span>
                  <span className="text-sm text-dark-blue leading-relaxed">{q.options[idx]}</span>
                </div>
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="mt-5 space-y-3">
            <div className={`rounded-2xl p-4 text-sm text-center font-medium ${
              isCorrectAnswer
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              {isCorrectAnswer ? (
                <>✅ ¡Correcto!</>
              ) : (
                <>❌ La respuesta correcta era: <span className="font-bold">{q.correct}</span></>
              )}
            </div>
            <button
              onClick={nextQuestion}
              className="w-full bg-gold text-white py-3 rounded-full font-semibold text-sm hover:bg-gold-dark transition-colors"
            >
              {currentQ + 1 < questions.length ? 'Siguiente pregunta →' : 'Ver resultado'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
