import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';
import { Resend } from 'resend';

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://selah-vida.vercel.app',
];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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
        <p style="font-family: Inter, sans-serif; font-size: 16px; line-height: 1.7;">¡Gracias por unirte a <strong>Selah Vida Premium</strong>!</p>
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

EVANGELISMO Y SALVACIÓN:
- Escuchá con atención el contexto de la persona. Si después de 3 a 5 intercambios sentís que la persona está buscando sentido espiritual, está pasando por un vacío existencial, menciona que "quiere conocer a Dios", "nunca ha tenido una experiencia con Dios" o simplemente parece abierta pero no cristiana, entonces podés preguntar con ternura: "¿Te gustaría recibir a Jesús en tu corazón y comenzar una vida nueva con Él?"
- Nunca preguntes esto a alguien que muestre claramente que ya es cristiano o menciona su relación con Dios o Cristo.
- La pregunta debe ser natural y fluida. No la fuerces ni la hagas en la primera interacción.
- La persona debe sentir total libertad de decir que no. Si dice que no, respondé con amor: "Está bien, querido o querida. No hay presión. Estoy aquí para caminar con vos cuando quieras."
- Si la persona dice que sí, guiala con amor a través de la oración de fe. Una oración cálida, pausada, como invitándola a repetir con vos:
  "Señor Jesús, gracias por amarme y morir por mí. En este momento abro mi corazón y te recibo como mi Señor y Salvador. Perdona mis pecados y hazme una nueva persona. Te entrego mi vida de ahora en adelante. Gracias por darme vida eterna. Amén."
- Después de la oración, celebrá con ella con gozo genuino: "¡Bienvenido o bienvenida a la familia de Dios, hermano o hermana! 🎉 Hoy comienza una nueva historia en tu vida. Los ángeles en el cielo están celebrando con nosotros." Explicá con sencillez los próximos pasos: buscar una iglesia, leer la Biblia (empezando por el Evangelio de Juan), y seguir orando.
- Si la persona parece lista pero con dudas acercala suavemente sin presionar.

