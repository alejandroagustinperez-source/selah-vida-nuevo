import { Link } from 'react-router-dom';

export default function FinalCta() {
  return (
    <section className="py-16 md:py-24 text-center px-6" style={{ backgroundColor: '#0F3D3D' }}>
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-[clamp(1.8rem,4.5vw,2.8rem)] font-bold leading-tight mb-4" style={{ color: '#FAF7F2' }}>
          Empezá hoy &mdash; Tu alma lo necesita
        </h2>
        <p className="text-sm md:text-base mb-9 max-w-lg mx-auto leading-relaxed" style={{ color: 'rgba(250,247,242,0.65)' }}>
          No esperes a que el peso sea demasiado. Dios te espera con brazos abiertos.
        </p>
        <Link
          to="/register"
          className="inline-block px-10 py-3.5 rounded-full text-xs tracking-[2px] font-semibold uppercase hover:opacity-90 transition-all"
          style={{ backgroundColor: '#C9922A', color: '#fff' }}
        >
          Quiero empezar gratis
        </Link>
      </div>
    </section>
  );
}
