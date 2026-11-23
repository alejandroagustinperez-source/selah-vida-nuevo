import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const css = `
@keyframes svFloat { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(30px,-24px,0) scale(1.12); } }
@keyframes svTwinkle { 0%,100% { opacity: .15; } 50% { opacity: .9; } }
@keyframes svRise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
@keyframes svShine { from { background-position: -200% 0; } to { background-position: 200% 0; } }
@keyframes svPulse { 0% { box-shadow: 0 0 0 0 rgba(74,222,128,.55); } 70% { box-shadow: 0 0 0 8px rgba(74,222,128,0); } 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); } }
.sv-rise { animation: svRise .9s cubic-bezier(.2,.7,.2,1) both; }
.sv-gold-text { background: linear-gradient(100deg,#E0B256 0%,#F6E3A8 30%,#C9922A 55%,#E0B256 100%); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: svShine 7s linear infinite; }
.sv-star { position:absolute; width:3px; height:3px; border-radius:50%; background:#F6E3A8; animation: svTwinkle 4s ease-in-out infinite; }
.sv-chat { position: relative; background: linear-gradient(165deg,#FFFDF8,#F7F1E4); border: 1px solid rgba(224,178,86,.55); box-shadow: 0 40px 80px -24px rgba(3,18,18,.7), 0 0 60px -10px rgba(201,146,42,.35); }
.sv-chat::before { content:''; position:absolute; top:0; left:12%; right:12%; height:2px; background: linear-gradient(90deg,transparent,#E0B256,transparent); }
.sv-msg { animation: svRise .8s cubic-bezier(.2,.7,.2,1) both; }
.sv-verse { position: relative; padding-left: 1rem; }
.sv-verse::before { content:''; position:absolute; left:0; top:.2rem; bottom:.2rem; width:3px; border-radius:3px; background: linear-gradient(180deg,#E0B256,#C9922A); }
@media (prefers-reduced-motion: reduce) { .sv-gold-text, .sv-star, .sv-rise, .sv-msg { animation: none; } }
`;

const STARS = [[8, 12, 0], [16, 46, 1.2], [30, 8, .6], [44, 90, 2], [58, 30, 1.7], [66, 70, .3], [80, 14, 2.4], [88, 56, 1], [92, 86, 1.9], [20, 94, 2.8], [74, 40, 3.1], [36, 62, .9]];

