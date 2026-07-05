import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';

const ADMIN_EMAIL = 'alejandro.agustin.perez@gmail.com';

export default function AdminKids() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    cover_image_url: '',
    is_free: false,
    nodes: '',
  });

  const isDev = import.meta.env.DEV;

  useEffect(() => {
    if (isDev) { loadStories(); return; }
    if (!user) return;
    if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
      navigate('/chat', { replace: true });
      return;
    }
    loadStories();
  }, [user]);

  const loadStories = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('kids_stories')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setStories(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetForm = () => {
    setForm({ title: '', slug: '', cover_image_url: '', is_free: false, nodes: '' });
    setEditingId(null);
  };

  const editStory = (story) => {
    setForm({
      title: story.title,
      slug: story.slug,
      cover_image_url: story.cover_image_url || '',
      is_free: story.is_free,
      nodes: JSON.stringify(story.nodes, null, 2),
    });
    setEditingId(story.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let nodes;
      try {
        nodes = JSON.parse(form.nodes);
      } catch {
        alert('El JSON de nodes no es válido. Revisá el formato.');
        setSaving(false);
        return;
      }

      const payload = {
        title: form.title,
        slug: form.slug,
        cover_image_url: form.cover_image_url || null,
        is_free: form.is_free,
        nodes,
      };

      if (editingId) {
        const { error } = await supabase
          .from('kids_stories')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('kids_stories')
          .insert(payload);
        if (error) throw error;
      }

      resetForm();
      loadStories();
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta historia definitivamente?')) return;
    const { error } = await supabase.from('kids_stories').delete().eq('id', id);
    if (error) {
      alert('Error al eliminar: ' + error.message);
    } else {
      loadStories();
    }
  };

  if (!isDev && (!user || user.email?.toLowerCase() !== ADMIN_EMAIL)) return null;

  return (
    <div className="h-full overflow-y-auto" style={{ background: '#1a1a2e' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white font-serif">📖 Selah Kids — Admin</h1>
          <p className="text-xs text-gray-500 mt-0.5">Gestioná las historias bíblicas interactivas</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="rounded-xl bg-[#16213e] border border-[#1e2d4a] p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">
            {editingId ? 'Editar historia' : 'Nueva historia'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Título</label>
              <input
                type="text" name="title" required value={form.title} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg text-sm bg-[#0d1b2a] border border-[#1e2d4a] text-white outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Slug</label>
              <input
                type="text" name="slug" required value={form.slug} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg text-sm bg-[#0d1b2a] border border-[#1e2d4a] text-white outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">URL de portada</label>
            <input
              type="text" name="cover_image_url" value={form.cover_image_url} onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg text-sm bg-[#0d1b2a] border border-[#1e2d4a] text-white outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox" name="is_free" id="is_free" checked={form.is_free} onChange={handleChange}
              className="rounded"
            />
            <label htmlFor="is_free" className="text-xs text-gray-400">Historia gratuita (sin Premium)</label>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Nodes (JSON)</label>
            <textarea
              name="nodes" required value={form.nodes} onChange={handleChange} rows={12}
              className="w-full px-3 py-2 rounded-lg text-xs font-mono bg-[#0d1b2a] border border-[#1e2d4a] text-white outline-none focus:border-gold transition-colors resize-y"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit" disabled={saving}
              className="px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider disabled:opacity-50 transition-colors"
              style={{ backgroundColor: '#C9A84C', color: '#0d1b2a' }}
            >
              {saving ? 'Guardando…' : editingId ? 'Actualizar' : 'Guardar'}
            </button>
            {editingId && (
              <button
                type="button" onClick={resetForm}
                className="px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                style={{ backgroundColor: '#2a3d5e', color: '#aaa' }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* List */}
        <div className="rounded-xl bg-[#16213e] border border-[#1e2d4a] p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Historias cargadas</h2>
          {loading ? (
            <div className="text-xs text-gray-500 animate-pulse">Cargando…</div>
          ) : stories.length === 0 ? (
            <div className="text-xs text-gray-500">No hay historias todavía</div>
          ) : (
            <div className="space-y-2">
              {stories.map((s) => (
                <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-lg text-xs"
                  style={{ backgroundColor: '#0d1b2a', border: '1px solid #1e2d4a' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-base">{s.is_free ? '📖' : '🔒'}</span>
                    <div>
                      <span className="text-white font-medium">{s.title}</span>
                      <span className="text-gray-500 ml-2">/ninos/{s.slug}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editStory(s)}
                      className="px-3 py-1 rounded text-[10px] font-semibold uppercase tracking-wider transition-colors"
                      style={{ backgroundColor: '#1e2d4a', color: '#C9A84C' }}>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(s.id)}
                      className="px-3 py-1 rounded text-[10px] font-semibold uppercase tracking-wider transition-colors"
                      style={{ backgroundColor: '#4a1e1e', color: '#ff6b6b' }}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
