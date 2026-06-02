export default function Verse() {
  return (
    <section className="py-16 md:py-20 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="overflow-hidden rounded-lg shadow-lg md:h-[320px]">
            <img
              src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800"
              alt="Biblia abierta"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col justify-center">
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
