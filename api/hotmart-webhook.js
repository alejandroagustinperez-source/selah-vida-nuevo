import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required env vars');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const event = req.body?.event;
    if (!event) {
      return res.status(400).json({ error: 'Evento requerido' });
    }

    if (event !== 'PURCHASE_APPROVED') {
      return res.status(200).json({ message: 'Evento ignorado', event });
    }

    const payload = req.body.data || req.body;
    const email = payload.email?.toLowerCase().trim();
    if (!email) {
      return res.status(400).json({ error: 'Email requerido en el payload' });
    }

    const { data: profiles, error: searchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email);

    if (searchError) {
      console.error('Error buscando perfil:', searchError);
      return res.status(500).json({ error: 'Error al buscar usuario' });
    }

    if (!profiles || profiles.length === 0) {
      console.error('Usuario no encontrado para email:', email);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_premium: true,
        premium_until: expiresAt,
      })
      .eq('id', profiles[0].id);

    if (updateError) {
      console.error('Error actualizando perfil:', updateError);
      return res.status(500).json({ error: 'Error al actualizar perfil' });
    }

    console.log('Premium activado para:', email, 'hasta:', expiresAt);
    return res.status(200).json({ success: true, email });
  } catch (err) {
    console.error('Webhook error:', err?.message || err, err?.stack);
    return res.status(500).json({ error: 'Error al procesar webhook', detail: err?.message || String(err) });
  }
}