const steps = [
  {
    title: 'Cuéntale cómo estás',
    text: 'Escribe con tus palabras, como le hablarías a un amigo. Si no sabes por dónde empezar, elige cómo te sientes hoy.',
  },
  {
    title: 'Rafael te responde con la Biblia',
    text: 'Te escucha, te hace preguntas y te comparte versículos que hablan de lo que estás viviendo.',
  },
  {
    title: 'Vuelve cuando lo necesites',
    text: 'Está disponible las 24 horas, también a las tres de la mañana, cuando nadie más está despierto.',
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-sv-parchment py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto md:px-6 flex flex-col gap-12 md:gap-14">
        <h2 className="font-display font-semibold text-sv-teal leading-tight" style={{ fontSize: 'clamp(2rem, 3.6vw, 2.75rem)' }}>
          Cómo funciona
        </h2>
        <ol className="grid gap-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-3">
              <span aria-hidden="true" className="font-display text-[56px] leading-none text-sv-gold-text">
                {i + 1}
              </span>
              <h3 className="font-display text-2xl font-semibold text-sv-teal">{s.title}</h3>
              <p className="text-[17px] leading-relaxed text-sv-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
