import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, ArrowRight, Sparkles } from 'lucide-react';
import articles from '../data/blog';
import { TYPES, getType, getTopic, readingTime, dateValue } from '../data/blogMeta';

const TYPE_LABEL = { oracion: 'Oración', versiculos: 'Versículos', ensenanza: 'Enseñanza' };

function TopicBadge({ slug, size = 44 }) {
  const { icon: Icon, color } = getTopic(slug);
  return (
    <span
      className="inline-flex items-center justify-center rounded-full shrink-0"
      style={{ width: size, height: size, backgroundColor: `${color}14`, border: `1px solid ${color}33` }}
    >
      <Icon size={size * 0.47} color={color} strokeWidth={1.6} />
    </span>
  );
}

function Meta({ a, light = false }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: light ? 'rgba(250,247,242,0.7)' : '#6b7775' }}>
      <span>{a.date}</span>
      <span aria-hidden>·</span>
      <span className="inline-flex items-center gap-1"><Clock size={12} /> {readingTime(a.content)} min de lectura</span>
    </div>
  );
}

const css = `
@keyframes svFloat { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(30px,-24px,0) scale(1.12); } }
@keyframes svTwinkle { 0%,100% { opacity: .15; } 50% { opacity: .9; } }
@keyframes svRise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
@keyframes svShine { from { background-position: -200% 0; } to { background-position: 200% 0; } }
.sv-rise { animation: svRise .9s cubic-bezier(.2,.7,.2,1) both; }
.sv-gold-text { background: linear-gradient(100deg,#E0B256 0%,#F6E3A8 30%,#C9922A 55%,#E0B256 100%); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: svShine 7s linear infinite; }
.sv-star { position:absolute; width:3px; height:3px; border-radius:50%; background:#F6E3A8; animation: svTwinkle 4s ease-in-out infinite; }
.sv-card { position: relative; overflow: hidden; }
.sv-card::after { content:''; position:absolute; inset:0; background: linear-gradient(120deg,transparent 40%,rgba(224,178,86,.16) 50%,transparent 60%); transform: translateX(-120%); transition: transform .8s ease; pointer-events:none; }
.sv-card:hover::after { transform: translateX(120%); }
@media (prefers-reduced-motion: reduce) { .sv-gold-text, .sv-star, .sv-rise, .sv-card::after { animation: none; transition: none; } }
`;
const STARS = [[10, 18, 0], [20, 72, 1.2], [34, 40, .6], [46, 86, 2], [58, 12, 1.7], [66, 58, .3], [80, 28, 2.4], [88, 80, 1], [92, 44, 1.9], [14, 52, 2.8], [72, 92, 3.1], [26, 94, .9]];

