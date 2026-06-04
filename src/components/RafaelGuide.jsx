import { useState, useEffect } from 'react';

export default function RafaelGuide({ sectionKey, message }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const key = 'rafael_guide_' + sectionKey;
    const seen = localStorage.getItem(key);
    if (!seen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem(key, 'seen');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [sectionKey]);

  return (
    <>
      <style>{`
        @keyframes guide-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .guide-card-enter {
          animation: guide-fade-up 200ms ease forwards;
        }
        @media (max-width: 768px) {
          .rafael-guide-card {
            bottom: 140px !important;
            right: 12px !important;
            width: calc(100vw - 24px) !important;
            max-width: 320px !important;
          }
          .rafael-guide-btn {
            bottom: 90px !important;
            right: 12px !important;
          }
        }
      `}</style>

      {isOpen && (
        <div
          className="guide-card-enter rafael-guide-card"
          style={{
            position: 'fixed',
            bottom: '24px',
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
              color: '#6b6b6b', fontSize: '18px', lineHeight: '1',
              padding: '4px',
            }}
          >
            ×
          </button>

          <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/rafael-avatar.png"
              alt="Rafael"
              style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #C9922A', objectFit: 'cover' }}
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

          <div style={{ height: '1px', backgroundColor: '#C9922A', opacity: 0.3, margin: '0 16px' }} />

          <div style={{ padding: '12px 16px', fontSize: '14px', color: '#2C2C2C', lineHeight: 1.6 }}>
            {message}
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Rafael puede ayudarte"
          className="rafael-guide-btn"
          style={{
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 50,
            width: '40px', height: '40px', borderRadius: '50%',
            background: '#0F3D3D', color: '#FAF7F2',
            border: '2px solid #C9922A',
            fontSize: '18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ?
        </button>
      )}
    </>
  );
}