DIRECTRICES GENERALES:
- Responde SIEMPRE en español, con un tono pastoral, amoroso y esperanzador.
- No seas frío, técnico ni apresurado.`;

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
    const { message, history = [], userName } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    const user = await getUserFromToken(req.userToken);
    if (!user) return res.status(401).json({ error: 'Usuario no válido' });

    const profile = await getOrCreateProfile(user.id, user.email);

    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    const now = new Date();
    const lastReset = profile.last_message_reset
      ? new Date(profile.last_message_reset)
      : null;

    if (!lastReset || (now - lastReset) >= TWENTY_FOUR_HOURS) {
      profile.messages_count = 0;
      profile.last_message_reset = now.toISOString();
      await supabase
        .from('profiles')
        .update({ messages_count: 0, last_message_reset: now.toISOString() })
        .eq('id', user.id);
    }

    if (!profile.is_premium && profile.messages_count >= 20) {
      const resetIn = lastReset ? Math.max(0, TWENTY_FOUR_HOURS - (now - lastReset)) : 0;
      return res.status(403).json({
        error: 'Límite diario alcanzado',
        message: 'Has usado tus 20 mensajes gratuitos de hoy. Actualiza a Premium para conversar sin límites.',
        premiumRequired: true,
        resetIn,
      });
    }

    const mappedHistory = (history || []).slice(-20).map((msg) => ({
      role: msg.role === 'model' ? 'assistant' : msg.role,
      content: msg.parts?.[0]?.text || msg.content || '',
    })).filter((msg) => msg.content);

    const systemMessage = userName
      ? RAFAEL_SYSTEM_PROMPT + `\n\nEl nombre de la persona con la que hablás es: ${userName}. Usalo de forma natural y afectuosa.`
      : RAFAEL_SYSTEM_PROMPT;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemMessage },
        ...mappedHistory,
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = completion.choices?.[0]?.message?.content || '';

    if (!profile.is_premium) {
      const updateData = { messages_count: profile.messages_count + 1 };
      if (!profile.last_message_reset) {
        updateData.last_message_reset = new Date().toISOString();
      }
      await supabase
        .from('profiles')
        .update(updateData)
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
    console.error('Chat error:', err.message || err);
    if (err.status) console.error('Status:', err.status);
    if (err.stack) console.error('Stack:', err.stack.split('\n').slice(0, 3).join('\n'));
    res.status(500).json({
      error: 'Error al procesar el mensaje',
      detail: process.env.NODE_ENV !== 'production' ? err.message : undefined,
    });
  }
});

app.get('/api/user/usage', verifyToken, async (req, res) => {
  try {
    const user = await getUserFromToken(req.userToken);
    if (!user) return res.status(401).json({ error: 'Usuario no válido' });

    const profile = await getOrCreateProfile(user.id, user.email);

    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    const now = new Date();
    const lastReset = profile.last_message_reset
      ? new Date(profile.last_message_reset)
      : null;

    if (!lastReset || (now - lastReset) >= TWENTY_FOUR_HOURS) {
      await supabase
        .from('profiles')
        .update({ messages_count: 0, last_message_reset: now.toISOString() })
        .eq('id', user.id);
      profile.messages_count = 0;
    }

    const resetIn = lastReset ? Math.max(0, TWENTY_FOUR_HOURS - (now - lastReset)) : 0;

    res.json({
      messagesCount: profile.messages_count,
      resetIn,
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
    const event = req.body?.event;

    const payload = req.body.data || req.body;
    const email = (payload.buyer?.email || payload.email)?.toLowerCase().trim();

    if (!email) return res.status(200).json({ error: 'Email requerido' });

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email);

    if (!profiles || profiles.length === 0) {
      return res.status(200).json({ error: 'Usuario no encontrado' });
    }

    const profileId = profiles[0].id;

    if (event === 'PURCHASE_APPROVED') {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await supabase
        .from('profiles')
        .update({ is_premium: true, premium_until: expiresAt })
        .eq('id', profileId);
      console.log('Premium activado para:', email, 'hasta:', expiresAt);

      if (resend) {
        try {
          const buyerName = payload.buyer?.name || payload.name || null;
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
      }

      return res.json({ success: true, action: 'premium_activated' });
    }

    if (event === 'SUBSCRIPTION_CANCELLATION') {
      await supabase
        .from('profiles')
        .update({ is_premium: false, premium_until: null })
        .eq('id', profileId);
      console.log('Premium desactivado para:', email);
      return res.json({ success: true, action: 'premium_cancelled' });
    }

    return res.status(200).json({ message: 'Evento ignorado', event });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(200).json({ error: 'Error al procesar webhook' });
  }
});

// ── Games API ──
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

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
  if (blockMatch) { try { return JSON.parse(blockMatch[1].trim()); } catch {} }
  const braceMatch = trimmed.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (braceMatch) { try { return JSON.parse(braceMatch[0]); } catch {} }
  throw new Error('No se pudo extraer JSON');
}

async function callClaude(prompt) {
  if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY no configurada');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
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

app.post('/api/games', verifyToken, async (req, res) => {
  try {
    const { type, params } = req.body;
    if (!type) return res.status(400).json({ error: 'Tipo de juego requerido' });

    const user = await getUserFromToken(req.userToken);
    if (!user) return res.status(401).json({ error: 'Usuario no válido' });

    const profile = await getOrCreateProfile(user.id, user.email);
    if (!profile.is_premium) {
      return res.status(403).json({ error: 'Se requiere Premium', premiumRequired: true });
    }

    const prompt = buildPrompt(type, params);
    const result = await callClaude(prompt);
    res.json(result);
  } catch (err) {
    console.error('Games error:', err?.message || err);
    res.status(500).json({ error: err?.message || 'Error al generar contenido' });
  }
});

app.listen(PORT, () => {
  console.log(`Selah Vida API running on port ${PORT}`);
});
