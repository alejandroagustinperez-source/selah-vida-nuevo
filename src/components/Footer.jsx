import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Selah Vida',
    links: [
      { label: 'Cómo funciona', to: '/#como-funciona', hash: true },
      { label: 'Funciones', to: '/#funciones', hash: true },
      { label: 'Precios', to: '/#precios', hash: true },
      { label: 'Blog', to: '/blog' },
    ],
  },
  {
    title: 'Tu cuenta',
    links: [
      { label: 'Crear cuenta', to: '/register' },
      { label: 'Iniciar sesión', to: '/login' },
      { label: 'Contacto', to: '/contacto' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Términos y condiciones', to: '/terminos' },
      { label: 'Privacidad', to: '/privacy' },
    ],
  },
];

function goToHash(e, to) {
  e.preventDefault();
  const id = to.split('#')[1];
  if (window.location.pathname !== '/') {
    window.location.href = to;
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function Footer() {
  const year = new Date().getFullYear();
  const linkClass = 'text-[15px] text-sv-mist hover:text-white transition-colors';

  return (
    <footer className="bg-sv-night text-sv-sage font-body px-6 pt-14 pb-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto md:px-6 flex flex-col gap-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-3">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2.5">
              <img src="/logo.png" alt="" className="w-8 h-8 object-contain" />
              <span className="font-display text-[22px] text-sv-cream">Selah Vida</span>
            </Link>
            <p className="text-[15px] leading-relaxed max-w-[22em]">
              Un acompañante espiritual cristiano, disponible las 24 horas.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h2 className="text-[15px] font-semibold text-sv-cream">{col.title}</h2>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.hash ? (
                      <a href={l.to} onClick={(e) => goToHash(e, l.to)} className={linkClass}>
                        {l.label}
                      </a>
                    ) : (
                      <Link to={l.to} className={linkClass}>
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
          <p className="text-[15px] leading-relaxed max-w-[46em]">
            Rafael es una inteligencia artificial y no reemplaza la ayuda de un profesional de la salud ni el acompañamiento de tu iglesia. Si estás atravesando una crisis,{' '}
            <Link to="/terminos" className="text-sv-gold-light underline hover:text-white">
              busca la línea de ayuda de tu país
            </Link>
            .
          </p>
          <div className="flex flex-wrap justify-between gap-2 text-sm">
            <p>&copy; {year} Selah Vida. Todos los derechos reservados.</p>
            <p>
              Sitio hecho por{' '}
              <a
                href="https://ap-cm.vercel.app/"
                target="_blank"
                rel="noopener"
                title="Diseño de páginas web en San Luis"
                className="text-sv-mist underline hover:text-white"
              >
                AP Community Manager
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
