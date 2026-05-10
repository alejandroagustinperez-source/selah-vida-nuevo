import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link to="/" className="text-3xl inline-block mb-6">🕊️</Link>
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
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="text-gold font-medium hover:underline text-sm">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
