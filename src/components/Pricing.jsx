import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <section id="precios" className="py-16 md:py-20 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="font-serif font-bold text-4xl md:text-5xl" style={{ color: '#8B1A1A' }}>V</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mt-2" style={{ color: '#0F3D3D' }}>
            Elige tu camino
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <div className="rounded-2xl p-8 flex flex-col" style={{ backgroundColor: '#FAF7F2', border: '1px solid rgba(201,146,42,0.2)' }}>
            <h3 className="font-serif text-xl font-bold text-center" style={{ color: '#0F3D3D' }}>Gratuito</h3>
            <p className="text-3xl font-bold text-center my-4" style={{ color: '#0F3D3D' }}>$0</p>
            <p className="text-xs text-center mb-6 tracking-[0.05em]" style={{ color: 'rgba(15,61,61,0.6)' }}>Siempre gratis</p>
            <ul className="space-y-3 text-sm flex-1" style={{ color: '#3D3D3D' }}>
              <li className="flex items-start gap-2">
                <span className="font-serif font-bold shrink-0" style={{ color: '#C9922A' }}>1.</span>
                <span>Chat con Rafael (mensajes limitados)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-serif font-bold shrink-0" style={{ color: '#C9922A' }}>2.</span>
                <span>Juegos bíblicos (8 partidas/día, 3 niveles)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-serif font-bold shrink-0" style={{ color: '#C9922A' }}>3.</span>
                <span>El Lienzo Sagrado completo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-serif font-bold shrink-0" style={{ color: '#C9922A' }}>4.</span>
                <span>Oración guiada (1 sesión/día)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-serif font-bold shrink-0" style={{ color: '#C9922A' }}>5.</span>
                <span>Música cristiana</span>
              </li>
            </ul>
          </div>

          {/* Premium */}
          <div className="rounded-2xl p-8 flex flex-col relative" style={{ backgroundColor: '#FAF7F2', border: '2px solid #C9922A' }}>
            <span
              className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs tracking-[0.15em] font-semibold uppercase px-5 py-1 rounded-full"
              style={{ backgroundColor: '#C9922A', color: '#FAF7F2' }}
            >
              Recomendado
            </span>
            <h3 className="font-serif text-xl font-bold text-center" style={{ color: '#0F3D3D' }}>Premium</h3>
            <p className="text-3xl font-bold text-center my-4" style={{ color: '#0F3D3D' }}>$4.99<span className="text-base font-normal" style={{ color: 'rgba(15,61,61,0.6)' }}>/mes</span></p>
            <p className="text-xs text-center mb-6 tracking-[0.05em]" style={{ color: 'rgba(15,61,61,0.6)' }}>Para quienes buscan más profundidad</p>
            <ul className="space-y-3 text-sm flex-1" style={{ color: '#3D3D3D' }}>
              <li className="flex items-start gap-2">
                <span className="font-serif font-bold shrink-0" style={{ color: '#C9922A' }}>1.</span>
                <span>Chat con Rafael ilimitado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-serif font-bold shrink-0" style={{ color: '#C9922A' }}>2.</span>
                <span>Historial de conversaciones guardado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-serif font-bold shrink-0" style={{ color: '#C9922A' }}>3.</span>
                <span>Juegos bíblicos sin límite diario</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-serif font-bold shrink-0" style={{ color: '#C9922A' }}>4.</span>
                <span>El Lienzo Sagrado completo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-serif font-bold shrink-0" style={{ color: '#C9922A' }}>5.</span>
                <span>Oración guiada ilimitada</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-serif font-bold shrink-0" style={{ color: '#C9922A' }}>6.</span>
                <span>Música cristiana</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-serif font-bold shrink-0" style={{ color: '#C9922A' }}>7.</span>
                <span>Nuevos contenidos cada mes</span>
              </li>
            </ul>
            <a
              href="https://pay.hotmart.com/U97704875J"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center border-2 border-[#C9922A] text-[#0F3D3D] px-8 py-3.5 rounded-full text-xs tracking-[0.15em] font-semibold uppercase mt-6 hover:bg-[#C9922A] hover:text-white transition-all"
            >
              Suscribirme ahora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
