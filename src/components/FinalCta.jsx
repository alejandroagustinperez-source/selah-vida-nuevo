import { Link } from 'react-router-dom';

export default function FinalCta() {
  return (
    <section
      className="py-24 text-center px-6"
      style={{
        background: 'linear-gradient(135deg, #1a3a4a 0%, #0e2430 100%)',
      }}
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-[clamp(2rem,4.5vw,3rem)] text-cream mb-3">
          Empezá hoy — Tu alma lo necesita
        </h2>
        <p className="text-cream/65 text-base mb-9 max-w-lg mx-auto">
          No esperes a que el peso sea demasiado. Dios te espera con brazos abiertos.
        </p>
        <Link
          to="/register"
          className="inline-block bg-gold text-white px-12 py-4 rounded-full text-base font-semibold shadow-lg shadow-gold/35 hover:bg-gold-dark hover:-translate-y-0.5 transition-all"
        >
          Quiero empezar gratis
        </Link>
      </div>
    </section>
  );
}
