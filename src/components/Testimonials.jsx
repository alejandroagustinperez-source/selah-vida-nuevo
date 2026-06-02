export default function Testimonials() {
  const testimonials = [
    {
      text: 'Selah Vida llegó en un momento muy difícil. Rafael me ayudó a poner en palabras lo que sentía y me recordó que Dios nunca me ha dejado.',
      name: 'María Fernanda López',
      city: 'Bogotá, Colombia',
    },
    {
      text: 'Los juegos bíblicos me encantan. He aprendido versículos que nunca había memorizado y ahora leo la Biblia con más ganas.',
      name: 'Carlos Andrés Mendoza',
      city: 'Lima, Perú',
    },
    {
      text: 'La oración guiada me ha dado paz en las noches de insomnio. Poder hablar con Dios sin prisas, paso a paso, es un regalo.',
      name: 'Ana Lucía Castillo',
      city: 'Santiago, Chile',
    },
  ];

  return (
    <section id="caracteristicas" className="py-16 md:py-20 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="font-serif font-bold text-4xl md:text-5xl" style={{ color: '#8B1A1A' }}>V</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mt-2" style={{ color: '#0F3D3D' }}>
            Lo que dicen nuestros usuarios
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="flex flex-col">
              <p className="text-3xl leading-none mb-2" style={{ color: '#C9922A' }}>«</p>
              <p className="text-sm italic leading-relaxed flex-1" style={{ color: '#3D3D3D' }}>{t.text}</p>
              <div className="h-px w-12 my-3" style={{ backgroundColor: '#C9922A' }} />
              <p className="font-bold text-xs" style={{ color: '#0F3D3D' }}>{t.name}</p>
              <p className="text-xs" style={{ color: 'rgba(15,61,61,0.6)' }}>{t.city}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
