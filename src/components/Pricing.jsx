import { Link } from 'react-router-dom';

const btnClasses = "block w-full text-center font-serif mt-6 transition-all hover:bg-[#C9922A]";

export default function Pricing() {
  return (
    <section id="precios" className="py-6 md:py-10 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="font-serif font-bold text-4xl md:text-5xl" style={{ color: '#8B1A1A' }}>VI</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mt-2" style={{ color: '#0F3D3D' }}>
            Elige tu camino
          </h2>
          <p className="font-serif text-sm italic mt-2" style={{ color: '#5A6A5A' }}>
            Comenzá gratis. Crecé cuando estés listo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center items-stretch">
          {/* Free */}
          <div
            className="flex flex-col w-full max-w-[380px] relative overflow-hidden"
            style={{ backgroundColor: '#FAF7F2', border: '1.5px solid #C9922A', borderRadius: '8px', padding: '40px 32px' }}
          >
            {/* Gold top accent bar */}
            <div className="absolute top-0 left-0 right-0" style={{ height: '4px', backgroundColor: '#C9922A' }} />
            <span className="text-xs tracking-[0.15em] font-semibold uppercase text-center" style={{ color: '#C9922A' }}>
              GRATIS
            </span>
            <p className="font-serif text-center font-bold mt-3 mb-0" style={{ color: '#0F3D3D', fontSize: '48px' }}>$0</p>
            <p className="text-center text-[13px] mt-1 mb-0" style={{ color: 'rgba(15,61,61,0.5)' }}>Para siempre</p>
            <div className="w-12 h-px mx-auto my-5" style={{ backgroundColor: '#C9922A' }} />
            <ul className="flex-1 space-y-0" style={{ color: '#0F3D3D', fontSize: '15px', lineHeight: '2' }}>
              <li className="flex items-start gap-2">
                <span className="shrink-0" style={{ color: '#C9922A' }}>✓</span>
                <span>Chat con Rafael (20 mensajes/día)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0" style={{ color: '#C9922A' }}>✓</span>
                <span>Versículo del día</span>
              </li>
            </ul>
            <Link
              to="/register"
              className={btnClasses}
              style={{
                backgroundColor: '#0F3D3D',
                color: '#FAF7F2',
                fontSize: '15px',
                letterSpacing: '0.08em',
                padding: '14px',
                borderRadius: '4px',
              }}
            >
              ¡Empezá Ahora!
            </Link>
          </div>

          {/* Premium */}
          <div
            className="rounded-2xl p-8 flex flex-col relative w-full max-w-[380px]"
            style={{ backgroundColor: '#0F3D3D', border: '2px solid #C9922A' }}
          >
            {/* Gold crown accent line */}
            <div className="absolute top-0 left-8 right-8 h-[2px]" style={{ backgroundColor: '#C9922A' }} />

            <span
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs tracking-[0.15em] font-semibold uppercase px-5 py-1 rounded-full whitespace-nowrap"
              style={{ backgroundColor: '#C9922A', color: '#FFFFFF' }}
            >
              Recomendado
            </span>
            <h3 className="font-serif text-xl font-bold text-center" style={{ color: '#FAF7F2' }}>Premium</h3>
            <p className="text-5xl font-bold text-center my-4" style={{ color: '#FAF7F2' }}>
              $4.99
              <span className="text-base font-normal" style={{ color: '#C9922A' }}>/mes</span>
            </p>
            <p className="text-xs text-center mb-6 tracking-[0.05em]" style={{ color: 'rgba(250,247,242,0.7)' }}>
              Para quienes buscan más profundidad
            </p>
            <ul className="space-y-3 text-sm flex-1" style={{ color: '#FAF7F2' }}>
              <li className="flex items-start gap-2">
                <span className="shrink-0" style={{ color: '#C9922A' }}>✓</span>
                <span>Chat con Rafael ilimitado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0" style={{ color: '#C9922A' }}>✓</span>
                <span>Historial de conversaciones guardado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0" style={{ color: '#C9922A' }}>✓</span>
                <span>Juegos bíblicos sin límite diario</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0" style={{ color: '#C9922A' }}>✓</span>
                <span>El Lienzo Sagrado completo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0" style={{ color: '#C9922A' }}>✓</span>
                <span>Oración guiada ilimitada</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0" style={{ color: '#C9922A' }}>✓</span>
                <span>Música cristiana sin interrupciones</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0" style={{ color: '#C9922A' }}>✓</span>
                <span>Nuevos contenidos cada mes</span>
              </li>
            </ul>
            <button
              onClick={() => {
                window.open('https://wa.me/5492665066606?text=Hola%20Alejandro%2C%20quiero%20suscribirme%20a%20Selah%20Vida%20Premium%20%F0%9F%99%8F', '_blank');
                setTimeout(() => { window.open('https://pay.hotmart.com/Q105734847S', '_blank'); }, 200);
              }}
              className="block w-full text-center text-xs tracking-[0.15em] font-semibold uppercase px-8 py-3.5 rounded-full mt-6 transition-all"
              style={{ backgroundColor: '#C9922A', color: '#0F3D3D', border:'none', cursor:'pointer' }}
            >
              Suscribirme ahora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
