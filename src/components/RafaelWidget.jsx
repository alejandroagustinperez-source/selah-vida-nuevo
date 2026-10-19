import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const tips = [
  'Habla con Rafael sobre lo que sientes, sin filtros. Está disponible las 24 horas.',
  'Explora los juegos bíblicos para aprender la Palabra de forma divertida.',
  'La oración guiada te acompaña en siete caminos distintos para conectar con Dios.',
  'Con Premium tienes conversaciones sin límite y música de alabanza.',
];

export default function RafaelWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const prevTip = () => setCurrentTip((p) => (p === 0 ? tips.length - 1 : p - 1));
  const nextTip = () => setCurrentTip((p) => (p === tips.length - 1 ? 0 : p + 1));

  return (
    <div className="font-body">
      {isOpen && (
        <div
          role="dialog"
          aria-label="Rafael, tu guía espiritual"
          className="fixed bottom-[104px] right-4 md:right-6 w-[300px] max-w-[calc(100vw-32px)] z-50 bg-sv-cream border border-sv-line rounded-2xl shadow-[0_12px_32px_rgba(15,61,61,0.18)]"
        >
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar"
            className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center text-sv-teal hover:opacity-70"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <img src="/rafael-avatar.png" alt="" className="w-10 h-10 rounded-full object-cover" />
            <div className="flex flex-col">
              <span className="font-display font-semibold text-sv-teal">Rafael</span>
              <span className="text-[13px] text-sv-muted">Tu guía espiritual</span>
            </div>
          </div>

          <p className="mx-4 pt-3 border-t border-sv-line text-[15px] leading-relaxed text-sv-ink min-h-[76px]" aria-live="polite">
            {tips[currentTip]}
          </p>

          <div className="flex items-center justify-center gap-2 px-4 pb-2">
            <button onClick={prevTip} aria-label="Consejo anterior" className="w-10 h-10 flex items-center justify-center text-sv-gold-text">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5" aria-hidden="true">
              {tips.map((_, i) => (
                <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentTip ? 'bg-sv-gold' : 'bg-sv-gold/30'}`} />
              ))}
            </div>
            <button onClick={nextTip} aria-label="Consejo siguiente" className="w-10 h-10 flex items-center justify-center text-sv-gold-text">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="px-4 pb-4">
            <Link
              to="/register"
              className="flex items-center justify-center min-h-[44px] rounded-full bg-sv-teal text-sv-cream font-semibold hover:bg-sv-night transition-colors"
            >
              Hablar con Rafael gratis
            </Link>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((p) => !p)}
        aria-label={isOpen ? 'Cerrar el mensaje de Rafael' : 'Abrir el mensaje de Rafael'}
        aria-expanded={isOpen}
        className="fixed bottom-6 right-4 md:right-6 z-50 w-16 h-16 rounded-full border-2 border-sv-gold-light p-0 overflow-hidden shadow-[0_10px_24px_rgba(5,25,25,0.3)]"
      >
        <img src="/rafael-avatar.png" alt="" className="w-full h-full object-cover" />
      </button>
    </div>
  );
}
