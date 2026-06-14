export default function Testimonials() {
  const testimonials = [
    {
      text: 'Selah Vida llegó en un momento muy difícil. Rafael me ayudó a poner en palabras lo que sentía y me recordó que Dios nunca me ha dejado.',
      name: 'María Fernanda López',
      city: 'Bogotá, Colombia',
      initials: 'MF',
    },
    {
      text: 'Los juegos bíblicos me encantan. He aprendido versículos que nunca había memorizado y ahora leo la Biblia con más ganas.',
      name: 'Carlos Andrés Mendoza',
      city: 'Lima, Perú',
      initials: 'CA',
    },
    {
      text: 'La oración guiada me ha dado paz en las noches de insomnio. Poder hablar con Dios sin prisas, paso a paso, es un regalo.',
      name: 'Ana Lucía Castillo',
      city: 'Santiago, Chile',
      initials: 'AL',
    },
  ];

  return (
    <section id="testimonios" className="py-6 md:py-10 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="font-serif font-bold text-4xl md:text-5xl" style={{ color: '#8B1A1A' }}>IV</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mt-2" style={{ color: '#0F3D3D' }}>
            Lo que dicen nuestros usuarios
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center transition-shadow duration-300"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(201,146,42,0.2)',
                borderRadius: '12px',
                padding: '28px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(201,146,42,0.15)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)' }}
            >
              {/* Avatar */}
              <div
                className="flex items-center justify-center mb-3"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#1C3D2E',
                }}
              >
                <span style={{ color: '#C9922A', fontWeight: 700, fontSize: '1rem' }}>
                  {t.initials}
                </span>
              </div>

              {/* Stars */}
              <div className="mb-3" style={{ color: '#C9922A', fontSize: '0.9rem', letterSpacing: '2px' }}>
                ★★★★★
              </div>

              {/* Text */}
              <p className="text-sm italic leading-relaxed flex-1" style={{ color: '#3D3D3D' }}>
                <span style={{ color: '#C9922A' }}>"</span>
                {t.text}
              </p>

              {/* Divider */}
              <div className="h-px w-12 my-3" style={{ backgroundColor: '#C9922A' }} />

              {/* Name & City */}
              <p className="font-bold text-xs" style={{ color: '#0F3D3D' }}>{t.name}</p>
              <p className="text-xs" style={{ color: 'rgba(15,61,61,0.6)' }}>{t.city}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
