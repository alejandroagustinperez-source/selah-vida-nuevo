import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

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
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Error');
      }
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
    <section className="py-16 md:py-20 px-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-4">
          <span className="font-serif font-bold text-4xl md:text-5xl" style={{ color: '#8B1A1A' }}>I</span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold mt-2" style={{ color: '#0F3D3D' }}>
            Contáctanos
          </h1>
        </div>

        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: '#C9922A' }} />
          <span className="text-sm select-none" style={{ color: '#C9922A' }}>◆</span>
          <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: '#C9922A' }} />
        </div>

        <p className="text-sm md:text-base text-center mb-10 leading-relaxed" style={{ color: 'rgba(15,61,61,0.7)' }}>
          Estamos aquí para escucharte. Escribinos y te responderemos a la brevedad.
        </p>

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
                className="w-full py-2.5 bg-transparent outline-none text-sm resize-y transition-colors"
                style={{ color: '#0F3D3D', borderBottom: '1px solid #C9922A' }}
                onFocus={(e) => e.target.style.borderBottomColor = '#0F3D3D'}
                onBlur={(e) => e.target.style.borderBottomColor = '#C9922A'}
              />
            </div>

            <button
              type="submit" disabled={sending}
              className="w-full border-2 border-[#C9922A] text-[#0F3D3D] px-10 py-3.5 rounded-full text-xs tracking-[0.15em] font-semibold uppercase hover:bg-[#C9922A] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
