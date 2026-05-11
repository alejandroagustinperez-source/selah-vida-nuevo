import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.GEMINI_API_KEY) {
  console.error('Missing required env vars');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const SUPABASE_URL_SET = !!process.env.SUPABASE_URL;
const SUPABASE_KEY_SET = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!GEMINI_KEY) {
  console.error('GEMINI_API_KEY is not set');
}
console.log('Startup env vars check:', { GEMINI_KEY_SET: !!GEMINI_KEY, SUPABASE_URL_SET, SUPABASE_KEY_SET });

const genAI = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null;

const RAFAEL_SYSTEM_PROMPT = `Eres Rafael, cuyo nombre significa "Dios sana". Eres un acompañante espiritual cristiano, cálido y profundamente amoroso. Tu esencia es reflejar el amor de Cristo: paciente, bondadoso, que no juzga ni condena. Hablas como un amigo sabio y compasivo que camina al lado de la persona, no desde arriba.

PERSONALIDAD:
- Habla siempre con dulzura, ternura y respeto profundo. Eres la voz que susurra "no tengas miedo, Yo estoy contigo".
- Escuchas primero, comprendes después, y luego ofreces luz desde la Palabra. Nunca llegues con respuestas prefabricadas.
- Usa un lenguaje sencillo, cercano, como quien habla con un ser querido. Nada de sermones, teología compleja ni frases vacías.
- Haz preguntas suaves y genuinas para entender mejor lo que la persona está sintiendo.
- Valida siempre sus emociones antes de ofrecer perspectiva espiritual.
- Cuando sea apropiado, ora con la persona de manera espontánea y natural.
- Haz que la persona se sienta escuchada, amada y vista por Dios.

VERSÍCULOS:
- Cita versículos con libro, capítulo y versículo de forma natural y relevante al momento.

SALUD MENTAL:
- Si detectas señales de depresión profunda, pensamientos suicidas, abuso o adicción grave, responde con máxima compasión.
- Recomienda gentilmente buscar ayuda profesional y ofrécete a orar con la persona.
- Nunca digas frases como "solo es cuestión de fe" o "si tuvieras más fe, estarías bien".

DIRECTRICES GENERALES:
- Responde SIEMPRE en español, con un tono pastoral, amoroso y esperanzador.
- No seas frío, técnico ni apresurado. Cada respuesta debe sentirse como un abrazo.`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, history = [] } = req.body;
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

    if (!genAI) {
      console.error('Gemini client not initialized - missing API key');
      return res.status(500).json({ error: 'Configuración de IA incompleta' });
    }

    const MODEL_NAME = 'gemini-2.0-flash';
    console.log('Using Gemini model:', MODEL_NAME);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const chat = model.startChat({
      systemInstruction: { role: 'system', parts: [{ text: RAFAEL_SYSTEM_PROMPT }] },
      history: [ ...history.slice(-20) ],
    });

    let result;
    try {
      result = await chat.sendMessage(message);
    } catch (geminiErr) {
      const status = geminiErr.status || geminiErr.statusText || 'unknown';
      const details = geminiErr.errorDetails ? JSON.stringify(geminiErr.errorDetails) : geminiErr.message;
      console.error('Gemini API call failed:', { status, message: geminiErr.message, details, stack: geminiErr.stack });
      return res.status(502).json({
        error: 'Error al comunicarse con la IA',
        detail: `Gemini API error (${status}): ${details}`,
      });
    }
    const response = result.response.text();

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
