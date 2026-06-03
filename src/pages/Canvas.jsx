import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import confetti from 'canvas-confetti';
import RafaelGuide from '../components/RafaelGuide';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const CHALLENGE_ICONS = {
  trivia_hard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="11"/><path d="M7 4H4v4a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V4h-3"/><rect x="7" y="2" width="10" height="4" rx="1"/></svg>,
  verse_game: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  word_search: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  quote_game: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
};

const PIECES = [
  { key: 'trivia_hard', label: 'Pieza 1', challenge: 'Gana la Trivia en nivel Difícil', pieces: 'Pieza 1 (izquierda)', threshold: 1 },
  { key: 'verse_game', label: 'Pieza 2', challenge: 'Completa Adivina el Versículo 4 veces', pieces: 'Pieza 2', threshold: 4 },
  { key: 'word_search', label: 'Pieza 3', challenge: 'Completa la Sopa de Letras 10 veces', pieces: 'Pieza 3', threshold: 10 },
  { key: 'quote_game', label: 'Pieza 4', challenge: 'Completa ¿Quién dijo esto? 5 veces', pieces: 'Pieza 4 (derecha)', threshold: 5 },
];

export default function Canvas() {
  const { user, isPremium } = useAuth();
  const [progress, setProgress] = useState(null);
  const [pieces, setPieces] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [justUnlocked, setJustUnlocked] = useState(null);
  const [showAllComplete, setShowAllComplete] = useState(false);
  const prevPieces = useRef(null);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const fetchProgress = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/canvas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al cargar progreso');
      const data = await res.json();
      return data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProgress();
        setProgress(data.progress);
        setPieces(data.pieces);
        prevPieces.current = data.pieces;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!pieces || !prevPieces.current) return;

    const newlyUnlocked = Object.keys(pieces).find((k) => pieces[k] && !prevPieces.current[k]);
    if (newlyUnlocked) {
      setJustUnlocked(newlyUnlocked);
      fireConfetti();
      setTimeout(() => setJustUnlocked(null), 3000);
    }

    const allDone = Object.values(pieces).every(Boolean);
    if (allDone) {
      setTimeout(() => setShowAllComplete(true), 500);
    }

    prevPieces.current = pieces;
  }, [pieces]);

  const fireConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#C9A84C', '#1a3a4a', '#FAF6EF'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#C9A84C', '#1a3a4a', '#FAF6EF'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  if (!isPremium) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="text-5xl mb-4">⭐</div>
        <h2 className="font-serif text-xl font-bold mb-2">Función exclusiva</h2>
        <p className="text-dark-blue/60 text-sm mb-6">El Lienzo Sagrado es exclusivo para usuarios Premium.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="text-4xl mb-4">❌</div>
        <p className="text-dark-blue/70 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col px-4 sm:px-6 py-6 overflow-y-auto" style={{ background: '#FAF7F2' }}>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-2">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.2">
            <rect x="3" y="2" width="18" height="14" rx="1"/>
            <line x1="12" y1="16" x2="12" y2="22"/>
            <line x1="8" y1="22" x2="16" y2="22"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
          </svg>
        </div>
        <h1 className="font-['Playfair_Display'] font-bold text-[26px]" style={{ color: '#0F3D3D' }}>El Lienzo Sagrado</h1>
        <p className="text-sm mt-1 max-w-md mx-auto" style={{ color: '#6b6b6b' }}>
          Completá desafíos bíblicos para revelar &laquo;La Última Cena&raquo;
        </p>
      </div>

      {showAllComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6" onClick={() => setShowAllComplete(false)}>
          <div className="p-8 text-center max-w-sm shadow-2xl animate-bounce-in" style={{ background: '#FAF7F2', border: '2px solid #C9922A', borderRadius: '8px' }}>
            <div style={{ color: '#C9922A', fontSize: '48px', marginBottom: '16px' }}>◈</div>
            <h2 className="font-['Playfair_Display'] text-2xl font-bold mb-2" style={{ color: '#0F3D3D' }}>¡Has completado La Última Cena!</h2>
            <p className="text-sm" style={{ color: '#6b6b6b' }}>Has desbloqueado todas las piezas. Que este lienzo te recuerde el amor infinito de Cristo.</p>
            <button onClick={() => setShowAllComplete(false)} className="mt-6 px-6 py-2.5 text-sm font-['Playfair_Display'] transition-colors" style={{ background: '#0F3D3D', color: '#FAF7F2', border: 'none', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.background = '#C9922A'} onMouseLeave={(e) => e.currentTarget.style.background = '#0F3D3D'}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Frame */}
      <div className="relative max-w-2xl mx-auto w-full mb-8">
        <div className="relative" style={{ border: '2px solid #C9922A', borderRadius: '8px', boxShadow: '0 0 0 8px #FAF7F2, 0 0 0 9px #E8E0D0' }}>
          <div className="bg-[#1a1a1a] overflow-hidden" style={{ borderRadius: '6px', aspectRatio: '1659/948' }}>
            <div className="grid grid-cols-4 h-full">
              {PIECES.map((piece, idx) => {
                const unlocked = pieces?.[piece.key];
                return (
                  <div key={piece.key} className="relative overflow-hidden">
                    <img
                      src={`/last-supper-${idx + 1}.png`}
                      alt={`Pieza ${idx + 1}`}
                      className={`w-full h-full object-cover transition-all duration-1000 ${
                        unlocked ? 'opacity-100 scale-100' : 'opacity-40 scale-105 blur-lg'
                      } ${justUnlocked === piece.key ? 'animate-reveal-piece' : ''}`}
                    />
                    {!unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {justUnlocked && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 text-sm font-['Playfair_Display'] shadow-lg animate-bounce z-10 whitespace-nowrap" style={{ background: '#C9922A', color: '#FAF7F2', borderRadius: '4px' }}>
            ¡Pieza desbloqueada!
          </div>
        )}
      </div>

      {/* Challenges */}
      <div className="text-center mb-6" style={{ maxWidth: '512px', margin: '0 auto' }}>
        <h3 className="font-['Playfair_Display'] font-bold" style={{ color: '#0F3D3D', fontSize: '18px', marginBottom: '16px' }}>Desafíos</h3>
        <div style={{ width: '60px', height: '1px', background: '#C9922A', opacity: 0.3, margin: '0 auto 16px' }} />
      </div>
      <div className="mx-auto w-full space-y-3 mb-8" style={{ maxWidth: '512px' }}>
        {PIECES.map((piece) => {
          const unlocked = pieces?.[piece.key];
          const count = progress?.[piece.key];
          const completed = unlocked || (count !== undefined && typeof count === 'number' && count >= piece.threshold);
          return (
            <div
              key={piece.key}
              style={{
                background: unlocked ? '#F0F7F4' : '#fff',
                border: `1px solid ${unlocked ? '#0F3D3D' : '#E8E0D0'}`,
                borderRadius: '6px',
                padding: '16px 20px',
                transition: 'all 0.2s',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 flex items-center justify-center" style={{ borderRadius: '6px', background: unlocked ? '#F0F7F4' : '#FAF7F2', border: `1px solid ${unlocked ? '#0F3D3D' : '#E8E0D0'}` }}>
                  {CHALLENGE_ICONS[piece.key]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-['Playfair_Display'] font-bold text-sm" style={{ color: '#0F3D3D' }}>
                    {piece.challenge}
                  </p>
                  <p style={{ color: '#C9922A', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
                    {piece.pieces}
                    {!completed && count !== undefined && typeof count === 'number' && (
                      <span style={{ color: '#C9922A', fontWeight: 600, marginLeft: '8px' }}>({count}/{piece.threshold})</span>
                    )}
                  </p>
                </div>
                {unlocked && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F3D3D" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes revealPiece {
          0% { filter: blur(20px) brightness(0.5); transform: scale(1.1); }
          100% { filter: blur(0) brightness(1); transform: scale(1); }
        }
        .animate-reveal-piece {
          animation: revealPiece 1.2s ease-out forwards;
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
      <RafaelGuide sectionKey="canvas" message="El Lienzo Sagrado es un desafío especial 🎨 Para revelar la obra completa de La Última Cena, completá los 4 desafíos bíblicos. Cada desafío completado desbloquea una pieza del cuadro." />
    </div>
  );
}
