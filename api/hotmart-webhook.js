import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required env vars');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function getEmailFromPayload(body) {
  if (body?.data?.buyer?.email) return body.data.buyer.email.toLowerCase().trim();
  if (body?.data?.email) return body.data.email.toLowerCase().trim();
  if (body?.email) return body.email.toLowerCase().trim();
  return null;
}

function buildWelcomeEmail(name) {
  const displayName = name || 'hermano o hermana';
  return {
    subject: '¡Bienvenido a Selah Vida Premium! 🙏',
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #FAF6EF; color: #1a3a4a;">
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="font-size: 48px;">🕊️</span>
          <h1 style="color: #C9A84C; font-family: Georgia, serif; margin: 8px 0 0;">Selah Vida</h1>
        </div>

        <p style="font-family: Inter, sans-serif; font-size: 16px; line-height: 1.7;">Hola ${displayName},</p>
        <p style="font-family: Inter, sans-serif; font-size: 16px; line-height: 1.7;">
          ¡Gracias por unirte a <strong>Selah Vida Premium</strong>!
        </p>
        <p style="font-family: Inter, sans-serif; font-size: 16px; line-height: 1.7;">Ahora tienes acceso ilimitado a:</p>
        <ul style="font-family: Inter, sans-serif; font-size: 16px; line-height: 1.9; padding-left: 24px;">
          <li>✨ Chat ilimitado con Rafael</li>
          <li>🎵 Música de Alabanza</li>
          <li>🎮 Juegos Bíblicos</li>
          <li>🙏 Oración Guiada</li>
        </ul>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://selah-vida.vercel.app/chat"
             style="display: inline-block; background-color: #C9A84C; color: #1a3a4a; text-decoration: none; font-family: Inter, sans-serif; font-weight: 600; font-size: 16px; padding: 14px 36px; border-radius: 8px;">
            Comenzar ahora
          </a>
        </div>

        <p style="font-family: Inter, sans-serif; font-size: 16px; line-height: 1.7;">
          Que Dios bendiga tu camino,<br />
          <em style="color: #C9A84C;">El equipo de Selah Vida</em>
        </p>

        <hr style="border: none; border-top: 1px solid #e0d6c8; margin: 32px 0;" />
        <p style="font-family: Inter, sans-serif; font-size: 12px; color: #888; text-align: center;">
          Si tienes preguntas, responde a este correo o escríbenos a hola@selah-vida.com
        </p>
      </div>
    `.trim(),
  };
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

      // Track premium_upgrade
      await supabase
        .from('analytics')
        .insert({ user_id: profileId, event_type: 'premium_upgrade', metadata: {} });

      // Send welcome email via Resend
      if (resend) {
        try {
          const buyerName = req.body?.data?.buyer?.name || req.body?.data?.name || null;
          const emailContent = buildWelcomeEmail(buyerName);
          await resend.emails.send({
            from: 'Selah Vida <noreply@selah-vida.vercel.app>',
            to: email,
            subject: emailContent.subject,
            html: emailContent.html,
          });
          console.log('Welcome email sent to:', email);
        } catch (emailErr) {
          console.error('Error sending welcome email:', emailErr?.message || emailErr);
        }
      } else {
        console.warn('RESEND_API_KEY not set — skipping welcome email');
      }

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

      // Track premium_cancel
      await supabase
        .from('analytics')
        .insert({ user_id: profileId, event_type: 'premium_cancel', metadata: {} });

      return res.status(200).json({ success: true, email, action: 'premium_cancelled' });
    }

    // Unknown event — acknowledge but don't process
    return res.status(200).json({ message: 'Evento ignorado', event });
  } catch (err) {
    console.error('Webhook error:', err?.message || err, err?.stack);
    return res.status(200).json({ error: 'Error al procesar webhook' });
  }
}