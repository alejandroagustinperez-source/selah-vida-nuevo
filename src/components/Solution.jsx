import { useState, useEffect } from 'react';
import { MessageCircle, Music, BookOpen, Puzzle, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

const iconMap = { MessageCircle, Music, BookOpen, Puzzle, Heart };

const features = [
  { icon: 'MessageCircle', title: 'Rafael', subtitle: 'Tu acompañante espiritual con IA', desc: 'Disponible 24/7 para escucharte, aconsejarte y orar contigo en cualquier momento.' },
  { icon: 'Music', title: 'Música cristiana', subtitle: 'Selecciones de alabanza y adoración', desc: 'Reproduce listas y videos de música cristiana que renuevan tu espíritu.' },
  { icon: 'BookOpen', title: 'Juegos Bíblicos', subtitle: 'Aprende la Palabra de forma divertida', desc: 'Pon a prueba tu conocimiento de la Biblia con trivia, versículos y más.' },
  { icon: 'Puzzle', title: 'El Lienzo Sagrado', subtitle: 'Completa piezas de la Última Cena', desc: 'Supera desafíos bíblicos para reconstruir una obra de arte y desbloquear sorpresas.' },
  { icon: 'Heart', title: 'Oración Guiada', subtitle: 'Deja que el Espíritu Santo te guíe', desc: '7 caminos de oración diseñados para ayudarte a conectar con Dios.' },
];

export default function Solution() {
  const [current, setCurrent] = useState(0);
  const [smooth, setSmooth] = useState(true);
  const [visibleCount, setVisibleCount] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(window.innerWidth >= 768 ? 2 : 1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const extended = [...features, features[0]];
  const maxSlide = features.length;

  const goNext = () => {
    if (current === maxSlide) {
      setSmooth(false);
      setCurrent(0);
      requestAnimationFrame(() => requestAnimationFrame(() => setSmooth(true)));
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (current === 0) {
      setSmooth(false);
      setCurrent(maxSlide);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSmooth(true);
          setCurrent(maxSlide - 1);
        });
      });
    } else {
      setCurrent((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const timer = setInterval(goNext, 4000);
    return () => clearInterval(timer);
  });

  return (
    <section id="solucion" className="py-6 md:py-10 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="font-serif font-bold text-4xl md:text-5xl" style={{ color: '#8B1A1A' }}>III</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mt-2" style={{ color: '#0F3D3D' }}>
            Selah Vida te acompaña
          </h2>
        </div>

        <div className="relative">
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 cursor-pointer bg-none border-none hidden md:block"
            style={{ color: '#C9922A' }}
            aria-label="Anterior"
          >
            <ChevronLeft size={28} strokeWidth={1.5} />
          </button>

          <div className="overflow-hidden mx-0 md:mx-10">
            <div
              className="flex"
              style={{
                transform: `translateX(-${current * (100 / visibleCount)}%)`,
                transition: smooth ? 'transform 500ms ease' : 'none',
              }}
            >
              {extended.map((f, idx) => {
                const Icon = iconMap[f.icon];
                return (
                  <div
                    key={idx}
                    className="flex-shrink-0 px-3"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <div
                      className="rounded-lg p-6 md:p-8 transition-shadow duration-300"
                      style={{
                        border: '1px solid rgba(201,146,42,0.25)',
                        backgroundColor: '#FCFAF5',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,146,42,0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <div className="mb-4">
                        {Icon && <Icon size={36} color="#C9922A" strokeWidth={1.5} />}
                      </div>
                      <h3 className="font-bold text-lg" style={{ color: '#0F3D3D' }}>{f.title}</h3>
                      <p className="text-xs tracking-[0.1em] font-semibold uppercase mt-1 mb-2" style={{ color: '#C9922A' }}>{f.subtitle}</p>
                      <p className="text-sm leading-relaxed" style={{ color: '#3D3D3D' }}>{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 cursor-pointer bg-none border-none hidden md:block"
            style={{ color: '#C9922A' }}
            aria-label="Siguiente"
          >
            <ChevronRight size={28} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex justify-center items-center gap-2 mt-6">
          {features.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSmooth(true);
                setCurrent(current === maxSlide && idx === 0 ? 0 : idx);
              }}
              className="w-2.5 h-2.5 rounded-full border-none cursor-pointer p-0 transition-colors duration-300"
              style={{
                backgroundColor: idx === (current === maxSlide ? 0 : current) ? '#C9922A' : 'rgba(201,146,42,0.25)',
              }}
              aria-label={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
