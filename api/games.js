import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-20250514';

function buildPrompt(type, params = {}) {
  switch (type) {
    case 'trivia': {
      const level = params.level || 'fácil';
      return `Genera 5 preguntas de trivia bíblica de nivel ${level}. Responde SOLO en JSON con este formato: {questions: [{question, options: ["a","b","c","d"], correct: "a"}]}`;
    }
    case 'verse':
      return `Genera un versículo bíblico conocido con una palabra clave reemplazada por ___. Responde SOLO en JSON: {verse, reference, missing_word, hint}`;
    case 'wordsearch': {
      const theme = params.theme || 'profetas';
      return `Genera 8 palabras bíblicas relacionadas al tema ${theme} (ej: profetas, discípulos, lugares). Solo las palabras, SOLO en JSON: {theme, words: []}`;
    }
    case 'quote':
      return `Genera 5 citas bíblicas famosas con 4 opciones de personajes cada una. SOLO en JSON: {quotes: [{quote, reference, options: ["a","b","c","d"], correct: "a", explanation}]}`;
    default:
      throw new Error('Tipo de juego no válido');
  }
}

function extractJSON(text) {
  const trimmed = text.trim();
  try { return JSON.parse(trimmed); } catch {}

  const blockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (blockMatch) {
    try { return JSON.parse(blockMatch[1].trim()); } catch {}
  }

  const braceMatch = trimmed.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (braceMatch) {
    try { return JSON.parse(braceMatch[0]); } catch {}
  }

  throw new Error('No se pudo extraer JSON de la respuesta de Claude');
}

async function callClaude(prompt) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY no configurada');
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      system: 'Eres un asistente que genera contenido para juegos bíblicos. Siempre respondes SOLO con JSON válido, sin texto adicional.',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Claude API error:', res.status, errText);
    throw new Error(`Error de Claude API: ${res.status}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  return extractJSON(text);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { type, params } = req.body;
    if (!type) return res.status(400).json({ error: 'Tipo de juego requerido' });

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
      .select('is_premium')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile?.is_premium) {
      return res.status(403).json({ error: 'Se requiere Premium', premiumRequired: true });
    }

    const prompt = buildPrompt(type, params);
    const result = await callClaude(prompt);
    return res.json(result);
  } catch (err) {
    console.error('Games API error:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Error al generar contenido' });
  }
}
