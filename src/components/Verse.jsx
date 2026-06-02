export default function Verse() {
  return (
    <section className="py-16 md:py-20 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <span className="font-serif font-bold text-4xl md:text-5xl" style={{ color: '#8B1A1A' }}>IV</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80"
              alt="Biblia abierta"
              className="w-full h-72 md:h-96 object-cover"
              loading="lazy"
            />
          </div>

          <div>
            <p className="text-xs tracking-[0.15em] font-semibold mb-4" style={{ color: '#C9922A' }}>SALMOS 46:1</p>
            <p className="font-serif text-lg md:text-xl leading-relaxed" style={{ color: '#0F3D3D', lineHeight: '1.8' }}>
              Dios es nuestro amparo y nuestra fortaleza, nuestro pronto auxilio en las tribulaciones.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
