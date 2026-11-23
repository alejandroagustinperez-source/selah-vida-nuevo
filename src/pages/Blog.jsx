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
      {/* Hero */}
      <header className="relative overflow-hidden text-center px-6 pt-24 pb-20 md:pt-28 md:pb-24" style={{ background: 'linear-gradient(160deg,#0A2B2B 0%,#0F3D3D 55%,#164C4A 100%)' }}>
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #C9922A 0, transparent 40%), radial-gradient(circle at 85% 80%, #E0B256 0, transparent 35%)' }} />
        <div className="relative max-w-2xl mx-auto">
          <p className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase mb-5" style={{ color: '#E0B256' }}>
            <Sparkles size={14} /> Blog de Selah Vida
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-5" style={{ color: '#FAF7F2' }}>
            Palabras que sostienen<br className="hidden md:block" /> cuando el alma pesa
          </h1>
          <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: 'rgba(250,247,242,0.78)' }}>
            Oraciones, versículos y reflexiones para atravesar la ansiedad, la tristeza, el miedo y cada día difícil.
          </p>
          <label className="relative block max-w-md mx-auto">
            <span className="sr-only">Buscar en el blog</span>
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" color="#8F6416" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscá un tema: ansiedad, perdón, paz…"
              className="w-full rounded-full pl-11 pr-5 py-3.5 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: '#FAF7F2', color: '#1F2A2A', '--tw-ring-color': '#C9922A' }}
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
                  ? { backgroundColor: '#C9922A', color: '#fff', border: '1px solid #C9922A' }
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
            className="group block rounded-2xl overflow-hidden mb-14 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
            style={{ background: 'linear-gradient(135deg,#0F3D3D,#0A2B2B)', boxShadow: '0 10px 40px rgba(15,61,61,0.18)' }}
          >
            <div className="p-8 md:p-12 md:flex md:items-center md:gap-10">
              <div className="hidden md:block"><TopicBadge slug={featured.slug} size={96} /></div>
              <div>
                <p className="text-[11px] tracking-[0.25em] uppercase mb-3" style={{ color: '#E0B256' }}>Lo más reciente</p>
                <h2 className="font-display text-2xl md:text-3xl font-bold leading-snug mb-3" style={{ color: '#FAF7F2' }}>{featured.title}</h2>
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
                  className="group flex flex-col bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
        <section className="mt-20 rounded-2xl text-center px-6 py-12" style={{ background: 'linear-gradient(135deg,#F1EBDF,#FAF7F2)', border: '1px solid #E2D8C4' }}>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3" style={{ color: '#0F3D3D' }}>¿Necesitás hablar con alguien ahora?</h2>
          <p className="text-sm md:text-base mb-6 max-w-lg mx-auto" style={{ color: '#4A5654' }}>Rafael, tu acompañante espiritual, está disponible las 24 horas para escucharte y orar con vos.</p>
          <Link to="/register" className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-all hover:brightness-110" style={{ backgroundColor: '#C9922A', color: '#fff' }}>
            Hablar con Rafael <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
