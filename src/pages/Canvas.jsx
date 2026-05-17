import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import confetti from 'canvas-confetti';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const PIECES = [
  { key: 'trivia_hard', label: 'Pieza 1', challenge: 'Gana la Trivia en nivel Difícil', emoji: '🏆', pieces: 'Pieza 1 (izquierda)' },
  { key: 'verse_game', label: 'Pieza 2', challenge: 'Completa Adivina el Versículo 4 veces', emoji: '📖', pieces: 'Pieza 2' },
  { key: 'word_search', label: 'Pieza 3', challenge: 'Completa la Sopa de Letras 10 veces', emoji: '🔤', pieces: 'Pieza 3' },
  { key: 'quote_game', label: 'Pieza 4', challenge: 'Completa ¿Quién dijo esto? 5 veces', emoji: '👤', pieces: 'Pieza 4 (derecha)' },
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
    <div className="h-full flex flex-col px-4 sm:px-6 py-6 overflow-y-auto">
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">🖼️</div>
        <h1 className="font-serif text-2xl font-bold text-dark-blue">El Lienzo Sagrado</h1>
        <p className="text-dark-blue/50 text-sm mt-1 max-w-md mx-auto">
          Completá desafíos bíblicos para revelar &laquo;La Última Cena&raquo;
        </p>
      </div>

      {showAllComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6" onClick={() => setShowAllComplete(false)}>
          <div className="bg-cream rounded-3xl p-8 text-center max-w-sm border-4 border-gold shadow-2xl animate-bounce-in">
            <div className="text-7xl mb-4">🙏</div>
            <h2 className="font-serif text-2xl font-bold text-dark-blue mb-2">¡Has completado La Última Cena!</h2>
            <p className="text-dark-blue/60 text-sm">Has desbloqueado todas las piezas. Que este lienzo te recuerde el amor infinito de Cristo.</p>
            <button onClick={() => setShowAllComplete(false)} className="mt-6 bg-gold text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gold-dark transition-colors">Cerrar</button>
          </div>
        </div>
      )}

      {/* Frame */}
      <div className="relative max-w-2xl mx-auto w-full mb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/30 via-gold/10 to-gold/30 rounded-3xl blur-sm" />
        <div className="relative bg-gradient-to-br from-[#d4a84b] via-[#c9952e] to-[#b8860b] p-1.5 rounded-2xl shadow-2xl">
          <div className="bg-gradient-to-br from-[#f5e6c8] via-[#e8d5a8] to-[#d4b87a] p-1 rounded-xl">
            <div className="bg-[#1a1a1a] rounded-lg overflow-hidden" style={{ aspectRatio: '1659/948' }}>
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
                          <span className="text-4xl drop-shadow-lg">🔒</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {justUnlocked && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce z-10 whitespace-nowrap">
            🎉 ¡Pieza desbloqueada!
          </div>
        )}
      </div>

      {/* Challenges */}
      <div className="max-w-lg mx-auto w-full space-y-3 mb-8">
        <h3 className="font-serif text-lg font-bold text-dark-blue text-center mb-4">Desafíos</h3>
        {PIECES.map((piece) => {
          const unlocked = pieces?.[piece.key];
          const count = progress?.[piece.key];
          return (
            <div
              key={piece.key}
              className={`bg-white rounded-2xl border p-4 transition-all ${
                unlocked ? 'border-green-300 bg-green-50/30' : 'border-gold/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  unlocked ? 'bg-green-100' : 'bg-cream'
                }`}>
                  {piece.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${unlocked ? 'text-green-700' : 'text-dark-blue'}`}>
                    {piece.challenge}
                  </p>
                  <p className="text-xs text-dark-blue/40 mt-0.5">
                    {piece.pieces}
                    {!unlocked && count !== undefined && typeof count === 'number' && (
                      <span className="ml-2 text-gold font-medium">{count}/{count >= 4 ? 4 : count >= 10 ? 10 : 5}</span>
                    )}
                  </p>
                </div>
                {unlocked && (
                  <span className="text-xl shrink-0">✅</span>
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
    </div>
  );
}
