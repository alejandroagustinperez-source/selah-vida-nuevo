import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link to="/" className="inline-block mb-6"><img src="/logo.png" alt="Selah Vida" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} /></Link>
        <h1 className="font-serif text-3xl font-bold mb-8">Términos de Uso</h1>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gold/10 space-y-5 text-sm text-dark-blue/80 leading-relaxed">
          <p><strong>Última actualización:</strong> Mayo 2026</p>

          <h2 className="font-serif text-lg font-bold text-dark-blue">1. Aceptación de los términos</h2>
          <p>
            Al utilizar Selah Vida, aceptás los presentes términos de uso. Si no estás de acuerdo, te pedimos que no utilices la plataforma. Selah Vida es un servicio de acompañamiento espiritual con inteligencia artificial bíblica y no reemplaza el consejo profesional, médico ni psicológico.
          </p>

          <h2 className="font-serif text-lg font-bold text-dark-blue">2. Descripción del servicio</h2>
          <p>
            Selah Vida ofrece las siguientes funcionalidades:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Chat con Rafael, un asistente con inteligencia artificial entrenado en las Escrituras</li>
            <li>Versículos bíblicos personalizados según tu estado de ánimo y situación</li>
            <li>Oraciones guiadas y devocionales diarios</li>
            <li>Música de alabanza y recursos espirituales</li>
            <li>Juegos de reflexión bíblica</li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-dark-blue">3. Uso responsable</h2>
          <p>
            Te comprometés a utilizar la plataforma de manera respetuosa y constructiva. No está permitido:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Usar el servicio para fines ilícitos o contrarios a la moral cristiana</li>
            <li>Intentar manipular, hackear o dañar la plataforma</li>
            <li>Compartir contenido ofensivo, discriminatorio o blasfemo</li>
            <li>Crear múltiples cuentas para evadir los límites del plan gratuito</li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-dark-blue">4. Plan gratuito y premium</h2>
          <p>
            El plan gratuito permite hasta 20 mensajes diarios con Rafael y acceso limitado a funcionalidades. El plan Premium ($4.99/mes) brinda acceso ilimitado a todas las funcionalidades. Los pagos se procesan a través de Hotmart y están sujetos a sus términos y condiciones.
          </p>

          <h2 className="font-serif text-lg font-bold text-dark-blue">5. Limitación de responsabilidad</h2>
          <p>
            Selah Vida es una herramienta de apoyo espiritual basada en inteligencia artificial. Las respuestas de Rafael se generan algorítmicamente y no representan necesariamente la posición oficial de ninguna denominación cristiana. Recomendamos siempre buscar el consejo de líderes espirituales y profesionales calificados para asuntos importantes.
          </p>

          <h2 className="font-serif text-lg font-bold text-dark-blue">6. Cancelación y reembolsos</h2>
          <p>
            Podés cancelar tu suscripción Premium en cualquier momento. Los reembolsos se manejan de acuerdo con la política de Hotmart. Al cancelar, tu cuenta volverá al plan gratuito al final del período de facturación actual.
          </p>

          <h2 className="font-serif text-lg font-bold text-dark-blue">7. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de la plataforma. El uso continuado del servicio después de los cambios constituye la aceptación de los nuevos términos.
          </p>

          <hr className="border-gold/20 my-6" />

          <h2 className="font-serif text-lg font-bold text-dark-blue">🆘 Recursos de Ayuda</h2>
          <p className="mb-3">
            Si estás pasando por una situación difícil, no estás solo/a. Estos son recursos gratuitos disponibles en tu país:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-dark-blue text-xs uppercase tracking-wider mb-2">🇦🇷 Argentina</h3>
              <ul className="space-y-1 text-xs">
                <li>🧠 Crisis/Suicidio: Centro de Asistencia al Suicida - <strong>135</strong> (gratuito)</li>
                <li>🏥 Salud Mental: SAME - <strong>107</strong></li>
                <li>🛡️ Violencia doméstica: Línea <strong>144</strong> (gratuita, 24hs)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-dark-blue text-xs uppercase tracking-wider mb-2">🇲🇽 México</h3>
              <ul className="space-y-1 text-xs">
                <li>🧠 Crisis/Suicidio: SAPTEL - <strong>55 5259-8121</strong> (24hs)</li>
                <li>🏥 Salud Mental: CONADIC - <strong>800 911 2000</strong></li>
                <li>🛡️ Violencia doméstica: Línea VIDA - <strong>800 911 2000</strong></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-dark-blue text-xs uppercase tracking-wider mb-2">🇨🇱 Chile</h3>
              <ul className="space-y-1 text-xs">
                <li>🧠 Crisis/Suicidio: Teléfono de la Esperanza - <strong>717</strong></li>
                <li>🏥 Salud Mental: SALUD RESPONDE - <strong>600 360 7777</strong></li>
                <li>🛡️ Violencia doméstica: Fono Familia - <strong>149</strong></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-dark-blue text-xs uppercase tracking-wider mb-2">🇨🇴 Colombia</h3>
              <ul className="space-y-1 text-xs">
                <li>🧠 Crisis/Suicidio: Línea <strong>106</strong> (gratuita)</li>
                <li>🏥 Salud Mental: Línea <strong>106</strong></li>
                <li>🛡️ Violencia doméstica: Línea <strong>155</strong></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-dark-blue text-xs uppercase tracking-wider mb-2">🇪🇸 España</h3>
              <ul className="space-y-1 text-xs">
                <li>🧠 Crisis/Suicidio: Teléfono de la Esperanza - <strong>717 003 717</strong></li>
                <li>🏥 Salud Mental: Línea de Atención - <strong>024</strong></li>
                <li>🛡️ Violencia doméstica: Línea <strong>016</strong></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-dark-blue text-xs uppercase tracking-wider mb-2">🇵🇪 Perú</h3>
              <ul className="space-y-1 text-xs">
                <li>🧠 Crisis/Suicidio: MINSA - <strong>113</strong></li>
                <li>🏥 Salud Mental: Línea <strong>113</strong></li>
                <li>🛡️ Violencia doméstica: Línea <strong>100</strong></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-dark-blue text-xs uppercase tracking-wider mb-2">🇻🇪 Venezuela</h3>
              <ul className="space-y-1 text-xs">
                <li>🧠 Crisis/Suicidio: IPSM - <strong>0800-477-6484</strong></li>
                <li>🛡️ Violencia doméstica: <strong>0800-MUJERES</strong> (0800-685-3737)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-dark-blue text-xs uppercase tracking-wider mb-2">🇺🇾 Uruguay</h3>
              <ul className="space-y-1 text-xs">
                <li>🧠 Crisis/Suicidio: Línea de Crisis - <strong>0800 0767</strong></li>
                <li>🛡️ Violencia doméstica: Línea <strong>0800 4141</strong></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-dark-blue text-xs uppercase tracking-wider mb-2">🇧🇴 Bolivia</h3>
              <ul className="space-y-1 text-xs">
                <li>🛡️ Violencia doméstica: Línea <strong>800 10 0200</strong></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-dark-blue text-xs uppercase tracking-wider mb-2">🇪🇨 Ecuador</h3>
              <ul className="space-y-1 text-xs">
                <li>🧠 Crisis/Suicidio: MSP - <strong>171</strong></li>
                <li>🛡️ Violencia doméstica: ECU <strong>911</strong></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-dark-blue text-xs uppercase tracking-wider mb-2">🇵🇾 Paraguay</h3>
              <ul className="space-y-1 text-xs">
                <li>🛡️ Violencia doméstica: SOS Mujer - <strong>137</strong></li>
              </ul>
            </div>
          </div>

          <p className="text-xs text-dark-blue/50 mt-4">
            Si no encuentras tu país, por favor contacta a los servicios de emergencia locales o acude al centro de salud más cercano.
          </p>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="text-gold font-medium hover:underline text-sm">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
