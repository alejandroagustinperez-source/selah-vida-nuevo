import { useAuth } from '../context/AuthContext';

export default function Music() {
  const { isPremium } = useAuth();

  if (!isPremium) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6" style={{background:'#FAF7F2'}}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5" style={{marginBottom:'16px'}}>
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <h2 className="font-serif text-xl font-bold" style={{fontFamily:"'Playfair Display',serif",color:'#0F3D3D',marginBottom:'8px'}}>Función exclusiva</h2>
        <p style={{color:'rgba(15,61,61,0.6)',fontSize:'14px',marginBottom:'0'}}>Música de Alabanza es exclusiva para usuarios Premium.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col px-4 sm:px-6 py-6 overflow-y-auto" style={{background:'#FAF7F2'}}>
      <div className="text-center mb-8">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.2" style={{display:'block',margin:'0 auto 8px'}}>
          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
        <h1 className="font-serif text-2xl font-bold" style={{fontFamily:"'Playfair Display',serif",color:'#0F3D3D',fontSize:'26px'}}>Música de Alabanza</h1>
        <p style={{color:'#6b6b6b',fontSize:'13px',marginTop:'4px'}}>La mejor música cristiana para acompañar tu momento con Dios</p>
        <div style={{width:'40px',height:'2px',background:'#C9922A',margin:'12px auto 0',opacity:0.6}} />
      </div>

      <div className="max-w-3xl mx-auto w-full">
        <div style={{background:'#fff',border:'1px solid #E8E0D0',borderRadius:'8px',padding:'8px',boxShadow:'0 4px 16px rgba(15,61,61,0.08)'}}>
          <div className="relative" style={{ padding: '56.25% 0 0 0' }}>
            <iframe
              src="https://www.youtube.com/embed/fHz2yRafi9s?autoplay=1&rel=0"
              title="Éxitos Cristianos - La Mejor Música Cristiana del Mundo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              style={{borderRadius:'6px'}}
            />
          </div>
        </div>

        <div style={{textAlign:'center',marginTop:'24px'}}>
          <blockquote style={{
            background:'#fff',borderLeft:'3px solid #C9922A',borderRadius:'0 6px 6px 0',
            padding:'16px 20px',maxWidth:'600px',margin:'0 auto',
            fontFamily:"'Playfair Display',serif",fontStyle:'italic',color:'#0F3D3D',fontSize:'16px',lineHeight:1.6
          }}>
            &ldquo;La alabanza y la adoración son el puente que conecta nuestro corazón con el corazón de Dios.&rdquo;
          </blockquote>
          <p style={{color:'#6b6b6b',fontSize:'13px',marginTop:'12px',textAlign:'center'}}>
            Deja que estas canciones llenen tu espíritu de paz y esperanza.
          </p>
        </div>
      </div>
    </div>
  );
}
