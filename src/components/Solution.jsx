const solutions = [
  { icon: '💬', title: 'Chat con Rafael', desc: 'Conversa con nuestro asistente con inteligencia bíblica entrenado en las Escrituras.' },
  { icon: '📖', title: 'Versículos personalizados', desc: 'Recibe la Palabra exacta que necesitas según tu momento y estado de ánimo.' },
  { icon: '🙌', title: 'Oración guiada', desc: 'Deja que el Espíritu te guíe con oraciones escritas para cada situación.' },
  { icon: '🎵', title: 'Música de alabanza', desc: 'Ambiente tu corazón con alabanzas seleccionadas para conectarte con Dios.' },
  { icon: '🎮', title: 'Juegos bíblicos', desc: 'Aprende y reflexiona con dinámicas interactivas basadas en la Biblia.' },
];

export default function Solution() {
  return (
    <section id="solucion" className="bg-cream py-24">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-gold text-xs uppercase tracking-[3px] font-semibold mb-2">Respuesta para tu alma</p>
        <h2 className="font-serif text-[clamp(2rem,4.5vw,2.8rem)] mb-3">Selah Vida te acompaña</h2>
        <p className="text-dark-blue/65 max-w-xl mb-14 text-base">
          Una plataforma con inteligencia espiritual para nutrir tu fe en cada momento.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {solutions.map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gold/10 hover:-translate-y-1.5 hover:shadow-md transition-all"
            >
              <div className="text-4xl mb-3">{s.icon}</div>
              <h4 className="font-semibold text-base mb-1">{s.title}</h4>
              <p className="text-dark-blue/60 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
