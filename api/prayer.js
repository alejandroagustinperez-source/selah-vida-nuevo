import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CATEGORIES = {
  ansiedad: 'Ansiedad y Paz',
  sanidad: 'Sanidad',
  familia: 'Familia',
  trabajo: 'Trabajo y Finanzas',
  gratitud: 'Gratitud',
  arrepentimiento: 'Arrepentimiento',
  fe: 'Fe y Propósito',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { category, message, history = [] } = req.body;
    if (!category || !CATEGORIES[category]) {
      return res.status(400).json({ error: 'Categoría no válida' });
    }

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

    const categoryName = CATEGORIES[category];

    const PRAYER_SYSTEM = `Eres Rafael, cuyo nombre significa "Dios sana". Eres un guía espiritual cristiano que ora junto al usuario.

Estás guiando una oración sobre: "${categoryName}".

REGLAS:
- Hablá SIEMPRE en español latinoamericano
- Usá primera persona del plural: oremos, pidamos, agradezcamos, caminemos
- Incorporá versículos bíblicos RVR1960 relevantes al tema
- Sé cálido, empático y espiritual
- Estructurá la oración en etapas: Alabanza a Dios → Petición específica → Agradecimiento → Cierre con Amén
- Máximo 4 intercambios en total, luego cerrá con un "Amén" natural
- Si el usuario comparte una petición personal, incorporala a la oración
- No uses respuestas genéricas — personalizá según lo que el usuario escriba
- Cada mensaje tuyo debe incluir partes de la oración misma (no solo hablar de orar, sino orar directamente)
- Cuando sea el momento de cerrar, decí algo como "Amén, que así sea" y luego "¿Hay algo más en tu corazón?" solo si llevan menos de 3 intercambios`;

    const mappedHistory = (history || []).slice(-8).map((msg) => ({
      role: msg.role === 'model' ? 'assistant' : msg.role,
      content: msg.content || '',
    })).filter((msg) => msg.content);

    const messages = [
      { role: 'system', content: PRAYER_SYSTEM },
      ...mappedHistory,
    ];

    if (message) {
      messages.push({ role: 'user', content: message });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices?.[0]?.message?.content || '';
    const isFinal = response.toLowerCase().includes('amén');

    return res.json({ response, isFinal });
  } catch (err) {
    console.error('Prayer API error:', err?.message || err);
    return res.status(500).json({ error: 'Error al procesar la oración' });
  }
}
