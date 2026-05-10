import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0e1f28] text-cream/50 text-center py-8 px-6 text-sm">
      <p className="mb-3">
        🕊️ <span className="text-gold">Selah Vida</span> — Acompañamiento espiritual con inteligencia bíblica
      </p>
      <div className="flex justify-center gap-4 text-xs">
        <Link to="/privacy" className="hover:text-gold transition-colors">Política de Privacidad</Link>
        <span className="text-cream/20">|</span>
        <Link to="/terms" className="hover:text-gold transition-colors">Términos de Uso</Link>
      </div>
    </footer>
  );
}
