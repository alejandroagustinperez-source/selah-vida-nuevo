import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import articles from '../data/blog';

export default function BlogArticle() {
  const { slug } = useParams();
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

          <style>{`
            .article-content h2 {
              font-family: 'Playfair Display', serif;
              color: #0F3D3D;
              font-size: 1.4rem;
              margin-top: 40px;
              margin-bottom: 16px;
            }
            .article-content h2::after {
              content: '◆';
              display: block;
              color: #C9922A;
              font-size: 0.8rem;
              margin-top: 8px;
            }
            .article-content .section-divider {
              display: block;
              color: #C9922A;
              text-align: center;
              font-size: 0.8rem;
              margin: 8px 0;
            }
            .article-content blockquote.bible-quote {
              border-left: 3px solid #C9922A;
              background: #F0EAE0;
              font-style: italic;
              padding: 16px 20px;
              margin: 24px 0;
            }
            .article-content .prayer-block {
              background: #0F3D3D;
              color: #FAF7F2;
              padding: 32px;
              text-align: center;
              border-radius: 4px;
              margin: 32px 0;
              font-style: italic;
              line-height: 1.8;
            }
            .article-content .key-verses {
              display: flex;
              flex-wrap: wrap;
              gap: 12px;
              margin: 24px 0;
            }
            .article-content .verse-card {
              border: 1px solid #C9922A;
              padding: 12px 16px;
              background: #FAF7F2;
              font-size: 0.85rem;
              color: #0F3D3D;
              max-width: 300px;
            }
            .article-content p {
              margin-bottom: 16px;
              line-height: 1.8;
            }
            .article-content strong {
              color: #0F3D3D;
            }
          `}</style>
          <div
            className="article-content"
            style={{ color: 'rgba(15,61,61,0.85)', fontSize: '0.95rem' }}
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
