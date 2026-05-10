const problems = [
  { icon: '😰', title: 'Estrés', desc: 'El peso del día a día agota tu alma' },
  { icon: '😟', title: 'Ansiedad', desc: 'Preocupaciones que no te dejan dormir' },
  { icon: '💔', title: 'Soledad', desc: 'Aunque haya gente, te sientes vacío' },
  { icon: '👫', title: 'Pareja', desc: 'Conflictos que alejan tu relación' },
  { icon: '💰', title: 'Finanzas', desc: 'La incertidumbre económica te abruma' },
];

export default function Problem() {
  return (
    <section id="problema" className="bg-dark-blue text-cream py-24">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-gold text-xs uppercase tracking-[3px] font-semibold mb-2">¿Te identificas?</p>
        <h2 className="font-serif text-[clamp(2rem,4.5vw,2.8rem)] text-cream mb-3">Sabemos lo que duele</h2>
        <p className="text-cream/65 max-w-xl mb-14 text-base">
          La vida trae cargas que a veces no sabemos cómo llevar. No estás solo.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {problems.map((p) => (
            <div
              key={p.title}
              className="bg-cream/5 border border-cream/10 rounded-2xl p-7 text-center hover:bg-cream/10 hover:-translate-y-1 transition-all"
            >
              <div className="text-3xl mb-2">{p.icon}</div>
              <h4 className="text-cream font-semibold text-base mb-1">{p.title}</h4>
              <p className="text-cream/60 text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
