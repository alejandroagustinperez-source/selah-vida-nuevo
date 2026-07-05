import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Kids() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadStories();
  }, []);

  const loadStories = async () => {
    const { data, error } = await supabase
      .from('kids_stories')
      .select('id, slug, title, cover_image_url, is_free, nodes')
      .order('created_at', { ascending: false });
    if (!error && data) setStories(data);
    setLoading(false);
  };

  const totalNodes = (nodes) => {
    if (!Array.isArray(nodes)) return 0;
    return new Set(nodes.map((n) => n.id)).size;
  };

  return (
    <section className="min-h-screen pt-28 pb-20 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.2em] font-semibold mb-3" style={{ color: '#C9922A' }}>SELAH VIDA</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: '#0F3D3D' }}>
            Selah Kids
          </h1>
          <p className="mt-3 text-sm md:text-base italic" style={{ color: 'rgba(15,61,61,0.65)', fontFamily: "'Lora', Georgia, serif" }}>
            Aventuras bíblicas interactivas para chicos de 6 a 9 años
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: '#C9922A' }} />
            <span className="text-sm select-none" style={{ color: '#C9922A' }}>◆</span>
            <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: '#C9922A' }} />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse text-sm" style={{ color: '#C9922A' }}>Cargando historias…</div>
          </div>
        ) : (
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {stories.map((s) => (
              <StoryCard key={s.id} story={s} totalPages={totalNodes(s.nodes)} />
            ))}
            <PlaceholderCard />
          </div>
        )}
      </div>
    </section>
  );
}

function StoryCard({ story, totalPages }) {
  return (
    <Link
      to={`/ninos/${story.slug}`}
      className="group block overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E8DFC8',
        borderRadius: '12px',
      }}
    >
      <div className="relative" style={{ height: '150px', overflow: 'hidden' }}>
        {story.cover_image_url ? (
          <img
            src={story.cover_image_url}
            alt={story.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#0F3D3D' }}>
            <span className="text-4xl">📖</span>
          </div>
        )}

        {/* Badge */}
        <span
          className="absolute top-2 left-2 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: story.is_free ? '#0F3D3D' : '#C9922A',
            color: story.is_free ? '#FAF7F2' : '#0F3D3D',
            borderRadius: '4px',
          }}
        >
          {story.is_free ? 'GRATIS' : 'PREMIUM'}
        </span>

        {/* Premium overlay */}
        {!story.is_free && (
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(15,61,61,0.75)' }}
          >
            <span className="text-3xl">🔒</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#C9922A' }}>
          {totalPages} páginas
        </p>
        <h3 className="font-serif text-base font-bold leading-tight" style={{ color: '#0F3D3D' }}>
          {story.title}
        </h3>
        <p className="mt-1.5 text-xs italic leading-relaxed" style={{ color: 'rgba(15,61,61,0.55)', fontFamily: "'Lora', Georgia, serif" }}>
          Una aventura bíblica interactiva
        </p>

        <div className="h-px w-full my-3" style={{ backgroundColor: '#E8DFC8' }} />

        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px]" style={{ color: 'rgba(15,61,61,0.45)' }}>
            {totalPages} página{totalPages !== 1 ? 's' : ''}
          </span>
          <span className="text-[11px] font-semibold transition-colors"
            style={{ color: story.is_free ? '#8B1A1A' : '#C9922A' }}>
            {story.is_free ? 'Jugar →' : 'Desbloquear'}
          </span>
        </div>
      </div>
    </Link>
  );
}

function PlaceholderCard() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 text-center p-8"
      style={{
        border: '2px dashed #E8DFC8',
        borderRadius: '12px',
        minHeight: '320px',
        backgroundColor: 'transparent',
      }}
    >
      <span className="text-3xl" style={{ color: '#C9922A' }}>+</span>
      <div>
        <p className="font-serif text-sm font-bold" style={{ color: '#0F3D3D' }}>Próximamente</p>
        <p className="text-xs italic mt-1" style={{ color: 'rgba(15,61,61,0.45)', fontFamily: "'Lora', Georgia, serif" }}>
          Más aventuras están siendo creadas
        </p>
      </div>
    </div>
  );
}
