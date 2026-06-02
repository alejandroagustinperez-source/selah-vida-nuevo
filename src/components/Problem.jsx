export default function Problem() {
  const items = [
    'El estrés y la ansiedad te agobian día tras día',
    'Tu vida espiritual se siente fría o estancada',
    'No encuentras un lugar seguro para desahogarte',
    'Necesitas dirección, pero no sabes a quién acudir',
    'La oración se ha vuelto difícil y sientes que no avanzas',
  ];

  return (
    <section id="problema" className="py-4 md:py-8 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <span className="font-serif font-bold text-4xl md:text-5xl" style={{ color: '#8B1A1A' }}>II</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mt-2" style={{ color: '#0F3D3D' }}>
            Sabemos lo que duele
          </h2>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1 items-start">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 py-1">
              <span className="font-serif text-lg font-bold shrink-0" style={{ color: '#C9922A' }}>{idx + 1}.</span>
              <p className="text-sm leading-relaxed" style={{ color: '#3D3D3D' }}>{item}</p>
            </div>
          ))}
        </div>

        <p className="text-center font-semibold italic text-sm md:text-base mt-4" style={{ color: '#0F3D3D' }}>
          — No estás solo
        </p>
      </div>
    </section>
  );
}
