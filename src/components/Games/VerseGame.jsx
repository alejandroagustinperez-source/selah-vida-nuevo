import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const MAX_ATTEMPTS = 3;

const HINTS = [
  { label: 'Testamento', icon: '📜' },
  { label: 'Libro', icon: '📖' },
  { label: 'Capítulo', icon: '🔢' },
];

function normalizeAnswer(input) {
  let s = input.trim().replace(/^San\s+/i, '');
  s = s.replace(/^(Primera|Primer|1era)\s+/i, '1 ');
  s = s.replace(/^(Segunda|2da)\s+/i, '2 ');
  s = s.replace(/^(Tercera|3ra)\s+/i, '3 ');
  s = s.replace(/^Salmo\s+/i, 'Salmos ');
  return s.toLowerCase().replace(/\s+/g, ' ');
}

export default function VerseGame({ onBack, onComplete }) {
  const [screen, setScreen] = useState('start');
  const [verse, setVerse] = useState(null);
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [error, setError] = useState('');

  const { isPremium } = useAuth();

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const fetchVerse = async () => {
    setScreen('loading');
    setError('');
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: 'verse' }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al obtener versículo');
      }
      const data = await res.json();
      setVerse(data);
      setAttempts(0);
      setHintLevel(0);
      setInput('');
      setGameOver(false);
      setWon(false);
      setScreen('playing');
    } catch (err) {
      setError(err.message);
      setScreen('error');
    }
  };

  const getExpectedAnswers = (v) => {
    const main = `${v.book} ${v.chapter}`;
    const aliases = (v.aliases || []).map((a) => {
      if (a.includes(' ')) return a;
      return `${a} ${v.chapter}`;
    });
    return [main, ...aliases];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || gameOver) return;

    const answer = normalizeAnswer(input);
    const expected = getExpectedAnswers(verse).map(normalizeAnswer);

    if (expected.includes(answer)) {
      setWon(true);
      setGameOver(true);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      const newHintLevel = Math.min(hintLevel + 1, MAX_ATTEMPTS);
      setHintLevel(newHintLevel);

      if (newAttempts >= MAX_ATTEMPTS) {
        setGameOver(true);
      }
    }
    setInput('');
  };

  const handleSkip = () => {
    setGameOver(true);
    setInput('');
  };

  useEffect(() => {
    if (gameOver) onComplete?.('verse_game');
  }, [gameOver]);

  const displayedHints = [];
  if (hintLevel >= 1) displayedHints.push({ icon: '📜', text: `Es del ${verse.testament} Testamento` });
  if (hintLevel >= 2) displayedHints.push({ icon: '📖', text: `Es del libro de ${verse.book}` });
  if (hintLevel >= 3) displayedHints.push({ icon: '🔢', text: `Es del capítulo ${verse.chapter}` });

  const refParts = [];
  refParts.push(`${verse?.book} ${verse?.chapter}`);
  if (verse?.verse) refParts.push(`:${verse.verse}`);
  if (verse?.verses) refParts.push(`:${verse.verses}`);
  const fullRef = refParts.join('');

  const verseRef = verse ? (verse.verses ? `${verse.book} ${verse.chapter}:${verse.verses}` : `${verse.book} ${verse.chapter}:${verse.verse}`) : '';

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
          <div className="text-5xl mb-3">🔍</div>
          <h2 className="font-serif text-2xl font-bold mb-2">Adivina el Versículo</h2>
          <p className="text-dark-blue/60 text-sm max-w-sm mb-6">
            Te mostramos un versículo completo de la Biblia RVR1960.
            Adiviná de qué libro y capítulo es. Tenés 3 pistas si no sabés.
          </p>
          <button
            onClick={fetchVerse}
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
        <p className="text-dark-blue/60 text-sm">Preparando versículo...</p>
      </div>
    );
  }

  if (screen === 'error') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="text-4xl mb-4">❌</div>
        <p className="text-dark-blue/70 mb-2 text-sm">{error}</p>
        <button onClick={fetchVerse} className="bg-gold text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gold-dark transition-colors">Intentar de nuevo</button>
        <button onClick={onBack} className="text-dark-blue/50 text-sm mt-3 hover:text-dark-blue">Volver a juegos</button>
      </div>
    );
  }

  if (!verse) return null;

  return (
    <div className="h-full flex flex-col px-6 py-6 overflow-y-auto">
      <button onClick={onBack} className="self-start text-dark-blue/50 hover:text-dark-blue text-sm mb-4">&larr; Volver a juegos</button>
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        {/* Attempt dots */}
        {!gameOver && (
          <div className="flex items-center justify-center gap-2 mb-4">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${i < attempts ? 'bg-red-400' : 'bg-cream-dark border border-gold/20'}`} />
            ))}
            <span className="text-xs text-dark-blue/50 ml-2">{MAX_ATTEMPTS - attempts} intento(s)</span>
          </div>
        )}

        {/* Verse card */}
        <div className="bg-white rounded-2xl border border-gold/10 p-6 mb-5">
          <div className="text-3xl text-center mb-4">📖</div>
          <p className="font-serif text-lg text-dark-blue leading-relaxed text-center italic">
            &ldquo;{verse.text}&rdquo;
          </p>
        </div>

        {/* Hints */}
        {displayedHints.length > 0 && (
          <div className="space-y-2 mb-4">
            {displayedHints.map((h, i) => (
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-800 flex items-center gap-2">
                <span>{h.icon}</span>
                <span className="font-medium">{h.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Result */}
        {gameOver && (
          <div className="mb-5 space-y-3">
            <div className={`rounded-2xl p-4 text-center ${
              won
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-semibold text-sm ${won ? 'text-green-700' : 'text-red-600'}`}>
                {won ? '✅ ¡Correcto! 🎉' : '❌ Se acabaron los intentos'}
              </p>
              <p className="text-sm text-dark-blue/70 mt-1.5">
                <span className="font-bold text-gold">{verseRef}</span>
              </p>
            </div>

            <div className="bg-cream rounded-2xl p-4 border border-gold/10">
              <p className="text-xs text-gold font-semibold mb-1">📖 Explicación</p>
              <p className="text-sm text-dark-blue/70 leading-relaxed">{verse.explanation}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={fetchVerse} className="flex-1 bg-gold text-white py-2.5 rounded-full text-sm font-semibold hover:bg-gold-dark transition-colors">Jugar de nuevo</button>
              <button onClick={onBack} className="flex-1 bg-white border border-gold/10 text-dark-blue py-2.5 rounded-full text-sm font-medium hover:border-gold/30 transition-colors">Volver a juegos</button>
            </div>
          </div>
        )}

        {/* Input */}
        {!gameOver && (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <p className="text-xs text-dark-blue/50 text-center">Escribí el libro y capítulo (ej: Juan 3)</p>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ej: Juan 3, Salmos 23..."
              className="w-full px-5 py-3 rounded-full border border-gold/20 bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm text-center"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex-1 bg-gold text-white py-3 rounded-full font-semibold text-sm hover:bg-gold-dark transition-colors disabled:opacity-40"
              >
                Responder
              </button>
              <button type="button" onClick={handleSkip} className="text-dark-blue/40 hover:text-dark-blue text-sm underline">
                No sé
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
