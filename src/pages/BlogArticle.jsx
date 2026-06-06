import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import articles from '../data/blog';

export default function BlogArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = articles.find((a) => a.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (article) {
      document.title = `${article.title} — Selah Vida`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', article.metaDescription);
    }
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="text-center px-6">
          <p className="font-serif text-xl font-bold mb-4" style={{ color: '#0F3D3D' }}>Artículo no encontrado</p>
          <Link to="/blog" className="text-xs tracking-[0.15em] font-semibold uppercase hover:underline" style={{ color: '#C9922A' }}>
            ← Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link to="/" className="inline-block mb-6">
          <img src="/logo.png" alt="Selah Vida" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
        </Link>

        <Link to="/blog" className="inline-block text-xs tracking-[0.15em] font-semibold uppercase mb-6 hover:underline" style={{ color: '#0F3D3D' }}>
          ← Blog
        </Link>

        <article>
          <p className="text-xs tracking-wider uppercase mb-3" style={{ color: 'rgba(201,146,42,0.8)' }}>
            {article.date}
          </p>

          <h1 className="font-serif text-2xl md:text-3xl font-bold mb-4 leading-tight" style={{ color: '#0F3D3D' }}>
            {article.title}
          </h1>

          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 max-w-[40px]" style={{ backgroundColor: '#C9922A' }} />
            <span className="text-sm select-none" style={{ color: '#C9922A' }}>◆</span>
            <div className="h-px flex-1 max-w-[40px]" style={{ backgroundColor: '#C9922A' }} />
          </div>

          <div
            className="prose prose-sm max-w-none leading-relaxed"
            style={{ color: 'rgba(15,61,61,0.85)' }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        <div className="mt-12 pt-8" style={{ borderTop: '1px solid #E8E0D0' }}>
          <div className="text-center bg-white rounded-lg p-8" style={{ border: '1px solid #E8E0D0' }}>
            <p className="font-serif text-lg font-bold mb-3" style={{ color: '#0F3D3D' }}>
              Comenzá tu camino espiritual en Selah Vida
            </p>
            <p className="text-sm mb-5" style={{ color: 'rgba(15,61,61,0.7)' }}>
              Hablá con Rafael, tu acompañante espiritual disponible 24/7.
            </p>
            <Link
              to="/register"
              className="inline-block text-xs tracking-[0.15em] font-semibold uppercase px-8 py-3 rounded transition-all"
              style={{ backgroundColor: '#C9922A', color: '#FAF7F2' }}
            >
              Comenzá tu camino espiritual en Selah Vida
            </Link>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/blog" className="text-xs tracking-[0.15em] font-semibold uppercase hover:underline" style={{ color: '#0F3D3D' }}>
            ← Ver más artículos
          </Link>
        </div>
      </div>
    </div>
  );
}
