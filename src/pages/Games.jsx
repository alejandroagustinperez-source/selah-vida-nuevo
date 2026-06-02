import { useAuth } from '../context/AuthContext';
import TriviaGame from '../components/Games/TriviaGame';
import VerseGame from '../components/Games/VerseGame';
import WordSearchGame from '../components/Games/WordSearchGame';
import QuoteGame from '../components/Games/QuoteGame';
import PremiumModal from '../components/PremiumModal';
import { useState } from 'react';
import { supabase } from '../supabase';
import { trackEvent } from '../utils/tracking';

const ROMAN = ['I', 'II', 'III', 'IV'];

const GAMES = [
  { id: 'trivia', title: 'Trivia Bíblica', desc: 'Respondé preguntas bíblicas de distintos niveles' },
  { id: 'verse', title: 'Adivina el Versículo', desc: 'Completá versículos bíblicos con la palabra faltante' },
  { id: 'wordsearch', title: 'Sopa de Letras', desc: 'Encontrá palabras bíblicas ocultas en la grilla' },
  { id: 'quote', title: '¿Quién dijo esto?', desc: 'Adiviná qué personaje bíblico dijo cada cita' },
];

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function Games() {
  const { isPremium } = useAuth();
  const [activeGame, setActiveGame] = useState(null);
  const [showPremium, setShowPremium] = useState(false);

  const handleSelect = (gameId) => {
    if (!isPremium) {
      setShowPremium(true);
      return;
    }
    trackEvent('game_played', { game: gameId });
    setActiveGame(gameId);
  };

  const handleGameComplete = async (type) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      await fetch(`${API_BASE}/canvas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ type }),
      });
    } catch (err) {
      console.error('Error updating canvas progress:', err);
    }
  };

  if (activeGame === 'trivia') return <TriviaGame onBack={() => setActiveGame(null)} onComplete={handleGameComplete} />;
  if (activeGame === 'verse') return <VerseGame onBack={() => setActiveGame(null)} onComplete={handleGameComplete} />;
  if (activeGame === 'wordsearch') return <WordSearchGame onBack={() => setActiveGame(null)} onComplete={handleGameComplete} />;
  if (activeGame === 'quote') return <QuoteGame onBack={() => setActiveGame(null)} onComplete={handleGameComplete} />;

  return (
    <div className="h-full flex flex-col px-4 sm:px-6 py-6 overflow-y-auto">
      <div className="text-center mb-8">
        <div className="text-[32px] mb-2 leading-none" style={{ color: '#C9922A' }}>◆</div>
        <h1 className="font-['Playfair_Display'] font-bold text-[28px] mb-1.5" style={{ color: '#0F3D3D' }}>Juegos Bíblicos</h1>
        <p className="text-sm max-w-md mx-auto" style={{ color: '#6b6b6b' }}>
          Aprendé y divertite con dinámicas interactivas basadas en la Biblia
        </p>
        {!isPremium && (
          <div className="inline-flex items-center gap-1.5 mt-3 text-xs px-4 py-1.5" style={{ color: '#C9922A', border: '1px solid #C9922A', borderRadius: '2px' }}>
            Exclusivo Premium
          </div>
        )}
        {isPremium && (
          <div className="inline-flex items-center gap-1.5 mt-3 text-xs font-['Playfair_Display']" style={{ background: '#C9922A', color: '#FAF7F2', padding: '4px 14px', borderRadius: '2px' }}>
            Premium activo
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto w-full">
        {GAMES.map((game, idx) => (
          <button
            key={game.id}
            onClick={() => handleSelect(game.id)}
            className="group bg-white text-left transition-all active:scale-[0.98] overflow-hidden hover:shadow-[0_4px_16px_rgba(15,61,61,0.08)]"
            style={{ border: '1px solid #E8E0D0', borderRadius: '6px', padding: '24px' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#C9922A'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E8E0D0'}
          >
            <div className="font-['Playfair_Display'] text-2xl mb-3" style={{ color: '#C9922A' }}>{ROMAN[idx]}</div>
            <h3 className="font-['Playfair_Display'] font-bold text-base mb-1" style={{ color: '#0F3D3D' }}>{game.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#6b6b6b' }}>{game.desc}</p>
          </button>
        ))}
      </div>

      <PremiumModal open={showPremium} onClose={() => setShowPremium(false)} />
    </div>
  );
}
