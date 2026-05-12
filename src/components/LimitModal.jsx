import { useState, useEffect } from 'react';

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  return `${hours}h ${mins}m`;
}

export default function LimitModal({ resetIn, onClose }) {
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(resetIn || 0);

  useEffect(() => {
    if (!resetIn) return;
    setTimeLeft(resetIn);
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [resetIn]);

  if (dismissed) {
    return (
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 shrink-0">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-amber-800">
            Tus mensajes se reinician en <span className="font-semibold">{formatTime(timeLeft)}</span>
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://pay.hotmart.com/Q105734847S"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm bg-gold text-white px-4 py-1.5 rounded-full font-semibold hover:bg-gold-dark transition-colors"
            >
              Hazte Premium
            </a>
            <button onClick={onClose} className="text-xs text-dark-blue/40 hover:text-dark-blue transition-colors">Ocultar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => {}} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="text-4xl mb-4">🕊️</div>
        <h2 className="font-serif text-2xl font-bold text-dark-blue mb-2">
          Límite alcanzado
        </h2>
        <p className="text-sm text-dark-blue/60 mb-6 leading-relaxed">
          Has usado tus 20 mensajes gratuitos de este período. Tus mensajes se reinician en <span className="font-semibold text-amber-600">{formatTime(timeLeft)}</span>.
        </p>

        <div className="space-y-3">
          <a
            href="https://pay.hotmart.com/Q105734847S"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gold text-white text-sm px-6 py-3.5 rounded-xl font-semibold hover:bg-gold-dark transition-colors shadow-md shadow-gold/20"
          >
            🌟 Hazte Premium — $4.99/mes
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="block w-full bg-cream text-dark-blue/70 text-sm px-6 py-3 rounded-xl font-medium hover:bg-cream-dark transition-colors"
          >
            ⏰ Esperar hasta mañana
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gold/10">
          <p className="text-xs text-dark-blue/40 font-medium mb-3">Con Premium accedés a:</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-dark-blue/60">
            <div className="flex items-center gap-1.5">
              <span className="text-gold">✓</span> Mensajes ilimitados
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gold">✓</span> Música de alabanza
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gold">✓</span> Juegos bíblicos
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gold">✓</span> Oración guiada
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}