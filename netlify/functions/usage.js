import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const auth = event.headers.authorization || event.headers.Authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Token requerido' }) };
    }
    const token = auth.split(' ')[1];

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Usuario no válido' }) };
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ messagesCount, limit: 20, isPremium, premiumUntil }),
    };
  } catch (err) {
    console.error('Usage function error:', err.message || err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error al obtener uso' }),
    };
  }
};
