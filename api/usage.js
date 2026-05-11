import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

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

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    let messagesCount = profile?.messages_count ?? 0;
    let isPremium = profile?.is_premium ?? false;
    const premiumUntil = profile?.premium_until ?? null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastReset = profile?.last_message_reset ? new Date(profile.last_message_reset) : null;

    if (!lastReset || lastReset < today) {
      messagesCount = 0;
      if (profile) {
        await supabase
          .from('profiles')
          .update({ messages_count: 0, last_message_reset: today.toISOString() })
          .eq('id', user.id);
      }
    }

    return res.json({ messagesCount, limit: 20, isPremium, premiumUntil });
  } catch (err) {
    console.error('Usage API error:', err.message || err);
    return res.status(500).json({ error: 'Error al obtener uso' });
  }
}
