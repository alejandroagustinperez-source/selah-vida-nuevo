import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0F2E2E' }}>
      <div className="max-w-6xl mx-auto px-6 py-14 md:py-18">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Selah Vida" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
              <span className="font-serif text-lg font-bold text-white">Selah Vida</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Acompa&ntilde;amiento espiritual con inteligencia b&iacute;blica.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs tracking-[3px] font-semibold uppercase mb-5" style={{ color: '#C9922A' }}>Navegaci&oacute;n</h4>
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.7)' }}>Inicio</Link>
              <Link to="/contacto" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.7)' }}>Contacto</Link>
              <Link to="/login" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.7)' }}>Iniciar sesi&oacute;n</Link>
              <Link to="/register" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.7)' }}>Registrarse</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs tracking-[3px] font-semibold uppercase mb-5" style={{ color: '#C9922A' }}>Recursos</h4>
            <div className="flex flex-col gap-3">
              <Link to="/privacy" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.7)' }}>Pol&iacute;tica de Privacidad</Link>
              <Link to="/terms" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.7)' }}>T&eacute;rminos de Uso</Link>
              <a href="#problema" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.7)' }}>Preguntas frecuentes</a>
            </div>
          </div>

          {/* Download */}
          <div>
            <h4 className="text-xs tracking-[3px] font-semibold uppercase mb-5" style={{ color: '#C9922A' }}>Descarga la app</h4>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Pr&oacute;ximamente disponible en iOS y Android.
            </p>
            <div className="flex flex-col gap-2">
              {/*
              <span className="inline-block px-4 py-2 rounded-lg text-xs text-center border transition-opacity" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)' }}>
                App Store
              </span>
              <span className="inline-block px-4 py-2 rounded-lg text-xs text-center border transition-opacity" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)' }}>
                Google Play
              </span>
              */}
          </div>
        </div>
      </div>
      </div>

      <div className="border-t py-6 px-6" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
          &copy; {new Date().getFullYear()} Selah Vida. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
