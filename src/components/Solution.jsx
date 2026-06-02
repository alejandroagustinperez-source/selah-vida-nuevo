const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Chat con Rafael',
    desc: 'Conversa con nuestro asistente con inteligencia b&iacute;blica entrenado en las Escrituras.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    title: 'Vers&iacute;culos personalizados',
    desc: 'Recibe la Palabra exacta que necesitas seg&uacute;n tu momento y estado de &aacute;nimo.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: 'Oraci&oacute;n guiada',
    desc: 'Deja que el Esp&iacute;ritu te gu&iacute;e con oraciones escritas para cada situaci&oacute;n.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    title: 'M&uacute;sica de alabanza',
    desc: 'Ambienta tu coraz&oacute;n con alabanzas seleccionadas para conectarte con Dios.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 12h4" />
        <path d="M14 12h4" />
        <path d="M10 12h4" />
      </svg>
    ),
    title: 'Juegos b&iacute;blicos',
    desc: 'Aprende y reflexiona con din&aacute;micas interactivas basadas en la Biblia.',
  },
];

export default function Solution() {
  return (
    <section id="solucion" className="py-16 md:py-24 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <span id="caracteristicas" className="block h-0" />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="font-serif text-5xl md:text-6xl font-bold block mb-4" style={{ color: '#8B1A1A' }}>III</span>
          <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold" style={{ color: '#0F3D3D' }}>
            Selah Vida te acompa&ntilde;a
          </h2>
        </div>

        <div className="space-y-0">
          {features.map((f, i) => (
            <div key={f.title}>
              <div className="flex items-start gap-5 py-6 md:py-7">
                <div className="shrink-0 mt-0.5 w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'rgba(201,146,42,0.1)' }}>
                  {f.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-base mb-1" style={{ color: '#0F3D3D' }}>{f.title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#5A6A5A' }}>{f.desc}</p>
                </div>
              </div>
              {i < features.length - 1 && (
                <div className="h-px w-full" style={{ backgroundColor: 'rgba(201,146,42,0.15)' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
