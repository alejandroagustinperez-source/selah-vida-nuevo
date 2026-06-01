export default function Verse() {
  return (
    <section className="py-16 md:py-0 md:min-h-[50vh] flex items-center" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2">
        {/* Left: open Bible image — hidden on mobile */}
        <div className="hidden md:block h-full min-h-[400px] relative overflow-hidden rounded-r-3xl">
          <img
            src="https://images.unsplash.com/photo-1530533718754-001d7f4f6c5d?w=700&q=80"
            alt="Biblia abierta"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.7) saturate(1.1)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(250,247,242,0) 60%, #FAF7F2 100%)' }} />
        </div>

        {/* Right: text */}
        <div className="flex flex-col justify-center px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <span className="text-xs tracking-[3px] font-semibold mb-4" style={{ color: '#C9922A' }}>SALMOS 46:1</span>
          <p className="font-serif text-[clamp(1.4rem,3.5vw,2.4rem)] italic leading-relaxed font-semibold" style={{ color: '#0F3D3D' }}>
            &laquo;Dios es nuestro amparo y nuestra fortaleza,<br className="hidden sm:block" />
            nuestra ayuda segura en momentos de angustia.&raquo;
          </p>
        </div>
      </div>
    </section>
  );
}