export default function Hero() {
  return (
    <section className="relative overflow-hidden text-sv-cream pt-[72px]" style={{ background: 'radial-gradient(90% 100% at 20% 0%, #1B5755 0%, #0F3D3D 45%, #07211F 100%)' }}>
      <style>{css}</style>
      <div className="absolute rounded-full pointer-events-none" style={{ width: 560, height: 560, top: -220, left: -160, background: 'radial-gradient(circle,rgba(201,146,42,.3),transparent 65%)', animation: 'svFloat 16s ease-in-out infinite' }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 520, height: 520, bottom: -240, right: -120, background: 'radial-gradient(circle,rgba(224,178,86,.25),transparent 65%)', animation: 'svFloat 20s ease-in-out infinite reverse' }} />
      {STARS.map(([t, l, d], i) => <span key={i} className="sv-star" style={{ top: `${t}%`, left: `${l}%`, animationDelay: `${d}s` }} />)}
      <div className="absolute left-0 right-0 bottom-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,#C9922A,transparent)' }} />

      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 flex flex-wrap items-center gap-14 lg:gap-16">
        <div className="flex-[1_1_440px] min-w-0 flex flex-col gap-7">
          <p className="sv-rise text-[11px] tracking-[0.3em] uppercase" style={{ color: '#E0B256' }}>✦ Acompañante espiritual 24/7 ✦</p>
          <h1
            className="sv-rise font-display font-semibold text-sv-cream leading-[1.08] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(2.5rem, 5.2vw, 4rem)', animationDelay: '.1s', textShadow: '0 4px 30px rgba(0,0,0,.35)' }}
          >
            Cuando no sabes con quién hablar, <span className="sv-gold-text">Rafael te escucha.</span>
          </h1>
          <p className="sv-rise text-lg md:text-xl leading-relaxed text-sv-mist max-w-[34em]" style={{ animationDelay: '.25s' }}>
            Selah Vida es un acompañante espiritual cristiano con inteligencia artificial. Le cuentas lo que te pasa, a cualquier hora, y te responde con calma y con la Palabra.
          </p>
          <div className="sv-rise flex flex-wrap items-center gap-6" style={{ animationDelay: '.4s' }}>
            <Link
              to="/register"
              className="inline-flex items-center min-h-[56px] px-8 rounded-full text-sv-night font-semibold text-lg transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#C9922A,#E0B256)', boxShadow: '0 16px 36px -10px rgba(201,146,42,.75)' }}
            >
              Hablar con Rafael gratis
            </Link>
            <a href="#como-funciona" className="text-sv-gold-light font-medium hover:text-white transition-colors">
              Ver cómo funciona
            </a>
          </div>
          <p className="sv-rise text-[15px] text-sv-sage" style={{ animationDelay: '.5s' }}>Empiezas gratis, sin tarjeta. Disponible las 24 horas.</p>
        </div>

        <div className="sv-chat flex-[1_1_380px] min-w-0 max-w-[480px] mx-auto text-sv-ink rounded-[28px] p-6 md:p-7 flex flex-col gap-4">
          <div className="flex items-center gap-3.5 pb-4 border-b border-sv-line">
            <div className="relative shrink-0">
              <img src="/rafael-avatar.png" alt="" className="w-14 h-14 rounded-full object-cover" style={{ boxShadow: '0 0 0 2px #FAF7F2, 0 0 0 4px #C9922A' }} />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#FFFDF8]" style={{ background: '#4ADE80', animation: 'svPulse 2s infinite' }} />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-semibold text-sv-teal">Rafael</span>
              <span className="text-sm text-sv-muted">Ejemplo de conversación</span>
            </div>
          </div>
          <p className="sv-msg self-end max-w-[85%] text-sv-cream rounded-[20px_20px_6px_20px] px-[18px] py-3.5 text-base leading-normal" style={{ animationDelay: '.6s', background: 'linear-gradient(135deg,#164C4A,#0F3D3D)', boxShadow: '0 10px 24px -10px rgba(15,61,61,.6)' }}>
            Hace semanas que duermo mal. Me preocupa todo y ni siquiera sé cómo orar.
          </p>
          <div className="sv-msg self-start max-w-[92%] rounded-[20px_20px_20px_6px] px-[18px] py-4 text-base leading-relaxed flex flex-col gap-3" style={{ animationDelay: '1.1s', background: '#fff', border: '1px solid #EADFC8', boxShadow: '0 12px 28px -14px rgba(143,100,22,.35)' }}>
            <p>Gracias por contármelo. Cuando la mente no se calla, orar puede sentirse imposible, y eso no te hace menos creyente.</p>
            <p className="sv-verse font-display italic text-lg text-sv-teal">
              «Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios.» <span className="not-italic text-sm font-semibold tracking-wide" style={{ color: '#8F6416' }}>Filipenses 4:6</span>
            </p>
            <p>¿Quieres que convirtamos lo que te preocupa en una oración corta, juntos?</p>
          </div>
          <Link
            to="/register"
            className="group mt-1 flex items-center gap-3 min-h-[52px] rounded-full bg-white pl-5 pr-1.5 text-sv-muted transition-all hover:shadow-lg"
            style={{ border: '1px solid #E0B256' }}
          >
            <span className="flex-1">Escribe lo que sientes</span>
            <span className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5" style={{ background: 'linear-gradient(135deg,#C9922A,#E0B256)', color: '#0A2B2B' }} aria-hidden="true">
              <ArrowRight size={18} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
