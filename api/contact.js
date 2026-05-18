import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const TO_EMAIL = 'alejandro.agustin.perez@gmail.com';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (!resend) {
      console.warn('RESEND_API_KEY not set — logging contact form instead');
      console.log('Contact form:', { name, email, subject, message });
      return res.json({ success: true });
    }

    await resend.emails.send({
      from: 'Selah Vida <noreply@selah-vida.vercel.app>',
      to: TO_EMAIL,
      subject: `[Selah Vida] [${subject}] - de ${name}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #FAF6EF; color: #1a3a4a;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 40px;">🕊️</span>
            <h2 style="color: #C9A84C; font-family: Georgia, serif; margin: 8px 0 0;">Selah Vida</h2>
          </div>
          <h3 style="margin: 0 0 16px; font-family: Georgia, serif;">Nuevo mensaje de contacto</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.7;">
            <tr><td style="padding: 8px 12px; font-weight: 600; color: #C9A84C; width: 80px;">Nombre</td><td style="padding: 8px 12px;">${name}</td></tr>
            <tr><td style="padding: 8px 12px; font-weight: 600; color: #C9A84C;">Email</td><td style="padding: 8px 12px;">${email}</td></tr>
            <tr><td style="padding: 8px 12px; font-weight: 600; color: #C9A84C;">Asunto</td><td style="padding: 8px 12px;">${subject}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #fff; border-radius: 8px; border: 1px solid #e0d6c8; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">
            ${message}
          </div>
          <hr style="border: none; border-top: 1px solid #e0d6c8; margin: 24px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">Mensaje enviado desde el formulario de contacto de Selah Vida</p>
        </div>
      `.trim(),
    });

    return res.json({ success: true });
  } catch (err) {
    console.error('Contact error:', err?.message || err);
    return res.status(500).json({ error: 'Error al enviar mensaje' });
  }
}
