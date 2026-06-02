import { Link } from 'react-router-dom';

export default function Footer() {
  const year = 2024;

  return (
    <footer className="px-6 py-14 md:py-16" style={{ backgroundColor: '#0F2E2E' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand column — left aligned */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="font-serif text-lg font-bold" style={{ color: '#FAF7F2' }}>Selah Vida</span>
            </div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(250,247,242,0.6)' }}>
              Tu refugio espiritual con inteligencia artificial, disponible 24/7 para acompañarte en tu fe.
            </p>
            <div className="flex items-center gap-3">
              <div className="h-px w-8" style={{ backgroundColor: '#C9922A' }} />
              <span className="text-sm select-none" style={{ color: '#C9922A' }}>◆</span>
              <div className="h-px w-8" style={{ backgroundColor: '#C9922A' }} />
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="font-bold text-xs tracking-[0.15em] uppercase mb-4" style={{ color: '#C9922A' }}>Navegación</h4>
            <ul className="space-y-2">
              {[
                { label: 'Inicio', to: '/' },
                { label: 'Iniciar sesión', to: '/login' },
                { label: 'Crear cuenta', to: '/register' },
                { label: 'Términos y condiciones', to: '/terminos' },
                { label: 'Privacidad', to: '/privacidad' },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-xs hover:underline" style={{ color: 'rgba(250,247,242,0.7)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="font-bold text-xs tracking-[0.15em] uppercase mb-4" style={{ color: '#C9922A' }}>Recursos</h4>
            <ul className="space-y-2">
              {[
                { label: 'Características', to: '/#caracteristicas' },
                { label: 'Precios', to: '/#precios' },
                { label: 'Contacto', to: '/contacto' },
                { label: 'Ayuda', to: '/contacto' },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-xs hover:underline" style={{ color: 'rgba(250,247,242,0.7)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Descarga la App */}
          <div>
            <h4 className="font-bold text-xs tracking-[0.15em] uppercase mb-4" style={{ color: '#C9922A' }}>Descarga la App</h4>
            <ul className="space-y-3">
              {[
                { label: 'App Store (Próximamente)', disabled: true },
                { label: 'Google Play (Próximamente)', disabled: true },
              ].map((l) => (
                <li key={l.label}>
                  <span
                    className="inline-block text-xs px-4 py-2 rounded-lg opacity-50 cursor-not-allowed"
                    style={{ backgroundColor: 'rgba(250,247,242,0.05)', color: 'rgba(250,247,242,0.5)' }}
                  >
                    {l.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center mt-10 pt-6" style={{ borderTop: '1px solid rgba(250,247,242,0.08)' }}>
          <p className="text-xs" style={{ color: 'rgba(250,247,242,0.4)' }}>
            &copy; {year} Selah Vida. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
