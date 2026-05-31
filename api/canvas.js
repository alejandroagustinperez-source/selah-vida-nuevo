import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const PIECE_TYPES = ['trivia_hard', 'verse_game', 'word_search', 'quote_game'];
const BOOLEAN_TYPES = ['trivia_hard'];
const COUNTER_LIMITS = { verse_game: 4, word_search: 10, quote_game: 5 };

function getDefaultProgress() {
  return { trivia_hard: false, verse_game: 0, word_search: 0, quote_game: 0 };
}

function getPieces(progress) {
  return {
    trivia_hard: !!progress.trivia_hard,
    verse_game: (progress.verse_game || 0) >= COUNTER_LIMITS.verse_game,
    word_search: (progress.word_search || 0) >= COUNTER_LIMITS.word_search,
    quote_game: (progress.quote_game || 0) >= COUNTER_LIMITS.quote_game,
  };
}

function isFullyComplete(progress) {
  return Object.values(getPieces(progress)).every(Boolean);
}

async function sendCompletionEmail(userEmail) {
  if (!resend) {
    console.warn('RESEND_API_KEY not set — skipping completion email');
    return;
  }
  const now = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/San_Luis' });
  const { error } = await resend.emails.send({
    from: 'Selah Vida <onboarding@resend.dev>',
    to: 'alejandro.agustin.perez@gmail.com',
    subject: '🖼️ Lienzo Sagrado completado',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #FAF6EF; color: #1a3a4a;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 40px;">🖼️</span>
          <h2 style="color: #C9A84C; font-family: Georgia, serif; margin: 8px 0 0;">Selah Vida</h2>
        </div>
        <h3 style="margin: 0 0 16px; font-family: Georgia, serif;">El Lienzo Sagrado ha sido completado</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.7;">
          <tr><td style="padding: 8px 12px; font-weight: 600; color: #C9A84C; width: 100px;">Usuario</td><td style="padding: 8px 12px;">${userEmail}</td></tr>
          <tr><td style="padding: 8px 12px; font-weight: 600; color: #C9A84C;">Fecha</td><td style="padding: 8px 12px;">${now}</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e0d6c8; margin: 24px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">Notificaci&oacute;n autom&aacute;tica de Selah Vida</p>
      </div>
    `.trim(),
  });
  if (error) {
    console.error('Resend completion email error:', JSON.stringify(error));
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

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

    if (req.method === 'GET') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('canvas_progress')
        .eq('id', user.id)
        .maybeSingle();

      const progress = profile?.canvas_progress || getDefaultProgress();
      return res.json({ progress, pieces: getPieces(progress) });
    }

    if (req.method === 'POST') {
      const { type } = req.body;
      if (!type || !PIECE_TYPES.includes(type)) {
        return res.status(400).json({ error: 'Tipo de pieza no válido' });
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('canvas_progress')
        .eq('id', user.id)
        .maybeSingle();

      const current = profile?.canvas_progress || getDefaultProgress();
      const updated = { ...current };

      if (BOOLEAN_TYPES.includes(type)) {
        if (!updated[type]) {
          updated[type] = true;
        }
      } else {
        const count = (updated[type] || 0) + 1;
        updated[type] = Math.min(count, COUNTER_LIMITS[type]);
      }

      const wasComplete = isFullyComplete(current);
      const isComplete = isFullyComplete(updated);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ canvas_progress: updated })
        .eq('id', user.id);

      if (updateError) throw updateError;

      if (!wasComplete && isComplete) {
        sendCompletionEmail(user.email).catch((e) =>
          console.error('Completion email failed (caught):', e?.message || e),
        );
      }

      return res.json({ progress: updated, pieces: getPieces(updated) });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Canvas API error:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Error al procesar' });
  }
}
