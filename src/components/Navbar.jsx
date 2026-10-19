import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  const showFullNav = isHome || location.pathname.startsWith('/blog') || location.pathname === '/contacto' || location.pathname === '/login' || location.pathname === '/register' || location.pathname.startsWith('/ninos');

  const homeLinks = [
    { href: isHome ? '#como-funciona' : '/#como-funciona', label: 'Cómo funciona' },
    { href: isHome ? '#funciones' : '/#funciones', label: 'Funciones' },
    { href: isHome ? '#precios' : '/#precios', label: 'Precios' },
    { href: '/blog', label: 'Blog' },
    { href: '/contacto', label: 'Contacto' },
  ];

  const navLinks = showFullNav ? homeLinks : [];

  const close = () => setOpen(false);

  const handleAnchorClick = (e, href) => {
    if (href.startsWith('#') && isHome) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
    close();
  };

  const handleNavClick = (href) => {
    if (!isHome && href.startsWith('/#')) {
      sessionStorage.setItem('scrollTo', href.slice(2));
    }
    close();
  };

  const linkClass = 'text-[15px] text-sv-mist hover:text-white transition-colors py-2';

  const renderLink = (l, className) =>
    l.href.startsWith('/') ? (
      <Link key={l.href} to={l.href} onClick={() => handleNavClick(l.href)} className={className}>
        {l.label}
      </Link>
    ) : (
      <a key={l.href} href={l.href} onClick={(e) => handleAnchorClick(e, l.href)} className={className}>
        {l.label}
      </a>
    );

  return (
    <nav aria-label="Principal" className="fixed top-0 left-0 right-0 z-50 bg-sv-teal font-body border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-[72px]">
        <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={close}>
          <img src="/logo.png" alt="" className="w-8 h-8 object-contain" />
          <span className="font-display text-[22px] font-semibold text-sv-cream">Selah Vida</span>
        </Link>

        {/* Escritorio */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((l) => renderLink(l, linkClass))}
          <Link
            to="/login"
            onClick={close}
            className="inline-flex items-center min-h-[44px] px-5 rounded-full border border-white/40 text-sv-cream text-[15px] hover:bg-white/10 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>

        {/* Botón de menú en celular */}
        <button
          className="flex flex-col justify-center gap-1.5 md:hidden w-11 h-11 items-center"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          <span className={`block w-6 h-0.5 rounded bg-sv-cream transition-transform duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-0.5 rounded bg-sv-cream transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 rounded bg-sv-cream transition-transform duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Menú en celular */}
      <div
        className={`fixed top-0 right-0 h-screen w-72 bg-sv-teal shadow-xl flex flex-col gap-2 pt-24 px-8 transition-transform duration-300 md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 60 }}
      >
        {navLinks.map((l) => renderLink(l, 'text-lg text-sv-cream py-3'))}
        {navLinks.length > 0 && <div className="h-px w-full my-3 bg-white/15" />}
        <Link
          to="/login"
          onClick={close}
          className="inline-flex items-center justify-center min-h-[48px] rounded-full border border-white/40 text-sv-cream text-base"
        >
          Iniciar sesión
        </Link>
      </div>

      {open && (
        <div className="fixed inset-0 md:hidden bg-black/40" style={{ zIndex: 55 }} onClick={close} />
      )}
    </nav>
  );
}
