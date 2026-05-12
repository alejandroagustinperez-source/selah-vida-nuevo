import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required env vars');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

function getEmailFromPayload(body) {
  if (body?.data?.buyer?.email) return body.data.buyer.email.toLowerCase().trim();
  if (body?.data?.email) return body.data.email.toLowerCase().trim();
  if (body?.email) return body.email.toLowerCase().trim();
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  // Always return 200 to Hotmart even if method is not POST
  if (req.method !== 'POST') return res.status(200).json({ message: 'Ignored' });

  try {
    const event = req.body?.event;
    if (!event) {
      return res.status(200).json({ error: 'Evento requerido' });
    }

    const email = getEmailFromPayload(req.body);
    if (!email) {
      return res.status(200).json({ error: 'Email no encontrado en el payload' });
    }

    const { data: profiles, error: searchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email);

    if (searchError) {
      console.error('Error buscando perfil:', searchError);
      return res.status(200).json({ error: 'Error al buscar usuario' });
    }

    if (!profiles || profiles.length === 0) {
      console.error('Usuario no encontrado para email:', email);
      return res.status(200).json({ error: 'Usuario no encontrado' });
    }

    const profileId = profiles[0].id;

    if (event === 'PURCHASE_APPROVED') {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          is_premium: true,
          premium_until: expiresAt,
        })
        .eq('id', profileId);

      if (updateError) {
        console.error('Error actualizando perfil:', updateError);
        return res.status(200).json({ error: 'Error al actualizar perfil' });
      }

      console.log('Premium activado para:', email, 'hasta:', expiresAt);
      return res.status(200).json({ success: true, email, action: 'premium_activated' });
    }

    if (event === 'SUBSCRIPTION_CANCELLATION') {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          is_premium: false,
          premium_until: null,
        })
        .eq('id', profileId);

      if (updateError) {
        console.error('Error actualizando perfil:', updateError);
        return res.status(200).json({ error: 'Error al actualizar perfil' });
      }

      console.log('Premium desactivado para:', email);
      return res.status(200).json({ success: true, email, action: 'premium_cancelled' });
    }

    // Unknown event — acknowledge but don't process
    return res.status(200).json({ message: 'Evento ignorado', event });
  } catch (err) {
    console.error('Webhook error:', err?.message || err, err?.stack);
    return res.status(200).json({ error: 'Error al procesar webhook' });
  }
}