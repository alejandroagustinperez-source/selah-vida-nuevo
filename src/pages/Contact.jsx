import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SUBJECTS = [
  'Soporte técnico',
  'Consulta sobre Premium',
  'Sugerencia',
  'Otro',
];

export default function Contact() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const text = `Nombre: ${encodeURIComponent(form.name)}%0AEmail: ${encodeURIComponent(form.email)}%0AAsunto: ${encodeURIComponent(form.subject)}%0AMensaje: ${encodeURIComponent(form.message)}`;
      window.open(`https://wa.me/5492665066606?text=${text}`, '_blank');
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="mx-auto w-full flex flex-col md:flex-row" style={{
        maxWidth: '1000px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
      }}>
        {/* Left column — dark */}
        <div className="w-full md:w-[45%] flex flex-col justify-between p-10 md:p-12" style={{ backgroundColor: '#1C3D2E', minHeight: '500px' }}>
          <div>
            <span className="font-serif font-bold" style={{ color: '#C9922A', fontSize: '3rem' }}>I</span>
            <h1 className="font-serif font-bold mt-2 mb-5" style={{ color: '#FFFFFF', fontSize: '2rem' }}>
              ¿Necesitás hablar?
            </h1>
            <p className="leading-relaxed mb-8" style={{ color: 'rgba(250,248,243,0.85)', fontSize: '1rem' }}>
              Estamos aquí para escucharte. Sin juicios, sin prisas. Escribinos y te responderemos a la brevedad.
            </p>

            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1" style={{ backgroundColor: '#C9922A' }} />
              <span className="text-sm select-none" style={{ color: '#C9922A' }}>◆</span>
              <div className="h-px flex-1" style={{ backgroundColor: '#C9922A' }} />
            </div>

            <p className="italic leading-relaxed mb-1" style={{ color: 'rgba(250,248,243,0.85)', fontSize: '0.9rem' }}>
              "Echad toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros."
            </p>
            <p className="text-xs" style={{ color: '#C9922A' }}>— 1 Pedro 5:7</p>
          </div>

          <div className="mt-10">
            <a
              href="https://wa.me/5492665066606"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
              style={{ color: '#C9922A' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contactanos por WhatsApp
            </a>
          </div>
        </div>

        {/* Right column — form */}
        <div className="w-full md:w-[55%] p-10 md:p-12" style={{ backgroundColor: '#FAF8F3', minHeight: '500px' }}>
          {status === 'success' ? (
            <div className="text-center py-10">
              <p className="font-serif text-xl font-bold mb-2" style={{ color: '#0F3D3D' }}>¡Mensaje enviado!</p>
              <p className="text-sm mb-6" style={{ color: 'rgba(15,61,61,0.6)' }}>Te responderemos pronto</p>
              <Link
                to="/"
                className="inline-block border-2 border-[#C9922A] text-[#0F3D3D] px-8 py-3 rounded-full text-xs tracking-[0.15em] font-semibold uppercase hover:bg-[#C9922A] hover:text-white transition-all"
              >
                Volver al inicio
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {status === 'error' && (
                <div className="text-red-600 text-sm text-center mb-4">Hubo un error, intentá de nuevo</div>
              )}

              <div className="mb-6">
                <label className="block text-xs tracking-[0.15em] font-semibold uppercase mb-1" style={{ color: '#C9922A' }}>
                  Nombre
                </label>
                <input
                  type="text" name="name" required value={form.name} onChange={handleChange}
                  className="w-full py-2.5 bg-transparent outline-none text-sm transition-colors"
                  style={{ color: '#0F3D3D', borderBottom: '1px solid #C9922A' }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#0F3D3D'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#C9922A'}
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs tracking-[0.15em] font-semibold uppercase mb-1" style={{ color: '#C9922A' }}>
                  Email
                </label>
                <input
                  type="email" name="email" required value={form.email} onChange={handleChange}
                  className="w-full py-2.5 bg-transparent outline-none text-sm transition-colors"
                  style={{ color: '#0F3D3D', borderBottom: '1px solid #C9922A' }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#0F3D3D'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#C9922A'}
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs tracking-[0.15em] font-semibold uppercase mb-1" style={{ color: '#C9922A' }}>
                  Asunto
                </label>
                <select
                  name="subject" required value={form.subject} onChange={handleChange}
                  className="w-full py-2.5 bg-transparent outline-none text-sm transition-colors appearance-none"
                  style={{ color: '#0F3D3D', borderBottom: '1px solid #C9922A' }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#0F3D3D'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#C9922A'}
                >
                  <option value="" disabled style={{ color: 'rgba(15,61,61,0.4)' }}>Seleccioná un asunto</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s} style={{ color: '#0F3D3D' }}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="mb-8">
                <label className="block text-xs tracking-[0.15em] font-semibold uppercase mb-1" style={{ color: '#C9922A' }}>
                  Mensaje
                </label>
                <textarea
                  name="message" required value={form.message} onChange={handleChange} rows={4}
                  className="w-full bg-transparent outline-none text-sm resize-y transition-colors"
                  style={{ color: '#0F3D3D', borderBottom: '1px solid #C9922A', padding: '10px 0', minHeight: '120px' }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#0F3D3D'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#C9922A'}
                />
              </div>

              <button
                type="submit" disabled={sending}
                className="w-full text-xs tracking-[0.15em] font-semibold uppercase px-10 py-3.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#1C3D2E',
                  color: '#C9922A',
                  border: 'none',
                  cursor: sending ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => { if (!sending) e.currentTarget.style.backgroundColor = '#0F3D3D' }}
                onMouseLeave={(e) => { if (!sending) e.currentTarget.style.backgroundColor = '#1C3D2E' }}
              >
                {sending ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
