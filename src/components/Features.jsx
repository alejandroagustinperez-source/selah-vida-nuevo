const features = [
  { emoji: '🤖', title: 'IA con sabiduría bíblica', desc: 'Rafael responde con base en las Escrituras, no con opiniones vacías.' },
  { emoji: '📜', title: 'Biblioteca de versículos', desc: 'Miles de pasajes organizados por emoción, tema y libro de la Biblia.' },
  { emoji: '🔥', title: 'Devocionales diarios', desc: 'Cada mañana un mensaje fresco para empezar el día con propósito.' },
  { emoji: '🔒', title: 'Comunidad de oración', desc: 'Comparte peticiones y ora por otros en un entorno seguro y anónimo.' },
];

export default function Features() {
  return (
    <section id="caracteristicas" className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-gold text-xs uppercase tracking-[3px] font-semibold mb-2">Lo que encontrarás</p>
        <h2 className="font-serif text-[clamp(2rem,4.5vw,2.8rem)] mb-3">Funcionalidades principales</h2>
        <p className="text-dark-blue/65 max-w-xl mb-14 text-base">
          Todo lo que necesitas para fortalecer tu vida espiritual en un solo lugar.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-cream rounded-2xl p-9 text-center border border-gold/10 hover:-translate-y-1.5 hover:bg-cream-dark/50 transition-all"
            >
              <div className="text-4xl mb-3">{f.emoji}</div>
              <h4 className="font-semibold text-base mb-1">{f.title}</h4>
              <p className="text-dark-blue/60 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
