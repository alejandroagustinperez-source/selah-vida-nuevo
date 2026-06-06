import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import articles from '../data/blog';

export default function Blog() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link to="/" className="inline-block mb-6">
          <img src="/logo.png" alt="Selah Vida" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
        </Link>

        <div className="text-center mb-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: '#0F3D3D' }}>
            Blog
          </h1>
        </div>

        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: '#C9922A' }} />
          <span className="text-sm select-none" style={{ color: '#C9922A' }}>◆</span>
          <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: '#C9922A' }} />
        </div>

        <p className="text-sm md:text-base text-center mb-12 leading-relaxed" style={{ color: 'rgba(15,61,61,0.7)' }}>
          Reflexiones, oraciones y enseñanzas para fortalecer tu vida espiritual.
        </p>

        {articles.length === 0 ? (
          <p className="text-center text-sm" style={{ color: 'rgba(15,61,61,0.5)' }}>Próximamente nuevos artículos.</p>
        ) : (
          <div className="grid gap-8">
            {articles.map((a) => (
              <article
                key={a.slug}
                className="bg-white rounded-lg p-6 md:p-8 transition-shadow hover:shadow-md"
                style={{ border: '1px solid #E8E0D0' }}
              >
                <p className="text-xs tracking-wider uppercase mb-2" style={{ color: 'rgba(201,146,42,0.8)' }}>
                  {a.date}
                </p>
                <h2 className="font-serif text-xl md:text-2xl font-bold mb-3" style={{ color: '#0F3D3D' }}>
                  <Link to={`/blog/${a.slug}`} className="hover:underline" style={{ color: '#0F3D3D' }}>
                    {a.title}
                  </Link>
                </h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(15,61,61,0.7)' }}>
                  {a.excerpt}
                </p>
                <Link
                  to={`/blog/${a.slug}`}
                  className="inline-block text-xs tracking-[0.15em] font-semibold uppercase px-5 py-2 rounded transition-all"
                  style={{ backgroundColor: '#C9922A', color: '#FAF7F2' }}
                >
                  Leer más
                </Link>
              </article>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/" className="text-xs tracking-[0.15em] font-semibold uppercase hover:underline" style={{ color: '#0F3D3D' }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
