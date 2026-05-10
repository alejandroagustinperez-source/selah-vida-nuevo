import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link to="/" className="text-3xl inline-block mb-6">🕊️</Link>
        <h1 className="font-serif text-3xl font-bold mb-8">Política de Privacidad</h1>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gold/10 space-y-5 text-sm text-dark-blue/80 leading-relaxed">
          <p><strong>Última actualización:</strong> Mayo 2026</p>

          <h2 className="font-serif text-lg font-bold text-dark-blue">1. Información que recopilamos</h2>
          <p>
            En Selah Vida, nos tomamos muy en serio tu privacidad. Recopilamos únicamente la información necesaria para brindarte una experiencia de acompañamiento espiritual personalizada:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Nombre y dirección de correo electrónico (al registrarte)</li>
            <li>Información de tu perfil que decidas compartir voluntariamente</li>
            <li>Historial de conversaciones con nuestro asistente Rafael para mejorar la calidad de las respuestas</li>
            <li>Datos de uso anónimos para optimizar la plataforma</li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-dark-blue">2. Uso de la información</h2>
          <p>Utilizamos tu información para:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Brindarte respuestas personalizadas con contenido bíblico y espiritual</li>
            <li>Mejorar la calidad de nuestras funcionalidades</li>
            <li>Enviarte comunicaciones relacionadas con tu cuenta (nunca spam)</li>
            <li>Cumplir con requisitos legales y de seguridad</li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-dark-blue">3. Protección de datos</h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra accesos no autorizados, pérdida o destrucción. Tus conversaciones con Rafael son confidenciales y no se comparten con terceros.
          </p>

          <h2 className="font-serif text-lg font-bold text-dark-blue">4. Tus derechos</h2>
          <p>
            Tenés derecho a acceder, rectificar o eliminar tus datos personales en cualquier momento. Podés hacerlo desde la configuración de tu cuenta o contactándonos directamente. También podés solicitar la exportación de tus datos.
          </p>

          <h2 className="font-serif text-lg font-bold text-dark-blue">5. Cookies</h2>
          <p>
            Utilizamos cookies esenciales para el funcionamiento de la plataforma. No utilizamos cookies de rastreo publicitario ni compartimos datos con anunciantes.
          </p>

          <h2 className="font-serif text-lg font-bold text-dark-blue">6. Contacto</h2>
          <p>
            Si tenés preguntas sobre esta política, podés contactarnos a través de nuestros canales oficiales en la plataforma.
          </p>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="text-gold font-medium hover:underline text-sm">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