export default function Blog() {
  const [type, setType] = useState('todos');
  const [q, setQ] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Blog — Selah Vida';
  }, []);

  const sorted = useMemo(() => [...articles].sort((a, b) => dateValue(b.date) - dateValue(a.date)), []);
  const featured = sorted[0];
  const filtering = type !== 'todos' || q.trim() !== '';

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return sorted.filter((a) => {
      if (type !== 'todos' && getType(a.slug) !== type) return false;
      if (!term) return true;
      return (a.title + ' ' + a.excerpt).toLowerCase().includes(term);
    });
  }, [sorted, type, q]);

  const grid = filtering ? list : list.filter((a) => a.slug !== featured?.slug);

  return (
    <div style={{ backgroundColor: '#FAF7F2' }}>
      <style>{css}</style>
      {/* Hero */}
      <header className="relative overflow-hidden text-center px-6 pt-28 pb-28 md:pt-32 md:pb-32" style={{ background: 'radial-gradient(90% 120% at 50% 0%, #1B5755 0%, #0F3D3D 45%, #07211F 100%)' }}>
        <div className="absolute rounded-full pointer-events-none" style={{ width: 520, height: 520, top: -200, left: -120, background: 'radial-gradient(circle,rgba(201,146,42,.35),transparent 65%)', animation: 'svFloat 14s ease-in-out infinite' }} />
        <div className="absolute rounded-full pointer-events-none" style={{ width: 460, height: 460, bottom: -220, right: -100, background: 'radial-gradient(circle,rgba(224,178,86,.28),transparent 65%)', animation: 'svFloat 18s ease-in-out infinite reverse' }} />
        {STARS.map(([t, l, d], i) => <span key={i} className="sv-star" style={{ top: `${t}%`, left: `${l}%`, animationDelay: `${d}s` }} />)}
        <div className="absolute left-0 right-0 bottom-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,#C9922A,transparent)' }} />
        <div className="relative max-w-2xl mx-auto">
          <div className="sv-rise flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-12" style={{ background: 'linear-gradient(90deg,transparent,#E0B256)' }} />
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase" style={{ color: '#E0B256' }}><Sparkles size={14} /> Blog de Selah Vida</span>
            <span className="h-px w-12" style={{ background: 'linear-gradient(270deg,transparent,#E0B256)' }} />
          </div>
          <h1 className="sv-rise font-display text-4xl md:text-6xl font-bold leading-[1.12] mb-6" style={{ animationDelay: '.15s', color: '#FAF7F2', textShadow: '0 4px 30px rgba(0,0,0,.35)' }}>
            Palabras que sostienen<br className="hidden md:block" /> cuando el <span className="sv-gold-text">alma pesa</span>
          </h1>
          <p className="sv-rise text-base md:text-lg leading-relaxed mb-9" style={{ animationDelay: '.3s', color: 'rgba(250,247,242,0.8)' }}>
            Oraciones, versículos y reflexiones para atravesar la ansiedad, la tristeza, el miedo y cada día difícil.
          </p>
          <label className="sv-rise relative block max-w-md mx-auto" style={{ animationDelay: '.45s' }}>
            <span className="sr-only">Buscar en el blog</span>
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2" color="#8F6416" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscá un tema: ansiedad, perdón, paz…"
              className="w-full rounded-full pl-12 pr-5 py-4 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: '#FAF7F2', color: '#1F2A2A', '--tw-ring-color': '#E0B256', boxShadow: '0 18px 40px -12px rgba(0,0,0,.5)' }}
            />
          </label>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 md:px-8 pb-24">
        {/* Filtros */}
        <div className="-mt-6 relative z-10 flex flex-wrap justify-center gap-2 mb-12" role="tablist" aria-label="Filtrar por tipo">
          {TYPES.map((t) => {
            const on = type === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={on}
                onClick={() => setType(t.id)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all shadow-sm"
                style={on
                  ? { background: 'linear-gradient(135deg,#C9922A,#E0B256)', color: '#0A2B2B', border: '1px solid #C9922A', boxShadow: '0 8px 20px -6px rgba(201,146,42,.6)' }
                  : { backgroundColor: '#fff', color: '#0F3D3D', border: '1px solid #E2D8C4' }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Destacado */}
        {!filtering && featured && (
          <Link
            to={`/blog/${featured.slug}`}
            className="sv-card group block rounded-3xl overflow-hidden mb-14 transition-all hover:-translate-y-1"
            style={{ background: 'radial-gradient(120% 120% at 0% 0%, #1A5553, #0F3D3D 50%, #07211F)', border: '1px solid rgba(224,178,86,.5)', boxShadow: '0 30px 60px -24px rgba(8,37,37,.7)' }}
          >
            <div className="p-8 md:p-12 md:flex md:items-center md:gap-10">
              <div className="hidden md:block"><TopicBadge slug={featured.slug} size={96} /></div>
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: '#E0B256' }}>✦ Lo más reciente ✦</p>
                <h2 className="font-display text-2xl md:text-4xl font-bold leading-snug mb-4" style={{ color: '#FAF7F2' }}>{featured.title}</h2>
                <p className="text-sm md:text-base leading-relaxed mb-5 line-clamp-3" style={{ color: 'rgba(250,247,242,0.78)' }}>{featured.excerpt}</p>
                <div className="flex flex-wrap items-center gap-5">
                  <Meta a={featured} light />
                  <span className="inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3" style={{ color: '#E0B256' }}>
                    Leer artículo <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Grilla */}
        {grid.length === 0 ? (
          <p className="text-center py-16 text-sm" style={{ color: '#4A5654' }}>No encontramos artículos para esa búsqueda. Probá con otra palabra.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {grid.map((a) => {
              const { color } = getTopic(a.slug);
              return (
                <Link
                  key={a.slug}
                  to={`/blog/${a.slug}`}
                  className="sv-card group flex flex-col bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                  style={{ border: '1px solid #E2D8C4', borderTop: `3px solid ${color}` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <TopicBadge slug={a.slug} />
                    <span className="text-[11px] tracking-[0.18em] uppercase font-semibold" style={{ color }}>{TYPE_LABEL[getType(a.slug)]}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold leading-snug mb-2 group-hover:underline decoration-[#C9922A] underline-offset-4" style={{ color: '#0F3D3D' }}>{a.title}</h3>
                  <p className="text-sm leading-relaxed mb-5 line-clamp-3" style={{ color: '#4A5654' }}>{a.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between pt-4" style={{ borderTop: '1px solid #F1EBDF' }}>
                    <Meta a={a} />
                    <ArrowRight size={16} color="#C9922A" className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <section className="relative overflow-hidden mt-20 rounded-3xl text-center px-6 py-14" style={{ background: 'radial-gradient(120% 100% at 50% 0%, #1A5553, #0F3D3D 50%, #07211F)', border: '1px solid rgba(224,178,86,.5)', boxShadow: '0 30px 60px -24px rgba(8,37,37,.7)' }}>
          <div className="absolute rounded-full pointer-events-none" style={{ width: 360, height: 360, top: -160, right: -80, background: 'radial-gradient(circle,rgba(224,178,86,.3),transparent 65%)', animation: 'svFloat 12s ease-in-out infinite' }} />
          <p className="relative text-[11px] tracking-[0.3em] uppercase mb-4" style={{ color: '#E0B256' }}>✦ Acompañamiento 24/7 ✦</p>
          <h2 className="relative font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: '#FAF7F2' }}>¿Necesitás hablar con <span className="sv-gold-text">alguien ahora</span>?</h2>
          <p className="relative text-sm md:text-base mb-8 max-w-lg mx-auto" style={{ color: 'rgba(250,247,242,.8)' }}>Rafael, tu acompañante espiritual, está disponible las 24 horas para escucharte y orar con vos.</p>
          <Link to="/register" className="relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold whitespace-nowrap transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg,#C9922A,#E0B256)', color: '#0A2B2B', boxShadow: '0 14px 34px -8px rgba(201,146,42,.7)' }}>
            Hablar con Rafael <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
