import { MessageCircle, Heart, BookOpen, Gamepad2, Puzzle, Music } from 'lucide-react';

const features = [
  { icon: MessageCircle, title: 'Conversación con Rafael', text: 'Un espacio para desahogarte, orar y recibir guía bíblica, sin juicios.' },
  { icon: Heart, title: 'Oración guiada', text: 'Siete caminos de oración paso a paso para cuando no encuentras las palabras.' },
  { icon: BookOpen, title: 'Versículo del día', text: 'Una palabra elegida para ti, para empezar cada mañana.' },
  { icon: Gamepad2, title: 'Juegos bíblicos', text: 'Trivia, adivina el versículo, sopa de letras y ¿Quién lo dijo?' },
  { icon: Puzzle, title: 'El Lienzo Sagrado', text: 'Supera desafíos bíblicos para reconstruir, pieza por pieza, la Última Cena.' },
  { icon: Music, title: 'Música de alabanza', text: 'Alabanza y adoración para acompañar tu oración o tu día.' },
];

export default function Solution() {
  return (
    <section id="funciones" className="bg-sv-cream py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto md:px-6 flex flex-col gap-12">
        <h2 className="font-display font-semibold text-sv-teal leading-tight max-w-[18em]" style={{ fontSize: 'clamp(2rem, 3.6vw, 2.75rem)' }}>
          Todo lo que encuentras en Selah Vida
        </h2>
        <div className="grid gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="py-7 border-t-2 border-sv-teal flex flex-col gap-2.5">
              <Icon size={30} strokeWidth={1.5} className="text-sv-teal" aria-hidden="true" />
              <h3 className="font-display text-[22px] font-semibold text-sv-teal">{title}</h3>
              <p className="text-[17px] leading-relaxed text-sv-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
