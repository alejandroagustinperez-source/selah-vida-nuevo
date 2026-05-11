import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.GROQ_API_KEY) {
  console.error('Missing required env vars');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const GROQ_KEY = process.env.GROQ_API_KEY;
if (!GROQ_KEY) {
  console.error('GROQ_API_KEY is not set');
}
console.log('Startup env vars check:', { GROQ_KEY_SET: !!GROQ_KEY });

const groq = GROQ_KEY ? new Groq({ apiKey: GROQ_KEY }) : null;

const RAFAEL_SYSTEM_PROMPT = `Eres Rafael, cuyo nombre significa "Dios sana". Eres un acompañante espiritual cristiano, profundamente amoroso y cercano. Tu esencia es reflejar el amor de Cristo: paciente, bondadoso, que no juzga ni condena. Hablas como un amigo sabio y compasivo que camina al lado de la persona, no desde arriba.

PERSONALIDAD:
- Habla con dulzura, ternura y un calor genuino. Cada respuesta debe sentirse como un abrazo.
- Usa un lenguaje sencillo, cercano, como quien habla con un ser querido. Nada de sermones, teología compleja ni frases vacías.
- Muestra siempre un cariño y calidez profundos. Haz que la persona se sienta escuchada, amada y vista por Dios.
- Valida siempre las emociones de la persona antes de ofrecer perspectiva espiritual.
- Termina cada respuesta con una pregunta abierta para seguir la conversación (ej: "¿Cómo te hace sentir eso?", "¿Qué creés que te llevó a sentirte así?").

GÉNERO:
- No asumas el género de la persona. Usa lenguaje neutro (ej: "hermano o hermana", "querido o querida") o preguntale al inicio: "¿Cómo te gustaría que me dirija a vos, como hermano o hermana?". Después de eso, respetá su preferencia.

USAR EL NOMBRE:
- Si se conoce el nombre de la persona, usalo de forma natural y afectuosa para personalizar la conversación.

VERSÍCULOS:
- Cita versículos con libro, capítulo y versículo de forma natural y relevante al momento.
- No repitas versículos que ya hayan sido usados en la misma conversación.

MENSAJES CORTOS:
- Si la persona escribe muy poco (ej: solo "mal", "bien", "triste"), primero preguntá con ternura antes de dar una respuesta larga. Ej: "Veo que estás pasando por un momento difícil. ¿Querés contarme un poco más sobre lo que está pasando por tu corazón?"

SALUD MENTAL:
- Si detectas señales de depresión profunda, autolesión o pensamientos suicidas, respondé con máxima compasión.
- Recomendá gentilmente buscar ayuda profesional: "Lo que estás viviendo merece atención especializada. ¿Podrías considerar hablar con un profesional que pueda acompañarte mejor en esto?"
- Nunca digas frases como "solo es cuestión de fe" o "si tuvieras más fe, estarías bien".
- Recordá que la ayuda espiritual y la profesional pueden ir de la mano.

ORACIÓN:
- Si la persona lo pide o parece necesitarlo, ofrecé orar con ella con una oración personalizada y espontánea, no genérica.

DIRECTRICES GENERALES:
- Responde SIEMPRE en español, con un tono pastoral, amoroso y esperanzador.
- No seas frío, técnico ni apresurado.`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, history = [], userName } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Mensaje requerido' });
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

    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError);
      return res.status(500).json({ error: 'Error al obtener perfil' });
    }

    let profile = existingProfile;
    if (!profile) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: user.id, email: user.email, messages_count: 0, is_premium: false })
        .select()
        .maybeSingle();
      if (insertError) {
        console.error('Profile insert error:', insertError);
        return res.status(500).json({ error: 'Error al crear perfil' });
      }
      profile = newProfile;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastReset = profile.last_message_reset ? new Date(profile.last_message_reset) : null;

    if (!lastReset || lastReset < today) {
      profile.messages_count = 0;
      await supabase
        .from('profiles')
        .update({ messages_count: 0, last_message_reset: today.toISOString() })
        .eq('id', user.id);
    }

    if (!profile.is_premium && profile.messages_count >= 20) {
      return res.status(403).json({
        error: 'Límite diario alcanzado',
        message: 'Has usado tus 20 mensajes gratuitos de hoy. Actualiza a Premium para conversar sin límites.',
        premiumRequired: true,
      });
    }

    if (!groq) {
      console.error('Groq client not initialized - missing API key');
      return res.status(500).json({ error: 'Configuración de IA incompleta' });
    }

    const MODEL_NAME = 'llama-3.3-70b-versatile';

    const mappedHistory = (history || []).slice(-20).map((msg) => ({
      role: msg.role === 'model' ? 'assistant' : msg.role,
      content: msg.parts?.[0]?.text || msg.content || '',
    })).filter((msg) => msg.content);

    const systemMessage = userName
      ? RAFAEL_SYSTEM_PROMPT + `\n\nEl nombre de la persona con la que hablás es: ${userName}. Usalo de forma natural y afectuosa.`
      : RAFAEL_SYSTEM_PROMPT;

    const messages = [
      { role: 'system', content: systemMessage },
      ...mappedHistory,
      { role: 'user', content: message },
    ];

    let completion;
    try {
      completion = await groq.chat.completions.create({
        model: MODEL_NAME,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      });
    } catch (groqErr) {
      const status = groqErr.status || groqErr.code || 'unknown';
      console.error('Groq API call failed:', { status, message: groqErr.message, stack: groqErr.stack });
      return res.status(502).json({
        error: 'Error al comunicarse con la IA',
        detail: `Groq API error (${status}): ${groqErr.message}`,
      });
    }

    const response = completion.choices?.[0]?.message?.content || '';

    if (!profile.is_premium) {
      await supabase
        .from('profiles')
        .update({ messages_count: profile.messages_count + 1 })
        .eq('id', user.id);
    }

    return res.json({
      response,
      usage: {
        count: profile.messages_count + 1,
        limit: 20,
        isPremium: profile.is_premium,
      },
    });
  } catch (err) {
    console.error('Chat API error:', err?.message || err, err?.stack);
    return res.status(500).json({ error: 'Error al procesar el mensaje', detail: err?.message || String(err) });
  }
}
