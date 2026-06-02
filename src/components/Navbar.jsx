import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const homeLinks = [
    { href: '#problema', label: 'Problema' },
    { href: '#solucion', label: 'Solución' },
    { href: '#caracteristicas', label: 'Características' },
    { href: '#precios', label: 'Precios' },
  ];

  const close = () => setOpen(false);

  const handleAnchorClick = (e, href) => {
    if (isHome && href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      close();
    } else if (href.startsWith('#')) {
      close();
    } else {
      close();
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-sm' : ''
      }`}
      style={{ backgroundColor: scrolled ? 'rgba(250,247,242,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(8px)' : 'none' }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16 md:h-18">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="Selah Vida" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
          <span className="font-serif text-lg font-bold" style={{ color: '#0F3D3D' }}>Selah Vida</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0">
          {isHome && homeLinks.map((l, i) => (
            <span key={l.href} className="flex items-center">
              <a
                href={l.href}
                onClick={(e) => handleAnchorClick(e, l.href)}
                className="text-xs tracking-[2px] font-semibold uppercase px-3 py-2 hover:opacity-70 transition-opacity"
                style={{ color: '#0F3D3D' }}
              >
                {l.label}
              </a>
              {i < homeLinks.length - 1 && (
                <span className="text-xs select-none" style={{ color: '#C9922A' }}>&middot;</span>
              )}
            </span>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link
              to="/chat"
              onClick={close}
              className="text-xs tracking-[2px] font-semibold uppercase px-5 py-2.5 rounded-full transition-all"
              style={{ backgroundColor: '#C9922A', color: '#fff' }}
            >
              Ir al Chat
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                onClick={close}
                className="text-xs tracking-[2px] font-semibold uppercase hover:opacity-70 transition-opacity"
                style={{ color: '#0F3D3D' }}
              >
                Iniciar sesi&oacute;n
              </Link>
              <Link
                to="/register"
                onClick={close}
                className="text-xs tracking-[2px] font-semibold uppercase px-5 py-2.5 rounded-full transition-all"
                style={{ backgroundColor: '#C9922A', color: '#fff' }}
              >
                Empezar gratis
              </Link>
            </>
          )}

          <Link
            to="/contacto"
            onClick={close}
            className="text-xs tracking-[2px] font-semibold uppercase hover:opacity-70 transition-opacity ml-3"
            style={{ color: 'rgba(15,61,61,0.5)' }}
          >
            Contacto
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden bg-none border-none cursor-pointer p-1"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          <span className={`block w-6 h-0.5 rounded transition-transform duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} style={{ backgroundColor: '#0F3D3D' }} />
          <span className={`block w-6 h-0.5 rounded transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} style={{ backgroundColor: '#0F3D3D' }} />
          <span className={`block w-6 h-0.5 rounded transition-transform duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} style={{ backgroundColor: '#0F3D3D' }} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-72 shadow-xl flex flex-col gap-5 pt-24 px-8 transition-transform duration-300 md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: '#FAF7F2', zIndex: 60 }}
      >
        {isHome && homeLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={(e) => handleAnchorClick(e, l.href)}
            className="text-sm tracking-[2px] font-semibold uppercase py-2"
            style={{ color: '#0F3D3D' }}
          >
            {l.label}
          </a>
        ))}

        <div className="h-px w-full my-2" style={{ backgroundColor: 'rgba(201,146,42,0.2)' }} />

        {user ? (
          <Link
            to="/chat"
            onClick={close}
            className="text-center text-sm tracking-[2px] font-semibold uppercase py-3 rounded-full"
            style={{ backgroundColor: '#C9922A', color: '#fff' }}
          >
            Ir al Chat
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              onClick={close}
              className="text-sm tracking-[2px] font-semibold uppercase py-2"
              style={{ color: '#0F3D3D' }}
            >
              Iniciar sesi&oacute;n
            </Link>
            <Link
              to="/register"
              onClick={close}
              className="text-center text-sm tracking-[2px] font-semibold uppercase py-3 rounded-full"
              style={{ backgroundColor: '#C9922A', color: '#fff' }}
            >
              Empezar gratis
            </Link>
          </>
        )}

        <Link
          to="/contacto"
          onClick={close}
          className="text-sm tracking-[2px] font-semibold uppercase py-2"
          style={{ color: 'rgba(15,61,61,0.6)' }}
        >
          Contacto
        </Link>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 md:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 55 }}
          onClick={close}
        />
      )}
    </nav>
  );
}
