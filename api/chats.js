import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function getUser(token) {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  const token = auth.split(' ')[1];
  const user = await getUser(token);
  if (!user) return res.status(401).json({ error: 'Usuario no válido' });

  // GET /api/chats - list user's chats (max 10 recent)
  // GET /api/chats?id=xxx - get single chat
  if (req.method === 'GET') {
    try {
      if (req.query?.id) {
        const { data, error } = await supabase
          .from('chats')
          .select('*')
          .eq('id', req.query.id)
          .eq('user_id', user.id)
          .single();
        if (error) return res.status(404).json({ error: 'Chat no encontrado' });
        return res.json(data);
      }
      const { data, error } = await supabase
        .from('chats')
        .select('id, title, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(10);
      if (error) return res.status(500).json({ error: 'Error al obtener chats' });
      return res.json(data || []);
    } catch (err) {
      return res.status(500).json({ error: err?.message || 'Error al obtener chats' });
    }
  }

  // POST /api/chats - create new chat
  if (req.method === 'POST') {
    try {
      const { title, messages } = req.body || {};
      const { data, error } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          title: title || 'Nueva conversación',
          messages: messages || [],
        })
        .select()
        .single();
      if (error) return res.status(500).json({ error: 'Error al crear chat' });
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err?.message || 'Error al crear chat' });
    }
  }

  // PUT /api/chats - update chat (messages, title)
  if (req.method === 'PUT') {
    try {
      const { id, title, messages } = req.body || {};
      if (!id) return res.status(400).json({ error: 'ID de chat requerido' });

      const updates = { updated_at: new Date().toISOString() };
      if (title !== undefined) updates.title = title;
      if (messages !== undefined) updates.messages = messages;

      const { data, error } = await supabase
        .from('chats')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      if (error) return res.status(500).json({ error: 'Error al actualizar chat' });
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err?.message || 'Error al actualizar chat' });
    }
  }

  // DELETE /api/chats?id=xxx - delete chat
  if (req.method === 'DELETE') {
    try {
      if (!req.query?.id) return res.status(400).json({ error: 'ID de chat requerido' });
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', req.query.id)
        .eq('user_id', user.id);
      if (error) return res.status(500).json({ error: 'Error al eliminar chat' });
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err?.message || 'Error al eliminar chat' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
