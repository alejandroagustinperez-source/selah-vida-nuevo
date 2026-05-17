import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token requerido' });
    }
    const token = auth.split(' ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return res.status(401).json({ error: 'Usuario no válido' });
    }

    const { event_type, metadata, country, city } = req.body || {};
    if (!event_type) {
      return res.status(400).json({ error: 'event_type requerido' });
    }

    // Insert analytics event
    await supabase
      .from('analytics')
      .insert({ user_id: user.id, event_type, metadata: metadata || {} });

    // Update location if provided
    if (country || city) {
      const updates = {};
      if (country) updates.country = country;
      if (city) updates.city = city;
      updates.last_location_update = new Date().toISOString();
      await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('Analytics error:', err?.message || err);
    return res.status(500).json({ error: 'Error al registrar evento' });
  }
}
