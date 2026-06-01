import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <section id="precios" className="py-16 md:py-24 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 md:mb-14">
          <span className="font-serif text-5xl md:text-6xl font-bold block mb-4" style={{ color: '#8B1A1A' }}>V</span>
          <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold mb-3" style={{ color: '#0F3D3D' }}>
            Elige tu camino
          </h2>
          <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: '#5A6A5A' }}>
            Comienza gratis y crece en tu fe. Cuando quieras m&aacute;s, da el siguiente paso.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Free */}
          <div className="p-8 md:p-10 text-center" style={{ backgroundColor: '#FAF7F2' }}>
            <h3 className="font-serif text-xl font-bold mb-3" style={{ color: '#0F3D3D' }}>Gratuito</h3>
            <div className="font-serif text-4xl mb-2" style={{ color: '#0F3D3D' }}>
              $0 <small className="text-sm font-sans font-normal" style={{ color: '#5A6A5A' }}>/mes</small>
            </div>
            <p className="text-xs mb-6" style={{ color: '#5A6A5A' }}>Para empezar tu camino espiritual</p>
            <ul className="text-left mb-8 space-y-3">
              {[
                'Chat con Rafael (20 mensajes/d&iacute;a)',
                'Vers&iacute;culos personalizados',
                'Oraci&oacute;n guiada',
                'M&uacute;sica de alabanza',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#5A6A5A' }}>
                  <span className="font-bold shrink-0" style={{ color: '#C9922A' }}>&#10003;</span>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="inline-block border-2 border-[#C9922A] text-[#0F3D3D] px-10 py-3 rounded-full text-xs tracking-[2px] font-semibold uppercase hover:bg-[#C9922A] hover:text-white transition-all"
            >
              Empezar gratis
            </Link>
          </div>

          {/* Premium */}
          <div className="p-8 md:p-10 text-center relative bg-white border-2 shadow-lg" style={{ borderColor: '#C9922A' }}>
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-white px-4 py-1 rounded-full text-[0.6rem] font-bold tracking-[2px]" style={{ backgroundColor: '#C9922A' }}>
              M&Aacute;S POPULAR
            </span>
            <h3 className="font-serif text-xl font-bold mb-3" style={{ color: '#0F3D3D' }}>Premium</h3>
            <div className="font-serif text-4xl mb-2" style={{ color: '#0F3D3D' }}>
              $4.99 <small className="text-sm font-sans font-normal" style={{ color: '#5A6A5A' }}>/mes</small>
            </div>
            <p className="text-xs mb-6" style={{ color: '#5A6A5A' }}>Para quienes buscan m&aacute;s profundidad</p>
            <ul className="text-left mb-8 space-y-3">
              {[
                'Chat con Rafael ilimitado',
                'Vers&iacute;culos personalizados',
                'Oraci&oacute;n guiada + devocionales diarios',
                'M&uacute;sica de alabanza sin anuncios',
                'Juegos de reflexi&oacute;n b&iacute;blica',
                'Comunidad de oraci&oacute;n',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#5A6A5A' }}>
                  <span className="font-bold shrink-0" style={{ color: '#C9922A' }}>&#10003;</span>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
            <button
              onClick={() => window.open('https://pay.hotmart.com/Q105734847S', '_blank')}
              className="w-full text-white px-10 py-3 rounded-full text-xs tracking-[2px] font-semibold uppercase hover:opacity-90 transition-all cursor-pointer"
              style={{ backgroundColor: '#C9922A' }}
            >
              Obtener Premium
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
