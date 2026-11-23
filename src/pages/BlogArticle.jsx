import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Share2, Check, BookOpen } from 'lucide-react';
import articles from '../data/blog';
import { getType, getTopic, readingTime } from '../data/blogMeta';

const TYPE_LABEL = { oracion: 'Oración', versiculos: 'Versículos', ensenanza: 'Enseñanza' };

const css = `
@keyframes svFloat { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(30px,-24px,0) scale(1.12); } }
@keyframes svTwinkle { 0%,100% { opacity: .15; } 50% { opacity: .9; } }
@keyframes svRise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
@keyframes svShine { from { background-position: -200% 0; } to { background-position: 200% 0; } }
.sv-rise { animation: svRise .9s cubic-bezier(.2,.7,.2,1) both; }
.sv-gold-text { background: linear-gradient(100deg,#E0B256 0%,#F6E3A8 30%,#C9922A 55%,#E0B256 100%); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: svShine 7s linear infinite; }
.sv-star { position:absolute; width:3px; height:3px; border-radius:50%; background:#F6E3A8; animation: svTwinkle 4s ease-in-out infinite; }

.article-content { font-family: Lora, Georgia, serif; font-size: 1.1rem; line-height: 1.9; color: #243230; }
.article-content p { margin-bottom: 1.4rem; }
.article-content .reveal { opacity: 0; transform: translateY(26px); transition: opacity .8s ease, transform .8s cubic-bezier(.2,.7,.2,1); }
.article-content .reveal.in { opacity: 1; transform: none; }

/* Versículos clave */
.article-content .key-verses { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); margin: -4.5rem 0 3rem; position: relative; z-index: 5; font-family: Figtree, system-ui, sans-serif; }
.article-content .verse-card { position: relative; overflow: hidden; border-radius: 18px; padding: 1.4rem 1.3rem 1.3rem; background: linear-gradient(160deg,#fff,#FBF6EA); border: 1px solid rgba(201,146,42,.35); box-shadow: 0 18px 40px -14px rgba(15,61,61,.35); max-width: none; transition: transform .35s ease, box-shadow .35s ease; }
.article-content .verse-card:hover { transform: translateY(-6px); box-shadow: 0 26px 50px -14px rgba(201,146,42,.45); }
.article-content .verse-card::before { content: ''; position:absolute; top:0; left:0; right:0; height:3px; background: linear-gradient(90deg,#C9922A,#F6E3A8,#C9922A); }
.article-content .verse-card .vref { display:block; font-size:.68rem; letter-spacing:.22em; text-transform:uppercase; font-weight:700; color:#8F6416; margin-bottom:.55rem; }
.article-content .verse-card .vtxt { font-family: Lora, Georgia, serif; font-style: italic; font-size: .98rem; line-height: 1.6; color: #0F3D3D; }

/* Párrafo de apertura */
.article-content .key-verses + p { font-size: 1.32rem; line-height: 1.7; color: #0F3D3D; font-family: 'Playfair Display', Georgia, serif; font-style: italic; padding-left: 1.2rem; border-left: 3px solid #C9922A; margin-bottom: 1.8rem; }

/* Títulos de sección */
.article-content h2 { font-family: 'Playfair Display', serif; color: #0F3D3D; font-size: 1.9rem; line-height: 1.25; font-weight: 700; margin: 3.6rem 0 1.4rem; text-align: center; }
.article-content h2::before { content: '◆  ◆  ◆'; display:block; color:#C9922A; font-size:.6rem; letter-spacing:.6em; margin-bottom:1rem; opacity:.9; }
.article-content h2::after { content: ''; display:block; width: 70px; height: 2px; margin: 1.1rem auto 0; background: linear-gradient(90deg,transparent,#C9922A,transparent); }
.article-content h3 { font-family: 'Playfair Display', serif; color: #0F3D3D; font-size: 1.3rem; margin: 2.2rem 0 .8rem; }
.article-content strong { color: #0F3D3D; font-weight: 700; }
.article-content a { color: #8F6416; text-decoration: underline; text-underline-offset: 3px; }
.article-content ul, .article-content ol { margin: 0 0 1.4rem 1.4rem; }
.article-content ul { list-style: disc; } .article-content ol { list-style: decimal; }
.article-content li { margin-bottom: .45rem; }
.article-content .section-divider { display:block; color:#C9922A; text-align:center; margin: 1.4rem 0; letter-spacing:.5em; }

/* Cita bíblica */
.article-content blockquote.bible-quote { position: relative; margin: 2.6rem 0; padding: 2.6rem 2rem 1.8rem 2.2rem; border: 0; border-radius: 22px; font-style: italic; font-size: 1.15rem; line-height: 1.75; color: #0F3D3D; background: linear-gradient(135deg,#F6EEDB,#FBF6EA 60%,#F1E6CC); box-shadow: inset 0 0 0 1px rgba(201,146,42,.3); }
.article-content blockquote.bible-quote::before { content: '“'; position:absolute; top:-.15rem; left:1.2rem; font-family:'Playfair Display',serif; font-style: normal; font-size: 5.5rem; line-height: 1; color:#C9922A; opacity:.85; }
.article-content blockquote.bible-quote::after { content: ''; position:absolute; left:0; top:1.4rem; bottom:1.4rem; width:4px; border-radius:4px; background: linear-gradient(180deg,#E0B256,#C9922A); }

/* Oración */
.article-content .prayer-block { position: relative; overflow: hidden; margin: 3.2rem -.5rem; padding: 3.6rem 2.2rem 2.6rem; text-align: center; border-radius: 26px; font-style: italic; font-size: 1.12rem; line-height: 2; color: #F3EDE0; background: radial-gradient(120% 90% at 50% 0%, #1A5553 0%, #0F3D3D 45%, #082525 100%); border: 1px solid rgba(224,178,86,.55); box-shadow: 0 30px 60px -20px rgba(8,37,37,.6), inset 0 0 60px rgba(201,146,42,.08); }
.article-content .prayer-block::before { content: '✦  ORACIÓN  ✦'; position:absolute; top: 1.3rem; left:0; right:0; font-style: normal; font-family: Figtree, sans-serif; font-size:.7rem; letter-spacing:.35em; color:#E0B256; }
.article-content .prayer-block::after { content:''; position:absolute; inset: 8px; border-radius: 20px; border: 1px solid rgba(224,178,86,.22); pointer-events:none; }
.article-content .prayer-block strong { color:#F6D98B; }
.article-content .prayer-block p { margin-bottom: 1.1rem; }

@media (max-width: 640px) {
  .article-content { font-size: 1.04rem; }
  .article-content .key-verses { margin-top: -3rem; }
  .article-content .key-verses + p { font-size: 1.15rem; }
  .article-content h2 { font-size: 1.55rem; }
  .article-content .prayer-block { margin-left: 0; margin-right: 0; padding: 3.4rem 1.3rem 2rem; font-size: 1.03rem; }
  .article-content blockquote.bible-quote { padding: 2.4rem 1.2rem 1.4rem 1.5rem; font-size: 1.06rem; }
}
@media (prefers-reduced-motion: reduce) { .sv-gold-text, .sv-star, .sv-rise { animation: none; } .article-content .reveal { opacity: 1; transform: none; transition: none; } }
`;

