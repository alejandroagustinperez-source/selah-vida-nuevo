const testimonials = [
  {
    name: 'María González',
    location: 'Ciudad de México, México',
    text: 'Estaba pasando por un divorcio muy doloroso y no sabía a quién acudir a las 2 de la mañana. Rafael estuvo ahí, me escuchó y me llevó a la Palabra. Hoy tengo paz en mi corazón.',
    stars: 5,
  },
  {
    name: 'Carlos Herrera',
    location: 'Bogotá, Colombia',
    text: 'Los juegos bíblicos me ayudaron a conocer la Biblia de una forma que nunca imaginé. Mis hijos también los usan y ahora tenemos devocionales en familia.',
    stars: 5,
  },
  {
    name: 'Ana Lucia Pérez',
    location: 'Lima, Perú',
    text: 'La oración guiada me cambió la vida. Nunca supe cómo orar bien, pero Rafael me guía paso a paso. Siento que Dios me escucha como nunca antes.',
    stars: 5,
  },
  {
    name: 'Pastor Roberto Díaz',
    location: 'Buenos Aires, Argentina',
    text: 'Recomiendo Selah Vida a toda mi congregación. Es una herramienta seria, bíblica y disponible las 24 horas. Rafael complementa perfectamente el trabajo pastoral.',
    stars: 5,
  },
  {
    name: 'Sofía Ramírez',
    location: 'Santiago, Chile',
    text: 'La música de alabanza que descubrí aquí transformó mis mañanas. Empiezo cada día adorando a Dios y mi ansiedad desapareció casi por completo.',
    stars: 5,
  },
  {
    name: 'Javier Morales',
    location: 'Guadalajara, México',
    text: 'Llevaba años alejado de Dios. Un amigo me recomendó Selah Vida y Rafael me ayudó a volver a la fe sin juicios, con amor y con la Biblia como base.',
    stars: 5,
  },
];

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);
}

function Stars({ count }) {
  return (
    <span className="text-gold text-sm tracking-wider">
      {'⭐'.repeat(count)}
    </span>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-cream/80 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center text-dark-blue mb-2">
          Lo que dicen nuestros usuarios
        </h2>
        <p className="text-sm text-dark-blue/50 text-center mb-10 sm:mb-14 max-w-md mx-auto">
          Personas como vos ya están experimentando una nueva forma de conectar con Dios.
        </p>

        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-gold/10 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-gold/15 text-gold font-semibold text-sm flex items-center justify-center shrink-0">
                  {initials(t.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-dark-blue truncate">{t.name}</p>
                  <p className="text-xs text-dark-blue/40 truncate">{t.location}</p>
                </div>
              </div>
              <p className="text-sm text-dark-blue/70 leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
              <Stars count={t.stars} />
            </div>
          ))}
        </div>

        {/* Mobile: horizontal carousel */}
        <div className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
          <div className="flex gap-4 pb-2">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="snap-center shrink-0 w-[85vw] max-w-sm bg-white rounded-2xl shadow-sm border border-gold/10 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gold/15 text-gold font-semibold text-sm flex items-center justify-center shrink-0">
                    {initials(t.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-dark-blue truncate">{t.name}</p>
                    <p className="text-xs text-dark-blue/40 truncate">{t.location}</p>
                  </div>
                </div>
                <p className="text-sm text-dark-blue/70 leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
                <Stars count={t.stars} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}