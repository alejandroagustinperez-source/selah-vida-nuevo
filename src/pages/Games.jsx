import { useAuth } from '../context/AuthContext';
import TriviaGame from '../components/Games/TriviaGame';
import VerseGame from '../components/Games/VerseGame';
import WordSearchGame from '../components/Games/WordSearchGame';
import QuoteGame from '../components/Games/QuoteGame';
import PremiumModal from '../components/PremiumModal';
import { useState } from 'react';
import { supabase } from '../supabase';

const GAMES = [
  {
    id: 'trivia',
    title: 'Trivia Bíblica',
    desc: 'Respondé preguntas bíblicas de distintos niveles',
    emoji: '📝',
    color: 'from-amber-50 to-amber-100/50',
    border: 'border-amber-200/30',
    iconBg: 'bg-amber-100',
  },
  {
    id: 'verse',
    title: 'Adivina el Versículo',
    desc: 'Completá versículos bíblicos con la palabra faltante',
    emoji: '📖',
    color: 'from-blue-50 to-blue-100/50',
    border: 'border-blue-200/30',
    iconBg: 'bg-blue-100',
  },
  {
    id: 'wordsearch',
    title: 'Sopa de Letras',
    desc: 'Encontrá palabras bíblicas ocultas en la grilla',
    emoji: '🔤',
    color: 'from-green-50 to-green-100/50',
    border: 'border-green-200/30',
    iconBg: 'bg-green-100',
  },
  {
    id: 'quote',
    title: '¿Quién dijo esto?',
    desc: 'Adiviná qué personaje bíblico dijo cada cita',
    emoji: '🗣️',
    color: 'from-purple-50 to-purple-100/50',
    border: 'border-purple-200/30',
    iconBg: 'bg-purple-100',
  },
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
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">🎮</div>
        <h1 className="font-serif text-2xl font-bold text-dark-blue">Juegos Bíblicos</h1>
        <p className="text-dark-blue/50 text-sm mt-1 max-w-md mx-auto">
          Aprendé y divertite con dinámicas interactivas basadas en la Biblia
        </p>
        {!isPremium && (
          <div className="inline-flex items-center gap-1.5 mt-3 bg-amber-50 border border-amber-200/50 rounded-full px-4 py-1.5 text-xs text-amber-700">
            ⭐ Exclusivo Premium
          </div>
        )}
        {isPremium && (
          <div className="inline-flex items-center gap-1.5 mt-3 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 text-xs text-gold font-semibold">
            🕊️ Premium activo
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto w-full">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => handleSelect(game.id)}
            className="group relative bg-white rounded-2xl border border-gold/10 p-5 text-left hover:shadow-md hover:border-gold/30 transition-all active:scale-[0.98] overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl ${game.iconBg} flex items-center justify-center text-2xl mb-3`}>
                {game.emoji}
              </div>
              <h3 className="font-serif font-bold text-dark-blue text-base mb-1">{game.title}</h3>
              <p className="text-dark-blue/50 text-xs leading-relaxed">{game.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <PremiumModal open={showPremium} onClose={() => setShowPremium(false)} />
    </div>
  );
}
