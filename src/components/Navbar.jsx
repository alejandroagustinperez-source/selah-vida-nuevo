import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === '/';

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
    } else {
      close();
    }
  };

  const navLinks = isHome
    ? homeLinks
    : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white" style={{ borderBottom: '1px solid rgba(201,146,42,0.2)' }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="font-serif text-lg font-bold" style={{ color: '#0F3D3D' }}>Selah Vida</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0">
          {navLinks.map((l, i) => (
            <span key={l.href} className="flex items-center">
              <a
                href={l.href}
                onClick={(e) => handleAnchorClick(e, l.href)}
                className="text-xs tracking-[0.15em] font-semibold uppercase px-3 py-2 hover:opacity-70 transition-opacity"
                style={{ color: '#0F3D3D' }}
              >
                {l.label}
              </a>
              {i < navLinks.length - 1 && (
                <span className="text-xs select-none" style={{ color: 'rgba(201,146,42,0.5)' }}>|</span>
              )}
            </span>
          ))}
          {isHome && (
            <span className="flex items-center">
              <span className="text-xs select-none" style={{ color: 'rgba(201,146,42,0.5)' }}>|</span>
              <Link
                to="/login"
                onClick={close}
                className="text-xs tracking-[0.15em] font-semibold uppercase px-3 py-2 hover:opacity-70 transition-opacity"
                style={{ color: '#0F3D3D' }}
              >
                Iniciar sesión
              </Link>
            </span>
          )}
          {!isHome && (
            <Link
              to="/login"
              onClick={close}
              className="text-xs tracking-[0.15em] font-semibold uppercase px-3 py-2 hover:opacity-70 transition-opacity"
              style={{ color: '#0F3D3D' }}
            >
              Iniciar sesión
            </Link>
          )}
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
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={(e) => handleAnchorClick(e, l.href)}
            className="text-sm tracking-[0.15em] font-semibold uppercase py-2"
            style={{ color: '#0F3D3D' }}
          >
            {l.label}
          </a>
        ))}
        {isHome && navLinks.length > 0 && (
          <div className="h-px w-full my-2" style={{ backgroundColor: 'rgba(201,146,42,0.2)' }} />
        )}
        <Link
          to="/login"
          onClick={close}
          className="text-sm tracking-[0.15em] font-semibold uppercase py-2"
          style={{ color: '#0F3D3D' }}
        >
          Iniciar sesión
        </Link>
        <Link
          to="/contacto"
          onClick={close}
          className="text-sm tracking-[0.15em] font-semibold uppercase py-2"
          style={{ color: 'rgba(15,61,61,0.5)' }}
        >
          Contacto
        </Link>
      </div>

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
