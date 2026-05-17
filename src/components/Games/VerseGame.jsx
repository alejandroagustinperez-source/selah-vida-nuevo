import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const MAX_ATTEMPTS = 3;

export default function VerseGame({ onBack }) {
  const [screen, setScreen] = useState('start');
  const [verseData, setVerseData] = useState(null);
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [revealed, setRevealed] = useState(false);
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
        throw new Error(data.error || 'Error al generar versículo');
      }
      const data = await res.json();
      setVerseData(data);
      setAttempts(0);
      setInput('');
      setFeedback(null);
      setRevealed(false);
      setScreen('playing');
    } catch (err) {
      setError(err.message);
      setScreen('error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const answer = input.trim().toLowerCase();
    const correct = verseData.missing_word.toLowerCase();

    if (answer === correct) {
      setFeedback({ type: 'correct', message: '¡Correcto! 🎉' });
      setRevealed(true);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setFeedback({ type: 'fail', message: `Respuesta: "${verseData.missing_word}"` });
        setRevealed(true);
      } else {
        setFeedback({ type: 'wrong', message: `Incorrecto. Te quedan ${MAX_ATTEMPTS - newAttempts} intento(s).` });
      }
    }
    setInput('');
  };

  const handleSkip = () => {
    setFeedback({ type: 'fail', message: `Respuesta: "${verseData.missing_word}"` });
    setRevealed(true);
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
            Te mostramos un versículo bíblico con una palabra faltante.
            Tenés 3 intentos para adivinar la palabra correcta.
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

  if (!verseData) return null;

  const displayVerse = revealed
    ? verseData.verse.replace('___', `**${verseData.missing_word}**`)
    : verseData.verse;

  return (
    <div className="h-full flex flex-col px-6 py-6 overflow-y-auto">
      <button onClick={onBack} className="self-start text-dark-blue/50 hover:text-dark-blue text-sm mb-4">&larr; Volver a juegos</button>
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
        {!revealed && (
          <div className="flex items-center gap-2 mb-4">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${i < attempts ? 'bg-red-400' : 'bg-cream-dark border border-gold/20'}`} />
            ))}
            <span className="text-xs text-dark-blue/50 ml-2">{MAX_ATTEMPTS - attempts} intento(s)</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gold/10 p-6 mb-5 w-full">
          <div className="text-3xl text-center mb-4">📖</div>
          <p className="font-serif text-lg text-dark-blue leading-relaxed text-center italic">
            {displayVerse.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
              part.startsWith('**') && part.endsWith('**')
                ? <span key={i} className="text-gold font-bold not-italic">{part.slice(2, -2)}</span>
                : <span key={i}>{part}</span>
            )}
          </p>
        </div>

        {revealed && (
          <div className="text-center mb-5">
            <p className="text-sm text-dark-blue/60">
              <span className="font-semibold text-dark-blue">{verseData.reference}</span>
            </p>
            {verseData.hint && (
              <p className="text-xs text-dark-blue/40 mt-1">Pista: {verseData.hint}</p>
            )}
          </div>
        )}

        {feedback && (
          <div className={`w-full text-center mb-4 px-4 py-3 rounded-2xl text-sm ${
            feedback.type === 'correct' ? 'bg-green-50 text-green-700 border border-green-200' :
            feedback.type === 'fail' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
            'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {feedback.message}
          </div>
        )}

        {!revealed ? (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí la palabra que falta..."
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
              <button
                type="button"
                onClick={handleSkip}
                className="text-dark-blue/40 hover:text-dark-blue text-sm underline"
              >
                Saltar
              </button>
            </div>
          </form>
        ) : (
          <div className="flex gap-3">
            <button onClick={fetchVerse} className="bg-gold text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gold-dark transition-colors">Jugar de nuevo</button>
            <button onClick={onBack} className="bg-white border border-gold/10 text-dark-blue px-6 py-2.5 rounded-full text-sm font-medium hover:border-gold/30 transition-colors">Volver a juegos</button>
          </div>
        )}
      </div>
    </div>
  );
}