const STARS = [[8, 22, 0], [18, 70, 1.2], [30, 38, .6], [42, 84, 2], [55, 15, 1.7], [64, 60, .3], [78, 30, 2.4], [88, 78, 1], [92, 45, 1.9], [12, 50, 2.8], [70, 90, 3.1], [25, 93, .9]];

export default function BlogArticle() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (article) {
      document.title = `${article.title} — Selah Vida`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', article.metaDescription);
    }
  }, [article]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [slug]);

  // Versículos: separar referencia y texto para un diseño más elegante
  const html = useMemo(() => {
    if (!article) return '';
    return article.content.replace(
      /<div class="verse-card">\s*(?:📖\s*)?([^—<]+?)\s+—\s+([\s\S]*?)<\/div>/g,
      '<div class="verse-card"><span class="vref">$1</span><span class="vtxt">$2</span></div>'
    );
  }, [article]);

  // Aparición suave al hacer scroll
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return undefined;
    const items = [...root.children].filter((el) => !el.classList.contains('key-verses'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return undefined;
    items.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [html]);

  const related = useMemo(() => {
    if (!article) return [];
    const t = getType(article.slug);
    const pool = articles.filter((a) => a.slug !== article.slug);
    return [...pool.filter((a) => getType(a.slug) === t), ...pool.filter((a) => getType(a.slug) !== t)].slice(0, 3);
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="text-center px-6">
          <p className="font-display text-2xl font-bold mb-4" style={{ color: '#0F3D3D' }}>Artículo no encontrado</p>
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#8F6416' }}>
            <ArrowLeft size={16} /> Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  const { icon: Icon } = getTopic(article.slug);
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: article.title, url });
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    } catch { /* cancelado */ }
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2' }}>
      <style>{css}</style>
      <div className="fixed top-0 left-0 h-[3px] z-[60]" style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#C9922A,#F6E3A8,#C9922A)', boxShadow: '0 0 12px rgba(224,178,86,.8)' }} />

      {/* Portada */}
      <header className="relative overflow-hidden text-center px-6 pt-28 pb-40 md:pt-32 md:pb-44" style={{ background: 'radial-gradient(90% 120% at 50% 0%, #1B5755 0%, #0F3D3D 45%, #07211F 100%)' }}>
        <div className="absolute rounded-full pointer-events-none" style={{ width: 520, height: 520, top: -200, left: -120, background: 'radial-gradient(circle,rgba(201,146,42,.35),transparent 65%)', animation: 'svFloat 14s ease-in-out infinite' }} />
        <div className="absolute rounded-full pointer-events-none" style={{ width: 460, height: 460, bottom: -220, right: -100, background: 'radial-gradient(circle,rgba(224,178,86,.28),transparent 65%)', animation: 'svFloat 18s ease-in-out infinite reverse' }} />
        {STARS.map(([t, l, d], i) => <span key={i} className="sv-star" style={{ top: `${t}%`, left: `${l}%`, animationDelay: `${d}s` }} />)}
        <Icon className="absolute pointer-events-none" size={360} strokeWidth={0.5} color="#E0B256" style={{ right: '-60px', top: '10%', opacity: 0.07 }} />
        <div className="absolute left-0 right-0 bottom-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,#C9922A,transparent)' }} />

        <div className="relative max-w-3xl mx-auto">
          <Link to="/blog" className="sv-rise inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-semibold mb-9 hover:opacity-80" style={{ color: '#E0B256' }}>
            <ArrowLeft size={14} /> Volver al blog
          </Link>

          <div className="sv-rise flex items-center justify-center gap-4 mb-6" style={{ animationDelay: '.1s' }}>
            <span className="h-px w-12" style={{ background: 'linear-gradient(90deg,transparent,#E0B256)' }} />
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase" style={{ color: '#E0B256' }}>
              <Icon size={14} strokeWidth={1.6} /> {TYPE_LABEL[getType(article.slug)]}
            </span>
            <span className="h-px w-12" style={{ background: 'linear-gradient(270deg,transparent,#E0B256)' }} />
          </div>

          <h1 className="sv-rise font-display text-4xl md:text-6xl font-bold leading-[1.12] mb-8" style={{ animationDelay: '.2s', color: '#FAF7F2', textShadow: '0 4px 30px rgba(0,0,0,.35)' }}>
            {article.title}
          </h1>

          <div className="sv-rise flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm" style={{ animationDelay: '.35s', color: 'rgba(250,247,242,.8)' }}>
            <span>{article.date}</span>
            <span className="sv-gold-text" aria-hidden>◆</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {readingTime(article.content)} min de lectura</span>
            <button onClick={share} className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg,#C9922A,#E0B256)', color: '#0A2B2B', boxShadow: '0 8px 24px -6px rgba(201,146,42,.6)' }}>
              {copied ? <><Check size={14} /> Enlace copiado</> : <><Share2 size={14} /> Compartir</>}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-20">
        <article>
          <div ref={contentRef} className="article-content" dangerouslySetInnerHTML={{ __html: html }} />
        </article>

        <div className="flex items-center justify-center gap-4 mt-14" aria-hidden>
          <span className="h-px w-20" style={{ background: 'linear-gradient(90deg,transparent,#C9922A)' }} />
          <BookOpen size={18} color="#C9922A" />
          <span className="h-px w-20" style={{ background: 'linear-gradient(270deg,transparent,#C9922A)' }} />
        </div>

        {/* CTA */}
        <section className="relative overflow-hidden mt-10 rounded-3xl text-center px-6 py-14" style={{ background: 'radial-gradient(120% 100% at 50% 0%, #1A5553, #0F3D3D 50%, #07211F)', border: '1px solid rgba(224,178,86,.5)', boxShadow: '0 30px 60px -24px rgba(8,37,37,.7)' }}>
          <div className="absolute rounded-full pointer-events-none" style={{ width: 360, height: 360, top: -160, right: -80, background: 'radial-gradient(circle,rgba(224,178,86,.3),transparent 65%)', animation: 'svFloat 12s ease-in-out infinite' }} />
          <p className="relative text-[11px] tracking-[0.3em] uppercase mb-4" style={{ color: '#E0B256' }}>✦ Acompañamiento 24/7 ✦</p>
          <p className="relative font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: '#FAF7F2' }}>No tenés que atravesarlo <span className="sv-gold-text">solo</span></p>
          <p className="relative text-sm md:text-base mb-8 max-w-md mx-auto" style={{ color: 'rgba(250,247,242,.8)' }}>Hablá con Rafael, tu acompañante espiritual, y orá con él cuando lo necesites.</p>
          <Link to="/register" className="relative inline-flex items-center gap-2 rounded-full px-9 py-4 text-sm font-semibold transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg,#C9922A,#E0B256)', color: '#0A2B2B', boxShadow: '0 14px 34px -8px rgba(201,146,42,.7)' }}>
            Comenzá tu camino en Selah Vida <ArrowRight size={16} />
          </Link>
        </section>

        {related.length > 0 && (
          <section className="mt-20">
            <p className="text-center text-[11px] tracking-[0.3em] uppercase mb-2" style={{ color: '#8F6416' }}>Seguí leyendo</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: '#0F3D3D' }}>Te puede ayudar también</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((a) => {
                const t = getTopic(a.slug);
                const RIcon = t.icon;
                return (
                  <Link key={a.slug} to={`/blog/${a.slug}`} className="group relative overflow-hidden bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl" style={{ border: '1px solid #E2D8C4' }}>
                    <div className="absolute top-0 left-0 right-0 h-[3px] transition-all group-hover:h-1.5" style={{ background: `linear-gradient(90deg,${t.color},#E0B256)` }} />
                    <RIcon size={22} color={t.color} strokeWidth={1.5} className="mb-4" />
                    <p className="text-[10px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ color: t.color }}>{TYPE_LABEL[getType(a.slug)]}</p>
                    <p className="font-display font-bold leading-snug" style={{ color: '#0F3D3D' }}>{a.title}</p>
                    <ArrowRight size={16} color="#C9922A" className="mt-4 transition-transform group-hover:translate-x-1.5" />
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline" style={{ color: '#0F3D3D' }}>
                Ver todos los artículos <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
