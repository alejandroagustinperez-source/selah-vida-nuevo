import { Brain, Flame, Home, Compass, Hand } from 'lucide-react';

export default function Problem() {
  const items = [
    { icon: Brain, text: 'El estrés y la ansiedad te agobian día tras día', iconColor: '#8B2020' },
    { icon: Flame, text: 'Tu vida espiritual se siente fría o estancada', iconColor: '#999999' },
    { icon: Home, text: 'No encuentras un lugar seguro para desahogarte', iconColor: '#8B2020' },
    { icon: Compass, text: 'Necesitas dirección, pero no sabes a quién acudir', iconColor: '#8B2020' },
    { icon: Hand, text: 'La oración se ha vuelto difícil y sientes que no avanzas', iconColor: '#8B2020' },
  ];

  return (
    <section id="problema" className="py-4 md:py-8 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <span className="font-serif font-bold text-4xl md:text-5xl" style={{ color: '#8B1A1A' }}>II</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mt-2" style={{ color: '#0F3D3D' }}>
            Sabemos lo que duele
          </h2>
        </div>

        <div className="max-w-[600px] mx-auto">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx}>
                <div className="flex items-start gap-4" style={{ padding: '10px 0' }}>
                  <Icon size={20} className="shrink-0 mt-0.5" style={{ color: item.iconColor }} strokeWidth={1.5} />
                  <p className="italic leading-relaxed" style={{ color: '#0F3D3D', fontSize: '1.1rem' }}>
                    {item.text}
                  </p>
                </div>
                {idx < items.length - 1 && (
                  <div className="w-full h-px" style={{ backgroundColor: '#E0D5C5' }} />
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center font-semibold italic mt-[60px]" style={{ color: '#C9922A', fontSize: '1.3rem' }}>
          — No estás solo
        </p>
      </div>
    </section>
  );
}
