import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="pt-24 pb-2 md:pb-4 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
        {/* Left verse column */}
        <div className="hidden md:block md:col-span-3">
          <p className="text-xs tracking-[0.15em] font-semibold mb-3" style={{ color: '#C9922A' }}>SALMO 23:1-2</p>
          <p className="font-serif text-sm leading-relaxed" style={{ color: '#3D3D3D', lineHeight: '1.9' }}>
            <span className="align-super text-[0.6rem]" style={{ color: '#C9922A' }}>1 </span>Jehová es mi pastor; nada me faltará.<br />
            <span className="align-super text-[0.6rem]" style={{ color: '#C9922A' }}>2 </span>En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará.
          </p>
        </div>

        {/* Center column */}
        <div className="md:col-span-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="font-serif font-bold leading-none" style={{ color: '#8B1A1A', fontSize: 'clamp(3rem,8vw,5rem)' }}>I</span>
            <h1 className="font-serif font-bold leading-tight" style={{ color: '#0F3D3D', fontSize: 'clamp(2rem,6vw,3.8rem)' }}>
              Selah Vida
            </h1>
          </div>
          <p className="italic text-base lg:text-lg mb-5" style={{ color: '#C9922A' }}>
            Tu refugio espiritual &middot; 24/7
          </p>
          <p className="text-sm md:text-base max-w-lg mx-auto mb-6 leading-relaxed" style={{ color: '#3D3D3D' }}>
            Una aplicación cristiana impulsada por inteligencia artificial que te escucha, te guía y te ayuda a crecer en tu fe cada día.
          </p>
          <Link
            to="/register"
            className="inline-block border-2 border-[#C9922A] text-[#0F3D3D] px-10 py-3.5 rounded-full text-xs tracking-[0.15em] font-semibold uppercase hover:bg-[#C9922A] hover:text-white transition-all"
          >
            Empezar gratis
          </Link>
        </div>

        {/* Right verse column */}
        <div className="hidden md:block md:col-span-3">
          <p className="text-xs tracking-[0.15em] font-semibold mb-3" style={{ color: '#C9922A' }}>FILIPENSES 4:6-7</p>
          <p className="font-serif text-sm leading-relaxed" style={{ color: '#3D3D3D', lineHeight: '1.9' }}>
            <span className="align-super text-[0.6rem]" style={{ color: '#C9922A' }}>6 </span>Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.<br />
            <span className="align-super text-[0.6rem]" style={{ color: '#C9922A' }}>7 </span>Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.
          </p>
        </div>
      </div>
    </section>
  );
}
