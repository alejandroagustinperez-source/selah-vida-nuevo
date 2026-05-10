import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#problema', label: 'Problema' },
    { href: '#solucion', label: 'Solución' },
    { href: '#caracteristicas', label: 'Características' },
    { href: '#precios', label: 'Precios' },
  ];

  const close = () => setOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="#" className="font-serif text-xl font-bold text-dark-blue flex items-center gap-2">
          <span role="img" aria-label="paloma">🕊️</span> Selah Vida
        </a>

        <div
          className={`fixed top-0 right-0 h-screen w-64 bg-cream shadow-xl flex flex-col gap-6 pt-24 px-8 transition-transform duration-300 md:static md:h-auto md:w-auto md:shadow-none md:flex-row md:items-center md:pt-0 md:px-0 md:bg-transparent md:translate-x-0 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={close} className="text-dark-blue font-medium hover:text-gold transition-colors">
              {l.label}
            </a>
          ))}
          <a
            href="https://selah-vida.lovable.app/registro"
            onClick={close}
            className="bg-gold text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-gold-dark transition-colors md:ml-4"
          >
            Empezar gratis
          </a>
        </div>

        <button
          className="flex flex-col gap-1.5 md:hidden bg-none border-none cursor-pointer p-1"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          <span className={`block w-6 h-0.5 bg-dark-blue rounded transition-transform duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-0.5 bg-dark-blue rounded transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-dark-blue rounded transition-transform duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>
    </nav>
  );
}
