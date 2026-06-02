import { useState, useEffect, useRef } from 'react';

const tips = [
  'Hablá con Rafael sobre lo que sentís, sin filtros. Está disponible las 24 horas. 🕊',
  'Explorá los Juegos Bíblicos para aprender la Palabra de forma divertida. 📖',
  'La Oración Guiada te acompaña en 7 caminos distintos de conexión con Dios. 🙏',
  'Con la cuenta Premium accedés a música de alabanza y conversaciones ilimitadas. ✨',
];

export default function RafaelWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const hasAutoOpened = useRef(false);

  useEffect(() => {
    if (!hasAutoOpened.current) {
      hasAutoOpened.current = true;
      const timer = setTimeout(() => setIsOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  function prevTip() {
    setCurrentTip(prev => (prev === 0 ? tips.length - 1 : prev - 1));
  }

  function nextTip() {
    setCurrentTip(prev => (prev === tips.length - 1 ? 0 : prev + 1));
  }

  return (
    <>
      <style>{`
        @keyframes widget-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.12); opacity: 0.25; }
          100% { transform: scale(1); opacity: 0.6; }
        }
        @keyframes widget-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .widget-pulse {
          animation: widget-pulse 2.5s ease-in-out infinite;
        }
        .widget-card-enter {
          animation: widget-fade-up 200ms ease forwards;
        }
      `}</style>

      {isOpen && (
        <div
          className="widget-card-enter"
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            width: '300px',
            zIndex: 50,
            backgroundColor: '#FAF7F2',
            border: '1px solid #C9922A',
            borderRadius: '10px',
            boxShadow: '0 8px 32px rgba(15,61,61,0.15)',
          }}
        >
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute', top: '8px', right: '10px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#0F3D3D', fontSize: '18px', lineHeight: '1',
              padding: '4px',
            }}
          >
            ×
          </button>

          <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/rafael-avatar.png"
              alt="Rafael"
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#0F3D3D', fontSize: '15px' }}>
                Rafael
              </div>
              <div style={{ color: '#C9922A', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Tu guía espiritual
              </div>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: '#C9922A', margin: '0 16px' }} />

          <div style={{ padding: '14px 16px 8px', fontSize: '13px', color: '#0F3D3D', lineHeight: '1.5', minHeight: '72px' }}>
            {tips[currentTip]}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '0 16px 12px' }}>
            <button onClick={prevTip} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C9922A', fontSize: '16px', padding: '2px 6px' }}>
              ←
            </button>
            <div style={{ display: 'flex', gap: '5px' }}>
              {tips.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    backgroundColor: i === currentTip ? '#C9922A' : 'rgba(201,146,42,0.3)',
                    transition: 'background-color 150ms',
                  }}
                />
              ))}
            </div>
            <button onClick={nextTip} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C9922A', fontSize: '16px', padding: '2px 6px' }}>
              →
            </button>
          </div>

          <div style={{ padding: '0 16px 16px' }}>
            <a
              href="/register"
              style={{
                display: 'block', width: '100%', textAlign: 'center',
                fontFamily: "'Playfair Display', serif", fontSize: '14px',
                backgroundColor: '#0F3D3D', color: '#FAF7F2',
                padding: '10px', borderRadius: '6px', textDecoration: 'none',
                transition: 'background-color 200ms',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C9922A'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F3D3D'}
            >
              ¡Comenzar gratis!
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 50,
          width: '64px', height: '64px', borderRadius: '50%',
          border: '2px solid #C9922A', padding: 0, cursor: 'pointer',
          background: 'none', outline: 'none',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}
      >
        <div
          className="widget-pulse"
          style={{
            position: 'absolute', inset: '-6px', borderRadius: '50%',
            border: '2px solid #C9922A', pointerEvents: 'none',
          }}
        />
        <img
          src="/rafael-avatar.png"
          alt="Rafael"
          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
        />
      </button>
    </>
  );
}
