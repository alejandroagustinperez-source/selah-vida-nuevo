export default function Verse() {
  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="grid grid-cols-1 md:grid-cols-[35fr_65fr] items-center max-w-6xl mx-auto">
        <div className="flex justify-center md:justify-end px-6 md:pr-0 md:pl-6 mb-6 md:mb-0">
          <div
            style={{
              border: '3px solid #C9922A',
              padding: '6px',
              backgroundColor: '#FAF7F2',
              boxShadow: '4px 4px 16px rgba(0,0,0,0.25), inset 0 0 12px rgba(0,0,0,0.3)',
              borderRadius: '2px',
              width: '100%',
              maxWidth: '340px',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800"
              alt="Biblia abierta"
              style={{ width: '100%', height: 'auto', display: 'block', filter: 'sepia(20%) contrast(1.05)' }}
              loading="lazy"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-10 md:pr-16 md:pl-12 py-4 md:py-0">
          <p className="text-xs tracking-[0.15em] font-semibold mb-4 self-start" style={{ color: '#C9922A' }}>SALMOS 46:1</p>
          <p className="font-serif italic text-2xl md:text-3xl leading-relaxed" style={{ color: '#0F3D3D', lineHeight: '1.7' }}>
            Dios es nuestro amparo y nuestra fortaleza, nuestro pronto auxilio en las tribulaciones.
          </p>
        </div>
      </div>
    </section>
  );
}
