import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase';
import PremiumModal from '../../components/PremiumModal';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const LEVELS = [
  { key: 'fácil', label: 'Fácil', desc: 'Preguntas básicas de la Biblia' },
  { key: 'medio', label: 'Medio', desc: 'Conocimiento intermedio' },
  { key: 'difícil', label: 'Difícil', desc: 'Para expertos en las Escrituras' },
];

const OPTION_LABELS = ['a', 'b', 'c', 'd'];

export default function TriviaGame({ onBack, onComplete }) {
  const [screen, setScreen] = useState('start');
  const [level, setLevel] = useState('fácil');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [error, setError] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
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
      if (level === 'difícil') onComplete?.('trivia_hard');
      setScreen('result');
    }
  };

  if (screen === 'start') {
    return (
      <>
        <div className="h-full flex flex-col px-6 py-6 overflow-y-auto" style={{ background: '#FAF7F2' }}>
          <button onClick={onBack} className="self-start text-sm mb-4 hover:underline" style={{ color: '#6b6b6b' }}>&larr; Volver a juegos</button>
          <div className="text-center mb-6">
            <div className="text-[28px] mb-3 leading-none" style={{ color: '#C9922A' }}>✦</div>
            <h2 className="font-['Playfair_Display'] font-bold text-2xl mb-2" style={{ color: '#0F3D3D' }}>Trivia Bíblica</h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: '#6b6b6b' }}>
              Poné a prueba tu conocimiento de la Biblia con preguntas generadas por IA.
              Cada partida tiene 5 preguntas con 4 opciones.
            </p>
          </div>
          <div className="grid gap-3 max-w-sm mx-auto w-full">
            {LEVELS.map((l, idx) => (
              <button
                key={l.key}
                onClick={() => { if (!isPremium) { setShowPremiumModal(true); } else { startGame(l.key); } }}
                style={{ background: '#fff', border: '1px solid #E8E0D0', borderRadius: '6px', padding: '16px 20px' }}
                className="text-left transition-all active:scale-[0.98] hover:shadow-[0_4px_16px_rgba(15,61,61,0.08)]"
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#C9922A'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E8E0D0'}
              >
                <div className="flex items-center gap-3">
                  <span className="font-['Playfair_Display'] text-2xl" style={{ color: '#C9922A' }}>{['I','II','III'][idx]}</span>
                  <div>
                    <div className="font-['Playfair_Display'] font-bold" style={{ color: '#0F3D3D' }}>{l.label}</div>
                    <div className="text-xs" style={{ color: '#6b6b6b' }}>{l.desc}</div>
                  </div>
                </div>
              </button>
            ))}
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
        <p className="text-sm" style={{ color: '#6b6b6b' }}>Generando preguntas de nivel {level}...</p>
      </div>
    );
  }

  if (screen === 'error') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6" style={{ background: '#FAF7F2' }}>
        <div className="text-4xl mb-4">❌</div>
        <p className="mb-2 text-sm" style={{ color: '#0F3D3D' }}>{error}</p>
        <button onClick={() => startGame(level)} className="px-6 py-2.5 text-sm font-['Playfair_Display'] transition-colors" style={{ background: '#0F3D3D', color: '#FAF7F2', border: 'none', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.background = '#C9922A'} onMouseLeave={(e) => e.currentTarget.style.background = '#0F3D3D'}>Intentar de nuevo</button>
        <button onClick={onBack} className="text-sm mt-3 hover:underline" style={{ color: '#6b6b6b' }}>Volver a juegos</button>
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6" style={{ background: '#FAF7F2' }}>
        <div className="text-6xl mb-4">{correctCount === 5 ? '🎉' : correctCount >= 3 ? '👏' : '💪'}</div>
        <h2 className="font-['Playfair_Display'] text-2xl font-bold mb-1" style={{ color: '#0F3D3D' }}>¡Juego terminado!</h2>
        <p className="text-sm mb-2" style={{ color: '#6b6b6b' }}>Nivel: {level}</p>
        <div className="px-8 py-5 mb-6" style={{ background: '#fff', border: '1px solid #E8E0D0', borderRadius: '6px' }}>
          <div className="text-4xl font-bold" style={{ color: '#C9922A' }}>{correctCount}<span className="text-2xl" style={{ color: '#6b6b6b' }}>/{questions.length}</span></div>
          <p className="text-xs mt-1" style={{ color: '#6b6b6b' }}>
            {correctCount === 5 ? '¡Perfecto! Eres un experto' :
             correctCount >= 3 ? '¡Buen trabajo!' :
             'Sigue practicando'}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => startGame(level)} className="px-6 py-2.5 text-sm font-['Playfair_Display'] transition-colors" style={{ background: '#0F3D3D', color: '#FAF7F2', border: 'none', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.background = '#C9922A'} onMouseLeave={(e) => e.currentTarget.style.background = '#0F3D3D'}>Jugar de nuevo</button>
          <button onClick={onBack} className="px-6 py-2.5 text-sm font-medium transition-colors" style={{ background: '#fff', border: '1px solid #E8E0D0', color: '#0F3D3D', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#C9922A'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E8E0D0'}>Volver a juegos</button>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  if (!q) return null;

  const isCorrectAnswer = selected !== null && q.options[selected] === q.correct;

  return (
    <div className="h-full flex flex-col px-6 py-6 overflow-y-auto" style={{ background: '#FAF7F2' }}>
      <button onClick={onBack} className="self-start text-sm mb-4 hover:underline" style={{ color: '#6b6b6b' }}>&larr; Volver a juegos</button>
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs px-3 py-1" style={{ background: '#E8E0D0', color: '#0F3D3D', borderRadius: '4px' }}>
            {currentQ + 1} / {questions.length}
          </span>
          <span className="text-xs px-3 py-1 font-medium" style={{ border: '1px solid #C9922A', color: '#C9922A', background: 'transparent', borderRadius: '4px' }}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </span>
        </div>
        <div className="p-6 mb-5" style={{ background: '#fff', border: '1px solid #E8E0D0', borderRadius: '6px' }}>
          <h3 className="font-['Playfair_Display'] text-[17px] font-bold leading-relaxed" style={{ color: '#0F3D3D' }}>{q.question}</h3>
        </div>
        <div className="grid gap-2.5">
          {OPTION_LABELS.map((key, idx) => {
            const isCorrect = q.options[idx] === q.correct;
            const isSelected = idx === selected;
            let borderColor = '#E8E0D0';
            let bg = '#fff';
            let badgeBg = '#FAF7F2';
            let badgeBorder = '#E8E0D0';
            let badgeColor = '#0F3D3D';
            let textColor = '#0F3D3D';
            if (showFeedback && isCorrect) { borderColor = '#0F3D3D'; bg = '#F0F7F4'; badgeBg = '#0F3D3D'; badgeBorder = '#0F3D3D'; badgeColor = '#FAF7F2'; }
            else if (showFeedback && isSelected && !isCorrect) { borderColor = '#8B1A1A'; bg = '#FDF5F5'; badgeBg = '#8B1A1A'; badgeBorder = '#8B1A1A'; badgeColor = '#FAF7F2'; }

            return (
              <button
                key={key}
                onClick={() => handleAnswer(idx)}
                disabled={showFeedback}
                className="text-left transition-all active:scale-[0.98] disabled:active:scale-100"
                style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: '6px', padding: '14px 16px' }}
                onMouseEnter={(e) => { if (!showFeedback) { e.currentTarget.style.borderColor = '#C9922A'; const badge = e.currentTarget.querySelector('.option-badge'); if (badge) { badge.style.background = '#C9922A'; badge.style.color = '#FAF7F2'; badge.style.borderColor = '#C9922A'; } }}}
                onMouseLeave={(e) => { if (!showFeedback) { e.currentTarget.style.borderColor = borderColor; const badge = e.currentTarget.querySelector('.option-badge'); if (badge) { badge.style.background = badgeBg; badge.style.color = badgeColor; badge.style.borderColor = badgeBorder; } }}}
              >
                <div className="flex items-start gap-3">
                  <span className="option-badge shrink-0 w-7 h-7 flex items-center justify-center text-xs font-['Playfair_Display'] transition-all" style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeColor, borderRadius: '4px' }}>
                    {showFeedback && isCorrect ? '✓' :
                     showFeedback && isSelected && !isCorrect ? '✗' :
                     key.toUpperCase()}
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: textColor }}>{q.options[idx]}</span>
                </div>
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="mt-5 space-y-3">
            <div className="p-4 text-sm text-center font-medium" style={{ background: isCorrectAnswer ? '#F0F7F4' : '#FDF5F5', border: `1px solid ${isCorrectAnswer ? '#0F3D3D' : '#8B1A1A'}`, borderRadius: '6px', color: isCorrectAnswer ? '#0F3D3D' : '#8B1A1A' }}>
              {isCorrectAnswer ? (
                <>¡Correcto!</>
              ) : (
                <>La respuesta correcta era: <span className="font-bold">{q.correct}</span></>
              )}
            </div>

            {q.reference && (
              <div className="p-4 text-sm" style={{ background: '#FAF7F2', border: '1px solid #E8E0D0', borderRadius: '6px' }}>
                <p className="font-['Playfair_Display'] font-semibold text-xs mb-1" style={{ color: '#C9922A' }}>Referencia bíblica</p>
                <p className="font-medium" style={{ color: '#0F3D3D' }}>{q.reference}</p>
                {q.explanation && (
                  <p className="text-xs mt-1.5 leading-relaxed" style={{ color: '#6b6b6b' }}>{q.explanation}</p>
                )}
              </div>
            )}

            <button
              onClick={nextQuestion}
              className="w-full py-3 text-sm font-['Playfair_Display'] transition-colors"
              style={{ background: '#0F3D3D', color: '#FAF7F2', border: 'none', borderRadius: '4px' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#C9922A'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#0F3D3D'}
            >
              {currentQ + 1 < questions.length ? 'Siguiente pregunta →' : 'Ver resultado'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
