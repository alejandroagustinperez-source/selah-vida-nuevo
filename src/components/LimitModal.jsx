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
      <div className="px-6 py-3 shrink-0" style={{ backgroundColor: 'rgba(201,146,42,0.08)', borderBottom: '1px solid rgba(201,146,42,0.2)' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <p className="text-xs sm:text-sm" style={{ color: '#8B1A1A' }}>
            Tus mensajes se reinician en <span className="font-semibold">{formatTime(timeLeft)}</span>
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://pay.hotmart.com/Q105734847S"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm px-4 py-1.5 rounded font-semibold transition-colors"
              style={{ backgroundColor: '#C9922A', color: '#FAF7F2' }}
            >
              Hazte Premium
            </a>
            <button onClick={onClose} className="text-xs transition-colors" style={{ color: 'rgba(15,61,61,0.4)' }}>Ocultar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(15,61,61,0.5)' }} onClick={() => {}} />
      <div className="relative max-w-md w-full p-8 text-center" style={{ backgroundColor: '#FAF7F2', borderRadius: '10px', border: '1px solid #C9922A' }}>
        <div className="text-4xl mb-4">🕊️</div>
        <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: '#0F3D3D' }}>
          Límite alcanzado
        </h2>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(15,61,61,0.6)' }}>
          Has usado tus 20 mensajes gratuitos de este período. Tus mensajes se reinician en <span className="font-semibold" style={{ color: '#8B1A1A' }}>{formatTime(timeLeft)}</span>.
        </p>

        <div className="space-y-3">
          <a
            href="https://pay.hotmart.com/Q105734847S"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-sm px-6 py-3.5 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: '#C9922A', color: '#FAF7F2' }}
          >
            🌟 Hazte Premium — $4.99/mes
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="block w-full text-sm px-6 py-3 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D0', color: 'rgba(15,61,61,0.7)' }}
          >
            ⏰ Esperar hasta mañana
          </button>
        </div>

        <div className="mt-6 pt-6" style={{ borderTop: '1px solid #E8E0D0' }}>
          <p className="text-xs font-medium mb-3" style={{ color: 'rgba(15,61,61,0.4)' }}>Con Premium accedés a:</p>
          <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: 'rgba(15,61,61,0.6)' }}>
            <div className="flex items-center gap-1.5">
              <span style={{ color: '#C9922A' }}>✓</span> Mensajes ilimitados
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ color: '#C9922A' }}>✓</span> Música de alabanza
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ color: '#C9922A' }}>✓</span> Juegos bíblicos
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ color: '#C9922A' }}>✓</span> Oración guiada
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}