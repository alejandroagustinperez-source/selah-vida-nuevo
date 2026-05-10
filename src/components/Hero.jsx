import { useEffect, useRef } from 'react';

export default function Hero() {
  const doveRef = useRef(null);

  useEffect(() => {
    const el = doveRef.current;
    if (!el) return;
    let start = null;
    const animate = (t) => {
      if (!start) start = t;
      const y = Math.sin((t - start) / 400) * 10;
      el.style.transform = `translateY(${y}px)`;
      raf = requestAnimationFrame(animate);
    };
    let raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center text-center px-6 pt-28 pb-20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(165deg, #FAF6EF 0%, #f0e8d8 40%, #e8dcc8 100%)',
      }}
    >
      <div className="absolute top-[-40%] left-[-20%] w-[80%] h-full bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-15%] w-[60%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(26,58,74,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div ref={doveRef} className="text-5xl mb-4 inline-block">🕊️</div>
        <h1 className="font-serif text-[clamp(2.5rem,7vw,4.2rem)] font-bold text-dark-blue mb-2 tracking-tight">
          Selah <span className="text-gold">Vida</span>
        </h1>
        <p className="text-lg md:text-xl text-dark-blue/75 font-light mb-10">
          Tu refugio espiritual disponible 24/7
        </p>
        <a
          href="https://selah-vida.lovable.app/registro"
          className="inline-block bg-gold text-white px-11 py-4 rounded-full text-base font-semibold shadow-lg shadow-gold/35 hover:bg-gold-dark hover:-translate-y-0.5 transition-all"
        >
          Empezar gratis
        </a>
      </div>
    </section>
  );
}
