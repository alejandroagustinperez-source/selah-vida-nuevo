export default function Verse() {
  return (
    <section className="py-6 md:py-10" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="grid grid-cols-1 md:grid-cols-[45fr_55fr]">
        <div className="w-full overflow-hidden md:max-h-[320px]">
          <img
            src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800"
            alt="Biblia abierta"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            loading="lazy"
          />
        </div>

        <div className="flex flex-col items-center justify-center px-10 md:px-16 py-6 md:py-0">
          <p className="text-xs tracking-[0.15em] font-semibold mb-4 self-start" style={{ color: '#C9922A' }}>SALMOS 46:1</p>
          <p className="font-serif italic text-2xl md:text-3xl leading-relaxed" style={{ color: '#0F3D3D', lineHeight: '1.7' }}>
            Dios es nuestro amparo y nuestra fortaleza, nuestro pronto auxilio en las tribulaciones.
          </p>
        </div>
      </div>
    </section>
  );
}
