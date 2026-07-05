import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';

export default function KidsStory() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user: authUser, isPremium: authPremium } = useAuth();

  const isDev = import.meta.env.DEV;
  const user = isDev ? { id: 'dev-user', email: 'dev@test.com' } : authUser;
  const isPremium = isDev ? true : authPremium;

  const [story, setStory] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [restarting, setRestarting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadStory();
  }, [slug]);

  const loadStory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('kids_stories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      navigate('/ninos', { replace: true });
      return;
    }

    setStory(data);

    if (!data.is_free && !isPremium) {
      navigate('/ninos', { replace: true });
      return;
    }

    if (user) {
      const { data: prog } = await supabase
        .from('kids_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('story_id', data.id)
        .maybeSingle();

      if (prog) {
        setProgress(prog);
        setCurrentNodeId(prog.current_node);
        setCompleted(prog.completed);
      } else {
        setCurrentNodeId(null);
      }
    } else {
      setCurrentNodeId(null);
    }

    setLoading(false);
  };

  const totalPages = story?.nodes ? new Set(story.nodes.map((n) => n.id)).size : 0;

  const visibleNodes = story?.nodes || [];
  const sortedNodeIds = visibleNodes.map((n) => n.id);
  const currentIndex = currentNodeId ? sortedNodeIds.indexOf(currentNodeId) + 1 : 0;

  const startStory = () => {
    const firstNode = story.nodes[0];
    if (firstNode) {
      setCurrentNodeId(firstNode.id);
      setCompleted(false);
      setRestarting(false);
      saveProgress(firstNode.id);
    }
  };

  const restartStory = () => {
    setRestarting(true);
    startStory();
  };

  const saveProgress = async (nodeId) => {
    if (!user || !story) return;
    await supabase
      .from('kids_progress')
      .upsert({
        user_id: user.id,
        story_id: story.id,
        current_node: nodeId,
        completed: false,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id, story_id' });
  };

  const handleChoice = async (goto) => {
    const targetNode = story.nodes.find((n) => n.id === goto);
    if (!targetNode) return;

    setCurrentNodeId(goto);

    if (targetNode.end) {
      setCompleted(true);
      if (user && story) {
        await supabase
          .from('kids_progress')
          .upsert({
            user_id: user.id,
            story_id: story.id,
            current_node: goto,
            completed: true,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id, story_id' });
      }
    } else {
      saveProgress(goto);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="min-h-screen pt-28 pb-20 px-6" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="max-w-3xl mx-auto flex justify-center py-20">
          <div className="animate-pulse text-sm" style={{ color: '#C9922A' }}>Cargando historia…</div>
        </div>
      </section>
    );
  }

  if (!story) return null;

  const currentNode = story.nodes.find((n) => n.id === currentNodeId);

  return (
    <section className="min-h-screen pt-28 pb-20 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-[620px] mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/ninos" className="text-[10px] tracking-[0.2em] uppercase font-semibold transition-opacity hover:opacity-70" style={{ color: '#C9922A' }}>
            ← Volver a historias
          </Link>
        </div>

        {/* Start screen */}
        {!currentNode && !completed && (
          <div className="text-center py-12">
            <div className="mb-8">
              {story.cover_image_url ? (
                <div className="inline-block p-2" style={{ backgroundColor: '#FAF7F2', border: '1px solid #C9922A', borderRadius: '12px' }}>
                  <img src={story.cover_image_url} alt={story.title} className="w-full max-w-sm mx-auto" style={{ borderRadius: '8px', maxHeight: '280px', objectFit: 'cover' }} />
                </div>
              ) : (
                <div className="w-24 h-24 mx-auto flex items-center justify-center" style={{ backgroundColor: '#0F3D3D', borderRadius: '50%' }}>
                  <span className="text-4xl">📖</span>
                </div>
              )}
            </div>

            <p className="text-xs tracking-[0.2em] font-semibold mb-3" style={{ color: '#C9922A' }}>SELAH KIDS</p>
            <h1 className="font-serif text-2xl md:text-3xl font-bold mb-4" style={{ color: '#0F3D3D' }}>
              {story.title}
            </h1>
            <p className="text-sm italic mb-10" style={{ color: 'rgba(15,61,61,0.55)', fontFamily: "'Lora', Georgia, serif" }}>
              Elegí tu propia aventura bíblica
            </p>

            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="h-px flex-1 max-w-[40px]" style={{ backgroundColor: '#C9922A' }} />
              <span className="text-xs select-none" style={{ color: '#C9922A' }}>◇</span>
              <div className="h-px flex-1 max-w-[40px]" style={{ backgroundColor: '#C9922A' }} />
            </div>

            {progress && !progress.completed ? (
              <div className="flex flex-col items-center gap-4">
                <button onClick={startStory}
                  className="px-8 py-3 text-xs tracking-[0.2em] font-semibold uppercase transition-all hover:opacity-80"
                  style={{ backgroundColor: '#C9922A', color: '#0F3D3D', borderRadius: '0' }}>
                  Continuar aventura
                </button>
                <button onClick={restartStory}
                  className="text-[11px] underline transition-opacity hover:opacity-70"
                  style={{ color: 'rgba(15,61,61,0.45)' }}>
                  Empezar de nuevo
                </button>
              </div>
            ) : (
              <button onClick={startStory}
                className="px-8 py-3 text-xs tracking-[0.2em] font-semibold uppercase transition-all hover:opacity-80"
                style={{ backgroundColor: '#C9922A', color: '#0F3D3D', borderRadius: '0' }}>
                {restarting ? 'Jugar de nuevo' : 'Comenzar aventura'}
              </button>
            )}
          </div>
        )}

        {/* End screen */}
        {completed && (
          <div className="text-center py-12">
            <div className="text-5xl mb-6">🌟</div>
            <p className="text-xs tracking-[0.2em] font-semibold mb-3" style={{ color: '#C9922A' }}>SELAH KIDS</p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4" style={{ color: '#0F3D3D' }}>
              ¡Completaste la aventura!
            </h2>
            <p className="text-sm italic mb-10" style={{ color: 'rgba(15,61,61,0.55)', fontFamily: "'Lora', Georgia, serif" }}>
              Gracias por explorar esta historia bíblica con nosotros
            </p>
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="h-px flex-1 max-w-[40px]" style={{ backgroundColor: '#C9922A' }} />
              <span className="text-xs select-none" style={{ color: '#C9922A' }}>◇</span>
              <div className="h-px flex-1 max-w-[40px]" style={{ backgroundColor: '#C9922A' }} />
            </div>
            <div className="flex flex-col items-center gap-4">
              <button onClick={restartStory}
                className="px-8 py-3 text-xs tracking-[0.2em] font-semibold uppercase transition-all hover:opacity-80"
                style={{ backgroundColor: '#C9922A', color: '#0F3D3D', borderRadius: '0' }}>
                Jugar de nuevo
              </button>
              <Link to="/ninos"
                className="text-[11px] underline transition-opacity hover:opacity-70"
                style={{ color: 'rgba(15,61,61,0.45)' }}>
                Ver más historias
              </Link>
            </div>
          </div>
        )}

        {/* Node screen */}
        {currentNode && !completed && (
          <div>
            {/* Progress bar */}
            {currentIndex > 0 && totalPages > 0 && (
              <div className="mb-5">
                <div style={{ height: '3px', backgroundColor: '#EFE7D3', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(currentIndex / totalPages) * 100}%`, backgroundColor: '#C9922A', borderRadius: '2px', transition: 'width 0.3s ease' }} />
                </div>
              </div>
            )}

            {/* Chapter + page (same line) */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[11px] tracking-[0.2em] font-bold uppercase" style={{ color: '#C9922A' }}>
                {currentNode.chapter}
              </p>
              {currentIndex > 0 && totalPages > 0 && (
                <p className="text-[11px] italic" style={{ color: '#8FAEA9', fontFamily: "'Lora', Georgia, serif" }}>
                  Página {currentIndex} de {totalPages}
                </p>
              )}
            </div>

            {/* Framed image */}
            {currentNode.image && (
              <div className="mb-8" style={{ backgroundColor: '#FAF7F2', border: '1px solid #C9922A', borderRadius: '12px', padding: '6px' }}>
                <img
                  src={currentNode.image}
                  alt=""
                  className="w-full"
                  style={{ borderRadius: '8px', maxHeight: '320px', objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Text in Lora */}
            <div className="mb-8 px-2">
              <p className="text-base leading-relaxed" style={{ color: '#3D3D3D', fontFamily: "'Lora', Georgia, serif", lineHeight: '1.7' }}>
                {currentNode.text}
              </p>
            </div>

            {/* Choices */}
            {currentNode.choices && currentNode.choices.length > 0 && (
              <div className="mb-12">
                {/* "¿Qué hacés?" separator */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px" style={{ backgroundColor: '#E8DFC8' }} />
                  <span className="text-[11px] tracking-[0.2em] font-bold uppercase shrink-0" style={{ color: '#8B1A1A' }}>
                    ¿Qué hacés?
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: '#E8DFC8' }} />
                </div>

                <div className="flex flex-col gap-3">
                  {currentNode.choices.map((choice, idx) => {
                    const isContinue = currentNode.choices.length === 1 && !choice.letter;
                    return isContinue ? (
                      <button
                        key={idx}
                        onClick={() => handleChoice(choice.goto)}
                        className="w-full text-center px-8 py-4 text-xs tracking-[0.2em] font-semibold uppercase"
                        style={{
                          backgroundColor: '#0F3D3D',
                          color: '#FAF7F2',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: '0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
                        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        {choice.text}
                      </button>
                    ) : (
                      <button
                        key={idx}
                        onClick={() => handleChoice(choice.goto)}
                        className="w-full text-left"
                        style={{
                          backgroundColor: '#FDFBF7',
                          border: '1px solid #E8DFC8',
                          borderRadius: '10px',
                          padding: '14px 18px',
                          cursor: 'pointer',
                          transition: '0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F5EEDD';
                          e.currentTarget.style.borderColor = '#C9922A';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FDFBF7';
                          e.currentTarget.style.borderColor = '#E8DFC8';
                        }}
                        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
                        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="inline-flex items-center justify-center shrink-0 font-serif font-bold text-sm"
                            style={{
                              backgroundColor: '#8B1A1A',
                              color: '#FFFFFF',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                            }}
                          >
                            {choice.letter}
                          </span>
                          <span className="text-sm leading-relaxed" style={{ color: '#0F3D3D', fontFamily: "'Lora', Georgia, serif", lineHeight: '1.6' }}>
                            {choice.text}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
