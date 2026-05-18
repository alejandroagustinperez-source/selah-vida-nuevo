import { useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const SUBJECTS = [
  'Soporte técnico',
  'Consulta sobre Premium',
  'Sugerencia',
  'Otro',
];

export default function Contact() {
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
      if (!res.ok) throw new Error('Error');
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <Link to="/" className="text-4xl inline-block mb-4">✉️</Link>
          <h1 className="font-serif text-3xl font-bold text-dark-blue">Contáctanos</h1>
          <p className="text-dark-blue/50 text-sm mt-2">Estamos aquí para ayudarte</p>
        </div>

        <div className="max-w-[600px] mx-auto">
          {status === 'success' ? (
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gold/10 text-center">
              <div className="text-5xl mb-4">🙏</div>
              <h2 className="font-serif text-xl font-bold text-dark-blue mb-2">¡Mensaje enviado!</h2>
              <p className="text-dark-blue/60 text-sm mb-6">Te responderemos pronto</p>
              <Link to="/" className="inline-block bg-gold text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-gold-dark transition-colors">
                Volver al inicio
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gold/10 space-y-5">
              {status === 'error' && (
                <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 text-center">Hubo un error, intenta de nuevo</div>
              )}

              <div>
                <label className="block text-sm font-medium text-dark-blue/70 mb-1">Nombre completo</label>
                <input
                  type="text" name="name" required value={form.name} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-gold/40 text-dark-blue"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-blue/70 mb-1">Email</label>
                <input
                  type="email" name="email" required value={form.email} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-gold/40 text-dark-blue"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-blue/70 mb-1">Asunto</label>
                <select
                  name="subject" required value={form.subject} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-gold/40 text-dark-blue appearance-none"
                >
                  <option value="" disabled>Seleccioná un asunto</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-blue/70 mb-1">Mensaje</label>
                <textarea
                  name="message" required value={form.message} onChange={handleChange} rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-gold/40 text-dark-blue resize-y"
                  placeholder="Escribí tu mensaje aquí..."
                />
              </div>

              <button
                type="submit" disabled={sending}
                className="w-full bg-gold text-white py-3.5 rounded-full font-semibold text-sm hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          )}

          <div className="text-center mt-8">
            <Link to="/" className="text-gold font-medium hover:underline text-sm">← Volver al inicio</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
