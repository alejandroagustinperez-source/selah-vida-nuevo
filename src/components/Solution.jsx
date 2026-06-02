import { MessageCircle, Music, BookOpen, Puzzle, Heart } from 'lucide-react';

const iconMap = {
  MessageCircle, Music, BookOpen, Puzzle, Heart,
};

export default function Solution() {
  const features = [
    { icon: 'MessageCircle', title: 'Rafael', subtitle: 'Tu acompañante espiritual con IA', desc: 'Disponible 24/7 para escucharte, aconsejarte y orar contigo en cualquier momento.' },
    { icon: 'Music', title: 'Música cristiana', subtitle: 'Selecciones de alabanza y adoración', desc: 'Reproduce listas y videos de música cristiana que renuevan tu espíritu.' },
    { icon: 'BookOpen', title: 'Juegos Bíblicos', subtitle: 'Aprende la Palabra de forma divertida', desc: 'Pon a prueba tu conocimiento de la Biblia con trivia, versículos y más.' },
    { icon: 'Puzzle', title: 'El Lienzo Sagrado', subtitle: 'Completa piezas de la Última Cena', desc: 'Supera desafíos bíblicos para reconstruir una obra de arte y desbloquear sorpresas.' },
    { icon: 'Heart', title: 'Oración Guiada', subtitle: 'Deja que el Espíritu Santo te guíe', desc: '7 caminos de oración diseñados para ayudarte a conectar con Dios.' },
  ];

  return (
    <section id="solucion" className="py-6 md:py-10 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="font-serif font-bold text-4xl md:text-5xl" style={{ color: '#8B1A1A' }}>III</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mt-2" style={{ color: '#0F3D3D' }}>
            Selah Vida te acompaña
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-0 mx-auto">
          {features.map((f, idx) => {
            const Icon = iconMap[f.icon];
            return (
            <div key={idx}>
              <div className="flex items-start gap-5 py-5 md:py-6">
                <span className="shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center">
                  {Icon && <Icon size={20} color="#C9922A" strokeWidth={1.5} />}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base" style={{ color: '#0F3D3D' }}>{f.title}</h3>
                  <p className="text-xs tracking-[0.1em] font-semibold uppercase mt-0.5" style={{ color: '#C9922A' }}>{f.subtitle}</p>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: '#3D3D3D' }}>{f.desc}</p>
                </div>
              </div>
              {idx < features.length - 1 && (
                <div className="h-px w-full" style={{ backgroundColor: 'rgba(201,146,42,0.2)' }} />
              )}
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
