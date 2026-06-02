export default function Verse() {
  return (
    <section className="py-6 md:py-10 md:min-h-[350px]" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="w-full h-full md:min-h-[350px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800"
            alt="Biblia abierta"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
        </div>

        <div className="flex flex-col justify-center px-6 md:pl-12 md:pr-12 py-4 md:py-0">
          <p className="text-xs tracking-[0.15em] font-semibold mb-4" style={{ color: '#C9922A' }}>SALMOS 46:1</p>
          <p className="font-serif text-lg md:text-xl leading-relaxed" style={{ color: '#0F3D3D', lineHeight: '1.8' }}>
            Dios es nuestro amparo y nuestra fortaleza, nuestro pronto auxilio en las tribulaciones.
          </p>
        </div>
      </div>
    </section>
  );
}
