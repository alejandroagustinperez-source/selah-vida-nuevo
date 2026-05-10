export default function Pricing() {
  return (
    <section id="precios" className="bg-cream py-24">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-gold text-xs uppercase tracking-[3px] font-semibold mb-2">Planes</p>
        <h2 className="font-serif text-[clamp(2rem,4.5vw,2.8rem)] mb-3">Elige tu camino</h2>
        <p className="text-dark-blue/65 max-w-xl mb-14 text-base">
          Comienza gratis y crece en tu fe. Cuando quieras más, da el siguiente paso.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Free */}
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gold/10 hover:-translate-y-1 hover:shadow-md transition-all">
            <h3 className="font-serif text-xl mb-1">Gratuito</h3>
            <div className="font-serif text-4xl text-dark-blue my-4">
              $0 <small className="text-sm font-sans font-normal text-dark-blue/50">/mes</small>
            </div>
            <ul className="text-left my-6 space-y-2">
              {['Chat con Rafael (20 mensajes/día)', 'Versículos personalizados', 'Oración guiada', 'Música de alabanza'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-dark-blue/75 py-1.5 border-b border-dark-blue/5 last:border-0">
                  <span className="text-gold font-bold">&#10003;</span> {item}
                </li>
              ))}
            </ul>
            <a
              href="https://selah-vida.lovable.app/registro"
              className="inline-block border-2 border-gold text-dark-blue px-10 py-3.5 rounded-full font-semibold text-sm hover:bg-gold hover:text-white transition-all"
            >
              Empezar gratis
            </a>
          </div>

          {/* Premium */}
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm border-2 border-gold shadow-gold/15 relative hover:-translate-y-1 hover:shadow-md transition-all">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white px-4 py-1 rounded-full text-[0.65rem] font-bold tracking-widest">
              MÁS POPULAR
            </span>
            <h3 className="font-serif text-xl mb-1">Premium</h3>
            <div className="font-serif text-4xl text-dark-blue my-4">
              $4.99 <small className="text-sm font-sans font-normal text-dark-blue/50">/mes</small>
            </div>
            <ul className="text-left my-6 space-y-2">
              {[
                'Chat con Rafael ilimitado',
                'Versículos personalizados',
                'Oración guiada + devocionales diarios',
                'Música de alabanza sin anuncios',
                'Juegos de reflexión bíblica',
                'Comunidad de oración',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-dark-blue/75 py-1.5 border-b border-dark-blue/5 last:border-0">
                  <span className="text-gold font-bold">&#10003;</span> {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => window.open('https://selah-vida.hotmart.com/premium', '_blank')}
              className="bg-gold text-white px-10 py-3.5 rounded-full font-semibold text-sm shadow-md shadow-gold/30 hover:bg-gold-dark hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Obtener Premium
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
