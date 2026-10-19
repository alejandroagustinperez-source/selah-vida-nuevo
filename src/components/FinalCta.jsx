import { Link } from 'react-router-dom';

export default function FinalCta() {
  return (
    <section className="bg-sv-night text-sv-cream py-20 md:py-28 px-6">
      <div className="max-w-[760px] mx-auto flex flex-col items-center gap-6 text-center">
        <h2 className="font-display font-semibold leading-tight" style={{ fontSize: 'clamp(2.125rem, 4.2vw, 3.25rem)' }}>
          Tómate una pausa hoy.
        </h2>
        <p className="text-lg md:text-[19px] text-sv-mist">Rafael está disponible ahora para escucharte.</p>
        <Link
          to="/register"
          className="inline-flex items-center min-h-[56px] px-8 rounded-full bg-sv-gold hover:bg-sv-gold-hover text-sv-night font-semibold text-lg transition-colors"
        >
          Hablar con Rafael gratis
        </Link>
      </div>
    </section>
  );
}
