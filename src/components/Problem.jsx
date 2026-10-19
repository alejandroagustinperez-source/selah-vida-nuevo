const items = [
  'El estrés y la ansiedad te agobian día tras día.',
  'Tu vida espiritual se siente fría o estancada.',
  'No encuentras un lugar seguro para desahogarte.',
  'Necesitas dirección, pero no sabes a quién acudir.',
  'La oración se ha vuelto difícil y sientes que no avanzas.',
];

export default function Problem() {
  return (
    <section id="problema" className="bg-sv-cream py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto md:px-6 flex flex-wrap gap-12 md:gap-14 items-start">
        <div className="flex-[1_1_320px] min-w-0 flex flex-col gap-4">
          <h2 className="font-display font-semibold text-sv-teal leading-tight" style={{ fontSize: 'clamp(2rem, 3.6vw, 2.75rem)' }}>
            Sabemos lo que duele
          </h2>
          <p className="text-sv-muted text-[17px] leading-relaxed max-w-[26em]">
            Muchas personas cargan esto en silencio, sin un lugar donde decirlo en voz alta. No estás solo.
          </p>
        </div>
        <ul className="flex-[1.4_1_460px] min-w-0 border-b border-sv-line">
          {items.map((text) => (
            <li
              key={text}
              className="py-5 border-t border-sv-line font-display text-xl md:text-[23px] leading-snug text-sv-ink"
            >
              {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
