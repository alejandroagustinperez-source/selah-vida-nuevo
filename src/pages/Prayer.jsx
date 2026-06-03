import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import RafaelGuide from '../components/RafaelGuide';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const CATEGORIES = [
  { id: 'ansiedad', icon: '🕊️', label: 'Ansiedad y Paz', desc: 'Entregá tus cargas a Dios y encontralo descanso' },
  { id: 'sanidad', icon: '❤️', label: 'Sanidad', desc: 'Oramos por sanidad física, emocional y espiritual' },
  { id: 'familia', icon: '🏠', label: 'Familia', desc: 'Por nuestros hogares, padres e hijos' },
  { id: 'trabajo', icon: '💼', label: 'Trabajo y Finanzas', desc: 'Dios provee y guía en cada área' },
  { id: 'gratitud', icon: '☀️', label: 'Gratitud', desc: 'Un corazón agradecido honra a Dios' },
  { id: 'arrepentimiento', icon: '🔄', label: 'Arrepentimiento', desc: 'Volvé a Dios con corazón sincero' },
  { id: 'fe', icon: '✝️', label: 'Fe y Propósito', desc: 'Fortalece tu fe y caminá en propósito' },
];

export default function Prayer() {
  const { isPremium, user } = useAuth();
  const [screen, setScreen] = useState('categories');
  const [category, setCategory] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [prayerEnded, setPrayerEnded] = useState(false);
  const chatEnd = useRef(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const startPrayer = async (cat) => {
    setCategory(cat);
    setMessages([]);
    setPrayerEnded(false);
    setLoading(true);
    setScreen('prayer');

    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/prayer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category: cat.id, message: '', history: [] }),
      });
      if (!res.ok) {
        const data = await res.json();
        if (data.premiumRequired) { setScreen('categories'); return; }
        throw new Error(data.error || 'Error al iniciar la oración');
      }
      const data = await res.json();
      setMessages([{ role: 'assistant', content: data.response }]);
      if (data.isFinal) setPrayerEnded(true);
    } catch (err) {
      setMessages([{ role: 'assistant', content: 'Lo siento, hubo un error al iniciar la oración. Intentalo de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || prayerEnded) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const token = await getToken();
      const history = [...messages, { role: 'user', content: userMsg }];
      const res = await fetch(`${API_BASE}/prayer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category: category.id, message: userMsg, history }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      if (data.isFinal) setPrayerEnded(true);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Lo siento, hubo un error. Intentalo de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (!isPremium) {
    return (
      <>
        <div className="h-full flex flex-col items-center justify-center text-center px-6" style={{background:'#FAF7F2'}}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5" style={{marginBottom:'16px'}}>
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <h2 className="font-serif text-xl font-bold" style={{fontFamily:"'Playfair Display',serif",color:'#0F3D3D',marginBottom:'8px'}}>Función exclusiva</h2>
          <p style={{color:'rgba(15,61,61,0.6)',fontSize:'14px',marginBottom:'0'}}>Oración Guiada es exclusiva para usuarios Premium.</p>
        </div>
        <RafaelGuide sectionKey="prayer" message="La Oración Guiada te acompaña en 7 caminos de conexión con Dios 🙏 Elegí el tema que más resuene con lo que estás viviendo — ansiedad, sanidad, familia, trabajo, gratitud, arrepentimiento o fe." />
      </>
    );
  }

  const SVG_ICONS = {
    ansiedad: (<svg key="ansiedad" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><path d="M3 15c0 0 3-3 6-3s6 3 9 3"/><path d="M3 9c0 0 3 3 6 3s6-3 9-3"/><circle cx="12" cy="12" r="1"/></svg>),
    sanidad: (<svg key="sanidad" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>),
    familia: (<svg key="familia" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
    trabajo: (<svg key="trabajo" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>),
    gratitud: (<svg key="gratitud" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>),
    arrepentimiento: (<svg key="arrepentimiento" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>),
    fe: (<svg key="fe" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><line x1="12" y1="2" x2="12" y2="22"/><line x1="4" y1="8" x2="20" y2="8"/></svg>),
  };

  if (screen === 'categories') {
    return (
      <>
        <div className="h-full flex flex-col px-4 sm:px-6 py-6 overflow-y-auto" style={{background:'#FAF7F2'}}>
          <div className="text-center mb-8">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.2" style={{display:'block',margin:'0 auto 8px'}}>
              <path d="M18 11V7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4"/>
              <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2"/>
              <path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"/>
              <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
            </svg>
            <h1 className="font-serif text-2xl font-bold" style={{fontFamily:"'Playfair Display',serif",color:'#0F3D3D',fontSize:'26px'}}>Oración Guiada</h1>
            <p style={{color:'#6b6b6b',fontSize:'13px',marginTop:'4px'}}>Elegí un tema y dejá que Rafael guíe tu oración</p>
            <div style={{width:'40px',height:'2px',background:'#C9922A',margin:'12px auto 0',opacity:0.6}} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-auto w-full" style={{maxWidth:'700px',gap:'16px'}}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => startPrayer(cat)}
                className="text-left"
                style={{background:'#fff',border:'1px solid #E8E0D0',borderRadius:'6px',padding:'24px 20px',cursor:'pointer',transition:'border-color 0.2s,box-shadow 0.2s'}}
                onMouseEnter={e => {e.currentTarget.style.borderColor='#C9922A';e.currentTarget.style.boxShadow='0 4px 16px rgba(15,61,61,0.08)'}}
                onMouseLeave={e => {e.currentTarget.style.borderColor='#E8E0D0';e.currentTarget.style.boxShadow='none'}}
              >
                {SVG_ICONS[cat.id]}
                <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,color:'#0F3D3D',fontSize:'15px',marginTop:'12px',marginBottom:0}}>{cat.label}</h3>
                <p style={{color:'#6b6b6b',fontSize:'13px',lineHeight:1.5,marginTop:'6px',marginBottom:0}}>{cat.desc}</p>
              </button>
            ))}
          </div>
        </div>
        <RafaelGuide sectionKey="prayer" message="La Oración Guiada te acompaña en 7 caminos de conexión con Dios 🙏 Elegí el tema que más resuene con lo que estás viviendo — ansiedad, sanidad, familia, trabajo, gratitud, arrepentimiento o fe." />
      </>
    );
  }

  return (
    <>
    <div className="flex flex-col h-full" style={{background:'#FAF7F2'}}>
      {/* Header */}
      <div className="flex-shrink-0 relative px-4 sm:px-6 py-5" style={{background:'#0F3D3D'}}>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => { setScreen('categories'); setPrayerEnded(false); }}
            className="text-sm flex items-center gap-1" style={{color:'rgba(255,255,255,0.7)'}}
            onMouseEnter={e => {e.currentTarget.style.color='#fff'}}
            onMouseLeave={e => {e.currentTarget.style.color='rgba(255,255,255,0.7)'}}
          >
            &larr; Temas
          </button>
          <span className="text-xs px-3 py-1" style={{background:'rgba(255,255,255,0.15)',color:'#C9922A',borderRadius:'999px',fontWeight:500}}>
            {category?.icon} {category?.label}
          </span>
        </div>
        <h2 className="font-serif text-lg font-bold" style={{fontFamily:"'Playfair Display',serif",fontWeight:700,color:'#fff'}}>Orando por {category?.label?.toLowerCase()}</h2>
        <p style={{color:'rgba(255,255,255,0.65)',fontSize:'12px',marginTop:'2px'}}>Rafael te guía en oración</p>
      </div>

      {/* Messages - scrollable */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4" style={{background:'#FAF7F2',display:'flex',flexDirection:'column',gap:'16px'}}>
        {messages.map((msg, i) => (
          <div key={i} style={{display:'flex',justifyContent:msg.role==='user'?'flex-end':'flex-start'}}>
            <div style={{
              maxWidth:'85%',padding:'14px 18px',fontSize:'14px',lineHeight:1.6,
              borderRadius:msg.role==='user'?'14px 4px 14px 14px':'4px 14px 14px 14px',
              background:msg.role==='user'?'#0F3D3D':'#fff',
              color:msg.role==='user'?'#fff':'#0F3D3D',
              border:msg.role==='user'?'none':'1px solid #E8E0D0'
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{display:'flex',justifyContent:'flex-start'}}>
            <div style={{maxWidth:'85%',padding:'14px 18px',fontSize:'14px',background:'#fff',border:'1px solid #E8E0D0',borderRadius:'4px 14px 14px 14px',color:'rgba(15,61,61,0.5)'}}>
              <span style={{animation:'pulse 1.5s infinite'}}>Escribiendo...</span>
            </div>
          </div>
        )}

        {prayerEnded && (
          <div style={{textAlign:'center',paddingTop:'8px'}}>
            <button
              onClick={() => setScreen('categories')}
              style={{background:'#C9922A',color:'#fff',border:'none',padding:'10px 24px',borderRadius:'4px',fontSize:'14px',fontWeight:600,cursor:'pointer'}}
              onMouseEnter={e => {e.currentTarget.style.background='#B37D1E'}}
              onMouseLeave={e => {e.currentTarget.style.background='#C9922A'}}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{display:'inline',verticalAlign:'middle',marginRight:'6px',marginTop:'-2px'}}>
                <path d="M3 15c0 0 3-3 6-3s6 3 9 3"/><path d="M3 9c0 0 3 3 6 3s6-3 9-3"/><circle cx="12" cy="12" r="1"/>
              </svg>
              Nueva oración
            </button>
          </div>
        )}

        <div ref={chatEnd} />
      </div>

      {/* Input - flex-shrink-0 at bottom */}
      {!prayerEnded && (
        <div style={{borderTop:'1px solid #E8E0D0',background:'#fff',padding:'10px 12px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',maxWidth:'640px',margin:'0 auto'}}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu petición..."
              style={{
                flex:1,minWidth:0,padding:'10px 16px',borderRadius:'4px',border:'1px solid #E8E0D0',
                background:'#FAF7F2',fontSize:'16px',outline:'none',color:'#0F3D3D'
              }}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                background:input.trim()&&!loading?'#0F3D3D':'rgba(15,61,61,0.3)',
                color:'#fff',border:'none',padding:'10px 20px',borderRadius:'4px',
                fontSize:'14px',fontWeight:600,cursor:input.trim()&&!loading?'pointer':'default',
                whiteSpace:'nowrap'
              }}
              onMouseEnter={e => {if(!loading&&input.trim())e.currentTarget.style.background='#0a2e2e'}}
              onMouseLeave={e => {e.currentTarget.style.background=input.trim()&&!loading?'#0F3D3D':'rgba(15,61,61,0.3)'}}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
      <RafaelGuide sectionKey="prayer" message="La Oración Guiada te acompaña en 7 caminos de conexión con Dios 🙏 Elegí el tema que más resuene con lo que estás viviendo — ansiedad, sanidad, familia, trabajo, gratitud, arrepentimiento o fe." />
    </>
  );
}
