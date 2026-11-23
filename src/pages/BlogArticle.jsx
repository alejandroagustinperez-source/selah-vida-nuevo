import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Share2, Check } from 'lucide-react';
import articles from '../data/blog';
import { getType, getTopic, readingTime } from '../data/blogMeta';

const TYPE_LABEL = { oracion: 'Oración', versiculos: 'Versículos', ensenanza: 'Enseñanza' };

const css = `
.article-content { font-family: Lora, Georgia, serif; font-size: 1.08rem; line-height: 1.85; color: #1F2A2A; }
.article-content p { margin-bottom: 1.25rem; }
.article-content h2 { font-family: 'Playfair Display', serif; color: #0F3D3D; font-size: 1.65rem; line-height: 1.3; font-weight: 700; margin: 2.8rem 0 1rem; }
.article-content h2::after { content: ''; display: block; width: 44px; height: 3px; background: #C9922A; border-radius: 2px; margin-top: .7rem; }
.article-content h3 { font-family: 'Playfair Display', serif; color: #0F3D3D; font-size: 1.25rem; margin: 2rem 0 .75rem; }
.article-content strong { color: #0F3D3D; }
.article-content a { color: #8F6416; text-decoration: underline; text-underline-offset: 3px; }
.article-content ul, .article-content ol { margin: 0 0 1.25rem 1.4rem; }
.article-content ul { list-style: disc; } .article-content ol { list-style: decimal; }
.article-content li { margin-bottom: .4rem; }
.article-content .section-divider { display:block; color:#C9922A; text-align:center; margin: 1rem 0; }
.article-content blockquote.bible-quote { position: relative; border-left: 4px solid #C9922A; background: #F1EBDF; border-radius: 0 14px 14px 0; font-style: italic; padding: 1.2rem 1.5rem; margin: 1.8rem 0; color: #0F3D3D; }
.article-content .prayer-block { background: linear-gradient(145deg,#0A2B2B,#0F3D3D); color: #FAF7F2; padding: 2.2rem 1.8rem; text-align: center; border-radius: 18px; margin: 2.4rem 0; font-style: italic; line-height: 1.9; box-shadow: 0 12px 32px rgba(15,61,61,.22); border: 1px solid rgba(201,146,42,.4); }
.article-content .prayer-block strong { color: #E0B256; }
.article-content .key-verses { display: grid; gap: .75rem; grid-template-columns: repeat(auto-fit,minmax(230px,1fr)); margin: 0 0 2.2rem; font-family: Figtree, system-ui, sans-serif; }
.article-content .verse-card { border: 1px solid #E2D8C4; border-left: 3px solid #C9922A; border-radius: 12px; padding: .9rem 1.1rem; background: #fff; font-size: .88rem; line-height: 1.55; color: #0F3D3D; max-width: none; }
@media (max-width: 640px) { .article-content { font-size: 1.02rem; } .article-content h2 { font-size: 1.45rem; } }
`;

export default function BlogArticle() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

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

  const related = useMemo(() => {
    if (!article) return [];
    const t = getType(article.slug);
    const pool = articles.filter((a) => a.slug !== article.slug);
    const same = pool.filter((a) => getType(a.slug) === t);
    const rest = pool.filter((a) => getType(a.slug) !== t);
    return [...same, ...rest].slice(0, 3);
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

  const { icon: Icon, color } = getTopic(article.slug);
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
      <div className="fixed top-0 left-0 h-1 z-[60]" style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#C9922A,#E0B256)', transition: 'width .1s linear' }} />

      <header className="px-6 pt-24 pb-14 md:pt-28 md:pb-16" style={{ background: 'linear-gradient(160deg,#0A2B2B 0%,#0F3D3D 60%,#164C4A 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-semibold mb-8 hover:opacity-80" style={{ color: '#E0B256' }}>
            <ArrowLeft size={14} /> Blog
          </Link>
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center justify-center rounded-full" style={{ width: 40, height: 40, background: 'rgba(224,178,86,.15)', border: '1px solid rgba(224,178,86,.4)' }}>
              <Icon size={18} color="#E0B256" strokeWidth={1.6} />
            </span>
            <span className="text-[11px] tracking-[0.25em] uppercase" style={{ color: '#E0B256' }}>{TYPE_LABEL[getType(article.slug)]}</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-6" style={{ color: '#FAF7F2' }}>{article.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" style={{ color: 'rgba(250,247,242,.75)' }}>
            <span>{article.date}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {readingTime(article.content)} min de lectura</span>
            <button onClick={share} className="ml-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all hover:brightness-110" style={{ backgroundColor: 'rgba(250,247,242,.12)', color: '#FAF7F2', border: '1px solid rgba(250,247,242,.25)' }}>
              {copied ? <><Check size={14} /> Enlace copiado</> : <><Share2 size={14} /> Compartir</>}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        <article>
          <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        <section className="mt-14 rounded-2xl text-center px-6 py-10" style={{ background: 'linear-gradient(145deg,#0A2B2B,#0F3D3D)', border: '1px solid rgba(201,146,42,.4)' }}>
          <p className="font-display text-2xl font-bold mb-3" style={{ color: '#FAF7F2' }}>No tenés que atravesarlo solo</p>
          <p className="text-sm md:text-base mb-6 max-w-md mx-auto" style={{ color: 'rgba(250,247,242,.78)' }}>Hablá con Rafael, tu acompañante espiritual disponible 24/7, y orá con él cuando lo necesites.</p>
          <Link to="/register" className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-all hover:brightness-110" style={{ backgroundColor: '#C9922A', color: '#fff' }}>
            Comenzá tu camino en Selah Vida <ArrowRight size={16} />
          </Link>
        </section>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-6" style={{ color: '#0F3D3D' }}>Te puede ayudar también</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((a) => {
                const t = getTopic(a.slug);
                return (
                  <Link key={a.slug} to={`/blog/${a.slug}`} className="group bg-white rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-lg" style={{ border: '1px solid #E2D8C4', borderTop: `3px solid ${t.color}` }}>
                    <p className="text-[11px] tracking-[0.18em] uppercase font-semibold mb-2" style={{ color: t.color }}>{TYPE_LABEL[getType(a.slug)]}</p>
                    <p className="font-display font-bold leading-snug group-hover:underline decoration-[#C9922A] underline-offset-4" style={{ color: '#0F3D3D' }}>{a.title}</p>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-8">
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
