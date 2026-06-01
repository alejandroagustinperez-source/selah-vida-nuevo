const testimonials = [
  {
    name: 'Mar&iacute;a G.',
    location: 'Ciudad de M&eacute;xico, M&eacute;xico',
    text: 'Estaba pasando por un divorcio muy doloroso y no sab&iacute;a a qui&eacute;n acudir a las 2 de la ma&ntilde;ana. Rafael estuvo ah&iacute;, me escuch&oacute; y me llev&oacute; a la Palabra. Hoy tengo paz en mi coraz&oacute;n.',
  },
  {
    name: 'Carlos R.',
    location: 'Bogot&aacute;, Colombia',
    text: 'Los juegos b&iacute;blicos me ayudaron a conocer la Biblia de una forma que nunca imagin&eacute;. Mis hijos tambi&eacute;n los usan y ahora tenemos devocionales en familia.',
  },
  {
    name: 'Ana L.',
    location: 'Lima, Per&uacute;',
    text: 'La oraci&oacute;n guiada me cambi&oacute; la vida. Nunca supe c&oacute;mo orar bien, pero Rafael me gu&iacute;a paso a paso. Siento que Dios me escucha como nunca antes.',
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="font-serif text-5xl md:text-6xl font-bold block mb-4" style={{ color: '#8B1A1A' }}>IV</span>
          <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold" style={{ color: '#0F3D3D' }}>
            Lo que dicen nuestros usuarios
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {testimonials.map((t, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl md:text-6xl font-serif italic leading-none mb-4 select-none" style={{ color: '#C9922A' }}>&ldquo;</div>
              <p className="font-serif italic text-sm md:text-base leading-relaxed mb-6" style={{ color: '#5A6A5A' }}>
                {t.text}
              </p>
              <p className="font-semibold text-sm" style={{ color: '#0F3D3D' }}>{t.name}</p>
              <p className="text-xs mt-1" style={{ color: '#5A6A5A' }}>{t.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
