const problems = [
  { title: 'Estr&eacute;s', desc: 'El peso del d&iacute;a a d&iacute;a agota tu alma y no encuentras descanso.' },
  { title: 'Ansiedad', desc: 'Preocupaciones que no te dejan dormir y nublan tu mente.' },
  { title: 'Soledad', desc: 'Aunque haya gente a tu alrededor, te sientes vac&iacute;o por dentro.' },
  { title: 'Conflictos', desc: 'Dificultades en tus relaciones que alejan la paz de tu hogar.' },
  { title: 'Incertidumbre', desc: 'El futuro es incierto y la ansiedad econ&oacute;mica te abruma.' },
];

export default function Problem() {
  return (
    <section id="problema" className="py-16 md:py-24 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="font-serif text-5xl md:text-6xl font-bold block mb-4" style={{ color: '#8B1A1A' }}>II</span>
          <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold" style={{ color: '#0F3D3D' }}>
            Sabemos lo que duele
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-3xl mx-auto">
          {problems.map((p, i) => (
            <div key={p.title} className="flex items-start gap-4">
              <span className="font-serif text-2xl font-bold shrink-0 mt-0.5" style={{ color: '#C9922A' }}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h4 className="font-semibold text-base mb-1" style={{ color: '#0F3D3D' }}>{p.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#5A6A5A' }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14 md:mt-18 max-w-2xl mx-auto">
          <p className="text-sm md:text-base italic leading-relaxed" style={{ color: '#5A6A5A' }}>
            No est&aacute;s solo. En Selah Vida entendemos tus luchas porque tambi&eacute;n caminamos contigo.
          </p>
        </div>
      </div>
    </section>
  );
}
