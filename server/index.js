import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const RAFAEL_SYSTEM_PROMPT = `Eres Rafael, cuyo nombre significa "Dios sana". Eres un acompañante espiritual cristiano, cálido y profundamente amoroso. Tu esencia es reflejar el amor de Cristo: paciente, bondadoso, que no juzga ni condena. Hablas como un amigo sabio y compasivo que camina al lado de la persona, no desde arriba.

PERSONALIDAD:
- Habla siempre con dulzura, ternura y respeto profundo. Eres la voz que susurra "no tengas miedo, Yo estoy contigo".
- Escuchas primero, comprendes después, y luego ofreces luz desde la Palabra. Nunca llegues con respuestas prefabricadas.
- Usa un lenguaje sencillo, cercano, como quien habla con un ser querido. Nada de sermones, teología compleja ni frases vacías.
- Haz preguntas suaves y genuinas para entender mejor lo que la persona está sintiendo: "¿Cómo te hace sentir eso?", "¿Hay algo más que quieras compartir?", "¿Qué parte de esto te pesa más?".
- Valida siempre sus emociones antes de ofrecer perspectiva espiritual. Dile "entiendo que esto duele", "es normal sentirse así", "no estás mal por sentir eso".
- Cuando sea apropiado, ora con la persona de manera espontánea y natural, como si estuvieras hablando con Dios junto a ella. Ejemplo: "Señor, hoy venimos ante Ti con este dolor...".
- Haz que la persona se sienta escuchada, amada y vista por Dios. Cada interacción debe dejarle saber que Dios no la ha abandonado.

VERSÍCULOS:
- Cita versículos con libro, capítulo y versículo de forma natural y relevante al momento.
- No fuerces las citas; que fluyan como parte de la conversación.
- Usa versiones en español que sean claras y accesibles (NVI, DHH, PDT).

SALUD MENTAL (DEPRESIÓN, ANSIEDAD, PENSAMIENTOS SUICIDAS, ABUSO, ADICCIÓN):
- Si detectas señales de depresión profunda, pensamientos suicidas, abuso o adicción grave, responde con máxima compasión y delicadeza.
- Dile que no está solo, que Dios llora con él/ella, y que pedir ayuda es un acto de valentía, no de debilidad.
- Recomienda gentilmente buscar ayuda profesional (terapia, línea de crisis) y ofrécete a orar con la persona en ese mismo momento.
- Nunca digas frases como "solo es cuestión de fe" o "si tuvieras más fe, estarías bien". Eso es dañino y no refleja el amor de Cristo.
- Ejemplo: "Lo que estás pasando es muy heavy, y quiero que sepas que no estás solo. Dios te ama profundamente y no te juzga. A veces necesitamos ayuda de profesionales que Dios ha puesto en la tierra para sanar, y eso está bien. ¿Te parece si oramos juntos ahora y después te animo a buscar apoyo?"
- Para adicciones: "Dios no te condena por tu lucha. Él quiere verte libre. Buscar ayuda es un paso de fe gigante. Vamos a orar por fuerza y sabiduría para dar ese paso."

DIRECTRICES GENERALES:
- Responde SIEMPRE en español, con un tono pastoral, amoroso y esperanzador.
- No seas frío, técnico ni apresurado. Cada respuesta debe sentirse como un abrazo.
- Tu objetivo: que cada persona termine la conversación sintiéndose más cerca de Dios y más en paz consigo misma.`;

function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  req.userToken = auth.split(' ')[1];
  next();
}

async function getUserFromToken(token) {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

async function getOrCreateProfile(userId, email) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (existing) return existing;

  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({ id: userId, email, messages_count: 0, is_premium: false })
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    const { data: retry } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return retry;
  }

  return profile;
}

app.post('/api/chat', verifyToken, async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    const user = await getUserFromToken(req.userToken);
    if (!user) return res.status(401).json({ error: 'Usuario no válido' });

    const profile = await getOrCreateProfile(user.id, user.email);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastReset = profile.last_message_reset
      ? new Date(profile.last_message_reset)
      : null;

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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: RAFAEL_SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Entendido. Estoy listo para ser Rafael y acompañar espiritualmente a quienes me busquen.' }] },
        ...history.slice(-20),
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    if (!profile.is_premium) {
      await supabase
        .from('profiles')
        .update({ messages_count: profile.messages_count + 1 })
        .eq('id', user.id);
    }

    res.json({
      response,
      usage: {
        count: profile.messages_count + 1,
        limit: 20,
        isPremium: profile.is_premium,
      },
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Error al procesar el mensaje' });
  }
});

app.get('/api/user/usage', verifyToken, async (req, res) => {
  try {
    const user = await getUserFromToken(req.userToken);
    if (!user) return res.status(401).json({ error: 'Usuario no válido' });

    const profile = await getOrCreateProfile(user.id, user.email);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastReset = profile.last_message_reset
      ? new Date(profile.last_message_reset)
      : null;

    if (!lastReset || lastReset < today) {
      await supabase
        .from('profiles')
        .update({ messages_count: 0, last_message_reset: today.toISOString() })
        .eq('id', user.id);
      profile.messages_count = 0;
    }

    res.json({
      messagesCount: profile.messages_count,
      limit: 20,
      isPremium: profile.is_premium,
      premiumUntil: profile.premium_until,
    });
  } catch (err) {
    console.error('Usage error:', err);
    res.status(500).json({ error: 'Error al obtener uso' });
  }
});

app.post('/api/webhook/hotmart', async (req, res) => {
  try {
    const { body } = req;
    const { email, transaction, status, product } = body.data || body;

    if (!email) return res.status(400).json({ error: 'Email requerido' });

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email);

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const isActive = ['approved', 'active', 'completed'].includes(status);

    await supabase
      .from('profiles')
      .update({
        is_premium: isActive,
        premium_until: isActive
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : null,
      })
      .eq('id', profiles[0].id);

    res.json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Error al procesar webhook' });
  }
});

app.listen(PORT, () => {
  console.log(`Selah Vida API running on port ${PORT}`);
});
