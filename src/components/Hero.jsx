import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-sv-teal text-sv-cream pt-[72px]">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 flex flex-wrap items-center gap-14 lg:gap-16">
        <div className="flex-[1_1_440px] min-w-0 flex flex-col gap-7">
          <h1
            className="font-display font-semibold text-sv-cream leading-[1.08] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(2.5rem, 5.2vw, 4rem)' }}
          >
            Cuando no sabes con quién hablar, Rafael te escucha.
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-sv-mist max-w-[34em]">
            Selah Vida es un acompañante espiritual cristiano con inteligencia artificial. Le cuentas lo que te pasa, a cualquier hora, y te responde con calma y con la Palabra.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              to="/register"
              className="inline-flex items-center min-h-[56px] px-8 rounded-full bg-sv-gold hover:bg-sv-gold-hover text-sv-night font-semibold text-lg transition-colors"
            >
              Hablar con Rafael gratis
            </Link>
            <a href="#como-funciona" className="text-sv-gold-light font-medium hover:text-white transition-colors">
              Ver cómo funciona
            </a>
          </div>
          <p className="text-[15px] text-sv-sage">Empiezas gratis, sin tarjeta. Disponible las 24 horas.</p>
        </div>

        <div className="flex-[1_1_380px] min-w-0 max-w-[480px] mx-auto bg-sv-cream text-sv-ink rounded-[28px] p-6 md:p-7 flex flex-col gap-4 shadow-[0_30px_60px_rgba(5,25,25,0.45)]">
          <div className="flex items-center gap-3.5 pb-4 border-b border-sv-line">
            <img src="/rafael-avatar.png" alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
            <div className="flex flex-col">
              <span className="font-display text-xl font-semibold text-sv-teal">Rafael</span>
              <span className="text-sm text-sv-muted">Ejemplo de conversación</span>
            </div>
          </div>
          <p className="self-end max-w-[85%] bg-sv-teal text-sv-cream rounded-[20px_20px_6px_20px] px-[18px] py-3.5 text-base leading-normal">
            Hace semanas que duermo mal. Me preocupa todo y ni siquiera sé cómo orar.
          </p>
          <div className="self-start max-w-[92%] bg-sv-parchment rounded-[20px_20px_20px_6px] px-[18px] py-4 text-base leading-relaxed flex flex-col gap-2.5">
            <p>Gracias por contármelo. Cuando la mente no se calla, orar puede sentirse imposible, y eso no te hace menos creyente.</p>
            <p className="font-display italic text-lg text-sv-teal">
              «Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios.» Filipenses 4:6
            </p>
            <p>¿Quieres que convirtamos lo que te preocupa en una oración corta, juntos?</p>
          </div>
          <Link
            to="/register"
            className="mt-1 flex items-center gap-3 min-h-[48px] rounded-full border border-[#D8CDB8] bg-white pl-5 pr-1.5 text-sv-muted hover:border-sv-teal transition-colors"
          >
            <span className="flex-1">Escribe lo que sientes</span>
            <span className="w-10 h-10 rounded-full bg-sv-teal text-sv-cream flex items-center justify-center" aria-hidden="true">
              <ArrowRight size={18} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
