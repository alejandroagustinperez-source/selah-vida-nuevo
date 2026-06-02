import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="min-h-[85vh] flex items-center justify-center pt-24 pb-16 md:pb-20 px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(165deg, #FAF7F2 0%, #f5efe4 50%, #efe6d6 100%)' }}
    >
      <div className="absolute top-[-30%] left-[-15%] w-[70%] h-full bg-[radial-gradient(ellipse_at_center,rgba(201,146,42,0.07)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
        {/* Left verse — hidden on mobile */}
        <div className="hidden md:block text-right">
          <p className="font-serif text-sm lg:text-base italic leading-relaxed" style={{ color: '#5A6A5A', lineHeight: '1.8' }}>
            &laquo;El Se&ntilde;or es mi pastor;<br />
            nada me falta.<br />
            En verdes pastos me hace descansar,<br />
            junto a tranquilas aguas me conduce.&raquo;
          </p>
          <p className="text-xs mt-3 tracking-wider" style={{ color: '#C9922A' }}>SALMOS 23:1-2</p>
        </div>

        {/* Center */}
        <div className="text-center">
          <div className="text-7xl md:text-8xl lg:text-9xl font-serif font-bold leading-none mb-4 select-none" style={{ color: '#8B1A1A' }}>I</div>
          <h1 className="font-serif text-[clamp(2rem,6vw,3.5rem)] font-bold leading-tight mb-3" style={{ color: '#0F3D3D' }}>
            Selah Vida
          </h1>
          <p className="italic text-base lg:text-lg mb-6" style={{ color: '#C9922A' }}>
            Tu refugio espiritual &middot; 24/7
          </p>
          <p className="text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed" style={{ color: '#5A6A5A' }}>
            Un espacio seguro para fortalecer tu fe, encontrar paz y crecer espiritualmente con acompa&ntilde;amiento b&iacute;blico personalizado.
          </p>
          <Link
            to="/register"
            className="inline-block border-2 border-[#C9922A] text-[#0F3D3D] px-10 py-3.5 rounded-full text-xs tracking-[2px] font-semibold uppercase hover:bg-[#C9922A] hover:text-white transition-all"
          >
            Empezar gratis
          </Link>
        </div>

        {/* Right verse — hidden on mobile */}
        <div className="hidden md:block text-left">
          <p className="font-serif text-sm lg:text-base italic leading-relaxed" style={{ color: '#5A6A5A', lineHeight: '1.8' }}>
            &laquo;No se angustien por nada,<br />
            sino pres&eacute;ntenle a Dios<br />
            todas sus peticiones mediante<br />
            la oraci&oacute;n y la s&uacute;plica,<br />
            con acciones de gracias.&raquo;
          </p>
          <p className="text-xs mt-3 tracking-wider" style={{ color: '#C9922A' }}>FILIPENSES 4:6-7</p>
        </div>
      </div>
    </section>
  );
}
