import { Link } from 'react-router-dom';
import { MessageCircle, Clock, Gamepad2, Puzzle, Heart, Music, Sparkles } from 'lucide-react';

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

        <div className="flex flex-col md:flex-row items-stretch justify-center">
          {/* Explorador */}
          <div
            className="flex flex-col w-full md:max-w-[380px] relative overflow-hidden mb-8 md:mb-0 md:mr-4 transition-shadow duration-300"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #C9922A',
              borderRadius: '8px',
              padding: '40px 32px',
              boxShadow: '0 4px 24px rgba(15,61,61,0.08)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(201,146,42,0.15)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(15,61,61,0.08)' }}
          >
            <div className="absolute top-0 left-0 right-0" style={{ height: '4px', backgroundColor: '#C9922A' }} />
            <span className="text-xs tracking-[0.2em] font-semibold uppercase text-center" style={{ color: '#C9922A' }}>
              Explorador
            </span>
            <p className="font-serif text-center font-bold mt-3 mb-0" style={{ color: '#0F3D3D', fontSize: '48px' }}>$0</p>
            <p className="text-center text-[13px] mt-1 mb-0" style={{ color: 'rgba(15,61,61,0.5)' }}>Para siempre</p>
            <div className="w-12 h-px mx-auto my-5" style={{ backgroundColor: '#C9922A' }} />
            <ul className="flex-1 space-y-0" style={{ color: '#0F3D3D', fontSize: '15px', lineHeight: '2' }}>
              {[
                'Chat con Rafael (20 mensajes/día)',
                'Versículo del día personalizado',
                'Blog con reflexiones bíblicas',
                'Acceso anticipado a nuevas funciones',
                'Sin tarjeta de crédito requerida',
              ].map((text) => (
                <li key={text} className="flex items-start gap-2">
                  <span className="shrink-0" style={{ color: '#C9922A' }}>✦</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="block w-full text-center font-serif mt-6 transition-all hover:bg-[#C9922A]"
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
            <p className="text-center text-xs mt-3" style={{ color: '#2D6A4F' }}>
              ✓ Sin tarjeta de crédito
            </p>
          </div>

          {/* Desktop separator */}
          <div className="hidden md:flex flex-col items-center justify-center shrink-0 self-stretch mx-2">
            <div className="w-px flex-1" style={{ backgroundColor: '#E8E0D0' }} />
            <span className="text-xs my-2 select-none" style={{ color: 'rgba(15,61,61,0.35)' }}>o</span>
            <div className="w-px flex-1" style={{ backgroundColor: '#E8E0D0' }} />
          </div>

          {/* Premium */}
          <div
            className="rounded-2xl p-8 flex flex-col relative w-full md:max-w-[380px] md:ml-4 transition-shadow duration-300"
            style={{
              background: 'linear-gradient(180deg, #1C3D2E, #0A1A10)',
              border: '2px solid #C9922A',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(201,146,42,0.25)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)' }}
          >
            <div className="absolute top-0 left-8 right-8 h-[2px]" style={{ backgroundColor: '#C9922A' }} />

            <span
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs tracking-[0.15em] font-semibold uppercase px-5 py-1 rounded-full whitespace-nowrap"
              style={{ backgroundColor: '#C9922A', color: '#0F3D3D' }}
            >
              ★ Recomendado
            </span>
            <h3 className="font-serif text-xl font-bold text-center" style={{ color: '#FAF7F2' }}>Premium</h3>
            <p className="text-5xl font-bold text-center my-4" style={{ color: '#FAF7F2' }}>
              $4.99
              <span className="text-base font-normal" style={{ color: '#C9922A' }}>/mes</span>
            </p>
            <p className="text-xs text-center italic mb-6" style={{ color: 'rgba(201,146,42,0.8)' }}>
              Menos que un café por semana
            </p>
            <ul className="space-y-3 text-sm flex-1" style={{ color: '#FAF7F2' }}>
              {[
                { icon: MessageCircle, text: 'Chat con Rafael ilimitado' },
                { icon: Clock, text: 'Historial de conversaciones guardado' },
                { icon: Gamepad2, text: 'Juegos bíblicos sin límite diario' },
                { icon: Puzzle, text: 'El Lienzo Sagrado completo' },
                { icon: Heart, text: 'Oración guiada ilimitada' },
                { icon: Music, text: 'Música cristiana sin interrupciones' },
                { icon: Sparkles, text: 'Nuevos contenidos cada mes' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2">
                  <Icon size={16} className="shrink-0 mt-0.5" style={{ color: '#C9922A' }} strokeWidth={1.5} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                window.open('https://wa.me/5492665066606?text=Hola%20Alejandro%2C%20quiero%20suscribirme%20a%20Selah%20Vida%20Premium%20%F0%9F%99%8F', '_blank');
                setTimeout(() => { window.open('https://pay.hotmart.com/Q105734847S', '_blank'); }, 200);
              }}
              className="block w-full text-center text-sm tracking-[0.15em] font-semibold uppercase px-8 py-4 rounded-full mt-6 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #C9922A, #D4A843)',
                color: '#0F3D3D',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,146,42,0.5)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}
            >
              Suscribirme ahora
            </button>
            <p className="text-center text-xs mt-3" style={{ color: 'rgba(250,247,242,0.5)' }}>
              🔒 Pago seguro · Cancelá cuando quieras
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
