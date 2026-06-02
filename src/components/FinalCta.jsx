import { Link } from 'react-router-dom';

export default function FinalCta() {
  return (
    <section className="py-16 md:py-20 px-6 text-center" style={{ backgroundColor: '#0F3D3D' }}>
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4" style={{ color: '#FAF7F2' }}>
          Empezá hoy — Tu alma lo necesita
        </h2>
        <p className="text-sm md:text-base mb-8 leading-relaxed" style={{ color: 'rgba(250,247,242,0.8)' }}>
          No esperes a que el peso sea demasiado. Dios te espera con brazos abiertos.
        </p>
        <Link
          to="/register"
          className="inline-block border-2 border-[#C9922A] text-[#C9922A] px-10 py-3.5 rounded-full text-xs tracking-[0.15em] font-semibold uppercase hover:bg-[#C9922A] hover:text-white transition-all"
        >
          Quiero empezar gratis
        </Link>
      </div>
    </section>
  );
}
