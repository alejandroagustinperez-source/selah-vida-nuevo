import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

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

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ canvas_progress: updated })
        .eq('id', user.id);

      if (updateError) throw updateError;

      return res.json({ progress: updated, pieces: getPieces(updated) });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Canvas API error:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Error al procesar' });
  }
}
