import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase';
import PremiumModal from '../../components/PremiumModal';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const LABELS = ['A', 'B', 'C', 'D'];

export default function VerseGame({ onBack, onComplete }) {
  const { isPremium } = useAuth();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
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

  if (screen === 'start') {
    return (
      <>
        <div className="h-full flex flex-col px-6 py-6 overflow-y-auto" style={{ background: '#FAF7F2' }}>
          <button onClick={onBack} className="self-start text-sm mb-4 hover:underline" style={{ color: '#6b6b6b' }}>&larr; Volver a juegos</button>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-[28px] mb-3 leading-none" style={{ color: '#C9922A' }}>◆</div>
            <h2 className="font-['Playfair_Display'] text-2xl font-bold mb-2" style={{ color: '#0F3D3D' }}>Adivina el Versículo</h2>
            <p className="text-sm max-w-sm mb-6" style={{ color: '#6b6b6b' }}>
              Te mostramos un versículo completo. Elegí la referencia bíblica correcta entre las 4 opciones.
            </p>
            <button
              onClick={() => { if (!isPremium) { setShowPremiumModal(true); } else { fetchVerses(); } }}
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
        <p className="text-sm" style={{ color: '#6b6b6b' }}>Preparando versículos...</p>
      </div>
    );
  }

  if (screen === 'error') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6" style={{ background: '#FAF7F2' }}>
        <div className="text-4xl mb-4">❌</div>
        <p className="mb-2 text-sm" style={{ color: '#0F3D3D' }}>Error al cargar los versículos</p>
        <button onClick={fetchVerses} className="px-6 py-2.5 text-sm font-['Playfair_Display'] transition-colors" style={{ background: '#0F3D3D', color: '#FAF7F2', border: 'none', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.background = '#C9922A'} onMouseLeave={(e) => e.currentTarget.style.background = '#0F3D3D'}>Intentar de nuevo</button>
        <button onClick={onBack} className="text-sm mt-3 hover:underline" style={{ color: '#6b6b6b' }}>Volver a juegos</button>
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div className="h-full flex flex-col px-6 py-6 overflow-y-auto" style={{ background: '#FAF7F2' }}>
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full">
          <div className="text-5xl mb-3">{score === verses.length ? '🎉' : score >= 3 ? '👏' : '💪'}</div>
          <h2 className="font-['Playfair_Display'] text-2xl font-bold mb-1" style={{ color: '#0F3D3D' }}>
            {score === verses.length ? '¡Perfecto!' : score >= 3 ? '¡Muy bien!' : '¡Sigue intentando!'}
          </h2>
          <p className="text-sm mb-6" style={{ color: '#6b6b6b' }}>
            Acertaste <span className="font-bold text-lg" style={{ color: '#C9922A' }}>{score}</span> de <span className="font-bold">{verses.length}</span> versículos
          </p>
          <div className="flex gap-3 w-full max-w-xs">
            <button onClick={fetchVerses} className="flex-1 py-3 text-sm font-['Playfair_Display'] transition-colors" style={{ background: '#0F3D3D', color: '#FAF7F2', border: 'none', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.background = '#C9922A'} onMouseLeave={(e) => e.currentTarget.style.background = '#0F3D3D'}>Jugar de nuevo</button>
            <button onClick={onBack} className="flex-1 py-3 text-sm font-medium transition-colors" style={{ background: '#fff', border: '1px solid #E8E0D0', color: '#0F3D3D', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#C9922A'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E8E0D0'}>Volver</button>
          </div>
        </div>
      </div>
    );
  }

  const current = verses[currentIdx];
  if (!current) return null;

  return (
    <div className="h-full flex flex-col px-6 py-6 overflow-y-auto" style={{ background: '#FAF7F2' }}>
      <button onClick={onBack} className="self-start text-sm mb-4 hover:underline" style={{ color: '#6b6b6b' }}>&larr; Volver a juegos</button>
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        {/* Progress */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <div className="flex gap-1.5 items-center">
            {verses.map((_, i) => (
              <div key={i} style={{ width: '24px', height: '4px', background: i <= currentIdx ? '#C9922A' : '#E8E0D0', borderRadius: '2px', transition: 'background 0.3s' }} />
            ))}
          </div>
          <span className="text-xs ml-2" style={{ color: '#6b6b6b' }}>{currentIdx + 1}/{verses.length}</span>
        </div>

        {/* Verse card */}
        <div className="p-6 mb-6" style={{ background: '#fff', border: '1px solid #E8E0D0', borderRadius: '6px', borderLeft: '3px solid #C9922A' }}>
          <p className="font-['Playfair_Display'] text-base leading-relaxed text-center italic" style={{ color: '#0F3D3D' }}>
            &ldquo;{current.text}&rdquo;
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-5">
          {current.options.map((opt, i) => {
            const isSelected = answered === opt;
            const isCorrectOpt = opt === current.correct;
            let borderColor = '#E8E0D0';
            let bg = '#fff';
            let badgeBg = '#FAF7F2';
            let badgeBorder = '#E8E0D0';
            let badgeColor = '#0F3D3D';
            let textColor = '#0F3D3D';
            if (answered) {
              if (isCorrectOpt) { borderColor = '#0F3D3D'; bg = '#F0F7F4'; badgeBg = '#0F3D3D'; badgeBorder = '#0F3D3D'; badgeColor = '#FAF7F2'; }
              else if (isSelected) { borderColor = '#8B1A1A'; bg = '#FDF5F5'; badgeBg = '#8B1A1A'; badgeBorder = '#8B1A1A'; badgeColor = '#FAF7F2'; }
              else { borderColor = '#E8E0D0'; bg = '#fff'; badgeBg = '#E8E0D0'; badgeBorder = '#E8E0D0'; badgeColor = '#6b6b6b'; textColor = '#6b6b6b'; }
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                disabled={!!answered}
                className="w-full text-left flex items-center gap-4 px-5 py-4 text-sm font-medium transition-all min-h-[52px] touch-action-manipulation cursor-pointer"
                style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: '6px' }}
                onMouseEnter={(e) => { if (!answered) { e.currentTarget.style.borderColor = '#C9922A'; const badge = e.currentTarget.querySelector('.verse-badge'); if (badge) { badge.style.background = '#C9922A'; badge.style.color = '#FAF7F2'; badge.style.borderColor = '#C9922A'; } }}}
                onMouseLeave={(e) => { if (!answered) { e.currentTarget.style.borderColor = '#E8E0D0'; const badge = e.currentTarget.querySelector('.verse-badge'); if (badge) { badge.style.background = '#FAF7F2'; badge.style.color = '#0F3D3D'; badge.style.borderColor = '#E8E0D0'; } }}}
              >
                <span className="verse-badge w-7 h-7 flex items-center justify-center text-xs font-['Playfair_Display'] shrink-0 transition-all" style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeColor, borderRadius: '4px' }}>
                  {answered && isCorrectOpt ? '✓' : answered && isSelected && !isCorrectOpt ? '✗' : LABELS[i]}
                </span>
                <span className="leading-snug" style={{ color: textColor }}>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showResult && (
          <div className="p-4 mb-5 text-center" style={{ background: answered === current.correct ? '#F0F7F4' : '#FDF5F5', border: `1px solid ${answered === current.correct ? '#0F3D3D' : '#8B1A1A'}`, borderRadius: '6px' }}>
            <p className="font-semibold text-sm" style={{ color: answered === current.correct ? '#0F3D3D' : '#8B1A1A' }}>
              {answered === current.correct
                ? '¡Correcto!'
                : `Incorrecto — La respuesta correcta es ${current.correct}`}
            </p>
            {current.explanation && (
              <p className="text-xs mt-2 leading-relaxed" style={{ color: '#6b6b6b' }}>{current.explanation}</p>
            )}
          </div>
        )}

        {/* Next button */}
        {showResult && (
          <button
            onClick={handleNext}
            className="w-full py-3.5 text-sm font-['Playfair_Display'] transition-colors cursor-pointer touch-action-manipulation min-h-[48px]"
            style={{ background: '#0F3D3D', color: '#FAF7F2', border: 'none', borderRadius: '4px' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#C9922A'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#0F3D3D'}
          >
            {currentIdx < verses.length - 1 ? 'Siguiente versículo →' : 'Ver puntaje'}
          </button>
        )}
      </div>
    </div>
  );
}
