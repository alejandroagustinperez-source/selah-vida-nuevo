import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VERSES = [
  { ref: 'SALMO 23:1-2', text: 'Jehová es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará.' },
  { ref: 'FILIPENSES 4:6-7', text: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.' },
  { ref: 'SALMO 34:18', text: 'Cercano está el Señor a los quebrantados de corazón, y salva a los de espíritu abatido.' },
  { ref: '1 PEDRO 5:7', text: 'Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.' },
];

export default function Hero() {
  const [verseIdx, setVerseIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVerseIdx((prev) => (prev + 1) % VERSES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="pt-24 pb-2 md:pb-4 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-4xl mx-auto text-center">
        <p className="italic text-base lg:text-lg mb-4" style={{ color: '#C9922A' }}>
          Tu refugio espiritual &middot; 24/7
        </p>

        <h1 className="font-serif font-bold leading-tight mb-5" style={{ color: '#0F3D3D', fontSize: 'clamp(2rem,6vw,3.8rem)' }}>
          Selah Vida
        </h1>

        <p className="text-base md:text-lg max-w-2xl mx-auto mb-6 leading-relaxed font-medium" style={{ color: '#3D3D3D' }}>
          Una aplicación cristiana impulsada por inteligencia artificial que te escucha, te guía y te ayuda a crecer en tu fe cada día.
        </p>

        <Link
          to="/register"
          className="inline-block border-2 border-[#C9922A] text-[#0F3D3D] px-10 py-3.5 rounded-full text-xs tracking-[0.15em] font-semibold uppercase hover:bg-[#C9922A] hover:text-white transition-all"
        >
          Empezar gratis
        </Link>

        <div className="relative mt-10 h-16 flex items-center justify-center">
          {VERSES.map((v, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 transition-opacity duration-700"
              style={{ opacity: i === verseIdx ? 1 : 0, pointerEvents: i === verseIdx ? 'auto' : 'none' }}
            >
              <p className="text-xs tracking-[0.15em] font-semibold mb-1" style={{ color: '#C9922A' }}>
                {v.ref}
              </p>
              <p className="font-serif text-sm max-w-xl mx-auto leading-relaxed" style={{ color: '#3D3D3D', lineHeight: '1.8' }}>
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
