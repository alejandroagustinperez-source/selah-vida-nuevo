import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const crisisLines = [
  { country: 'Argentina', lines: [{ name: 'Centro de Asistencia al Suicida', phone: '135 (gratuito)' }, { name: '', phone: '+54 11 5275-1135' }] },
  { country: 'México', lines: [{ name: 'SAPTEL', phone: '55 5259-8121 (24hs)' }, { name: 'CONASAMA', phone: '800 290 0024' }] },
  { country: 'Chile', lines: [{ name: 'Salud Responde', phone: '600 360 7777' }, { name: 'ACHS', phone: '1404' }] },
  { country: 'Colombia', lines: [{ name: 'Línea 106', phone: '(crisis emocional, gratuita)' }, { name: 'Línea 192', phone: '(salud mental)' }] },
  { country: 'Perú', lines: [{ name: 'MINSA', phone: '113 opción 5' }, { name: 'INPE', phone: '(01) 419-6868' }] },
  { country: 'Bolivia', lines: [{ name: 'Línea de Salud Mental', phone: '800 10 4253' }] },
  { country: 'Ecuador', lines: [{ name: 'MSP', phone: '171 opción 6' }] },
  { country: 'Uruguay', lines: [{ name: 'Línea de Crisis', phone: '0800 0767 (gratuita)' }] },
  { country: 'Paraguay', lines: [{ name: 'SOS Línea Emocional', phone: '021 213 566' }] },
  { country: 'Venezuela', lines: [{ name: 'MPPS', phone: '0800-SALUD-YA (0800-725839-2)' }] },
  { country: 'Brasil', lines: [{ name: 'CVV', phone: '188 (gratuito, 24hs)' }] },
  { country: 'Costa Rica', lines: [{ name: 'Línea de la Vida', phone: '800-VIDA (800-8432)' }] },
  { country: 'Panamá', lines: [{ name: 'MINSA Salud Mental', phone: '169' }] },
  { country: 'Guatemala', lines: [{ name: 'IGSS', phone: '1521' }] },
  { country: 'Honduras', lines: [{ name: 'Teguline', phone: '2221-9000' }] },
  { country: 'El Salvador', lines: [{ name: 'MINSAL', phone: '132' }] },
  { country: 'Nicaragua', lines: [{ name: 'MINSA', phone: '2289-4700' }] },
  { country: 'República Dominicana', lines: [{ name: 'PROSALUD', phone: '809-221-7200' }] },
];

export default function Terminos() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      {/* Navbar spacer */}
      <div className="h-16" />

      <div className="max-w-4xl mx-auto px-6 py-8 md:py-14 space-y-10">
        {/* Header */}
        <div className="text-center">
          <span className="font-serif font-bold text-4xl md:text-5xl" style={{ color: '#8B1A1A' }}>I</span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold mt-2" style={{ color: '#0F3D3D' }}>
            Términos y condiciones
          </h1>
          <p className="font-serif text-sm italic mt-2" style={{ color: '#5A6A5A' }}>
            Última actualización: junio 2025
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 my-4 md:my-6">
          <div className="h-px flex-1 max-w-[120px]" style={{ backgroundColor: '#C9922A' }} />
          <span className="text-base md:text-lg select-none" style={{ color: '#C9922A' }}>◆</span>
          <div className="h-px flex-1 max-w-[120px]" style={{ backgroundColor: '#C9922A' }} />
        </div>

        {/* SECTION 1 — Aviso importante */}
        <div className="rounded-xl p-6 md:p-8 border-2" style={{ backgroundColor: '#FAF7F2', borderColor: '#8B1A1A' }}>
          <h2 className="font-serif text-lg md:text-xl font-bold mb-4" style={{ color: '#8B1A1A' }}>
            ⚠ Aviso importante sobre salud mental
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#3D3D3D' }}>
            Selah Vida es una herramienta de apoyo espiritual y no reemplaza la atención de un profesional de salud mental. Si estás atravesando una crisis emocional, depresión, pensamientos de hacerte daño o cualquier situación que requiera atención especializada, te pedimos que contactes a un profesional de inmediato. Selah Vida no se hace responsable por decisiones que tomen los usuarios en lugar de buscar ayuda profesional.
          </p>
        </div>

        {/* SECTION 2 — Líneas de ayuda */}
        <div>
          <h2 className="font-serif text-xl md:text-2xl font-bold mb-6" style={{ color: '#0F3D3D' }}>
            Líneas de ayuda profesional en Latinoamérica
          </h2>
          <p className="text-sm mb-6" style={{ color: '#5A6A5A' }}>
            Si necesitas hablar con alguien, contactá a una de estas líneas de atención gratuitas en tu país:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {crisisLines.map((entry) => (
              <div
                key={entry.country}
                className="rounded-lg p-4 border"
                style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(201,146,42,0.2)' }}
              >
                <h3 className="font-bold text-sm mb-2" style={{ color: '#0F3D3D' }}>{entry.country}</h3>
                <div className="space-y-1">
                  {entry.lines.map((line, i) => (
                    <p key={i} className="text-xs" style={{ color: '#3D3D3D' }}>
                      {line.name && <span className="font-medium">{line.name}: </span>}
                      <span className="text-sm font-bold" style={{ color: '#C9922A' }}>{line.phone}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 my-4 md:my-6">
          <div className="h-px flex-1 max-w-[120px]" style={{ backgroundColor: '#C9922A' }} />
          <span className="text-base md:text-lg select-none" style={{ color: '#C9922A' }}>◆</span>
          <div className="h-px flex-1 max-w-[120px]" style={{ backgroundColor: '#C9922A' }} />
        </div>

        {/* SECTION 3 — Términos y condiciones generales */}
        <div className="space-y-8">
          <h2 className="font-serif text-xl md:text-2xl font-bold" style={{ color: '#0F3D3D' }}>
            Términos y condiciones generales
          </h2>

          <div>
            <h3 className="font-serif text-base font-bold mb-2" style={{ color: '#0F3D3D' }}>1. Aceptación de términos</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#3D3D3D' }}>
              Al acceder y utilizar Selah Vida, aceptás los presentes términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte de estos términos, no debes usar el servicio. Selah Vida se reserva el derecho de modificar estos términos en cualquier momento, siendo responsabilidad del usuario revisarlos periódicamente.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-bold mb-2" style={{ color: '#0F3D3D' }}>2. Descripción del servicio</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#3D3D3D' }}>
              Selah Vida es una plataforma digital de apoyo espiritual que ofrece conversaciones guiadas con un asistente de inteligencia artificial (Rafael), juegos bíblicos, oración guiada, contenido musical y otras herramientas de crecimiento espiritual. El servicio se brinda "tal cual" y no garantiza resultados específicos en el ámbito espiritual, emocional o psicológico del usuario.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-bold mb-2" style={{ color: '#0F3D3D' }}>3. Limitación de responsabilidad</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#3D3D3D' }}>
              Selah Vida no reemplaza la consejería pastoral profesional, la terapia psicológica ni la atención médica. El contenido generado por Rafael se basa en inteligencia artificial y puede contener errores o inexactitudes. La plataforma no se responsabiliza por decisiones o acciones que el usuario tome basándose en las respuestas del asistente. El uso del servicio es bajo la propia responsabilidad del usuario.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-bold mb-2" style={{ color: '#0F3D3D' }}>4. Uso aceptable</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#3D3D3D' }}>
              El usuario se compromete a utilizar Selah Vida de manera respetuosa y ética. Queda prohibido el uso del servicio para fines ilícitos, el abuso del sistema de mensajes, la generación de contenido ofensivo o la manipulación de las funcionalidades de la plataforma. Selah Vida se reserva el derecho de suspender o cancelar cuentas que violen estos términos.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-bold mb-2" style={{ color: '#0F3D3D' }}>5. Privacidad y datos</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#3D3D3D' }}>
              Selah Vida recopila y almacena información proporcionada por el usuario, incluyendo mensajes, correo electrónico y datos de uso. Esta información se utiliza exclusivamente para mejorar la experiencia del servicio y no se comparte con terceros sin consentimiento explícito. El usuario puede solicitar la eliminación de sus datos en cualquier momento contactando a <span className="font-medium">origenvitalsl@gmail.com</span>. Para más información, consultá nuestra{' '}
              <Link to="/privacy" className="hover:underline" style={{ color: '#C9922A' }}>Política de Privacidad</Link>.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-bold mb-2" style={{ color: '#0F3D3D' }}>6. Propiedad intelectual</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#3D3D3D' }}>
              El nombre, logotipo, diseño y contenido original de Selah Vida son propiedad de sus creadores. El contenido bíblico citado pertenece a sus respectivos titulares de derechos. No se permite la reproducción, distribución o modificación del contenido de la plataforma sin autorización expresa.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-bold mb-2" style={{ color: '#0F3D3D' }}>7. Modificaciones</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#3D3D3D' }}>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de la plataforma o por correo electrónico. El uso continuado del servicio después de la publicación de los cambios constituye la aceptación de los nuevos términos.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-bold mb-2" style={{ color: '#0F3D3D' }}>8. Ley aplicable</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#3D3D3D' }}>
              Estos términos se rigen por las leyes de la República Argentina. Cualquier controversia derivada del uso del servicio será sometida a los tribunales competentes de la Ciudad Autónoma de Buenos Aires, República Argentina.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-bold mb-2" style={{ color: '#0F3D3D' }}>9. Contacto</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#3D3D3D' }}>
              Para consultas sobre estos términos, podés escribirnos a <span className="font-medium">origenvitalsl@gmail.com</span> o visitar nuestra{' '}
              <Link to="/contacto" className="hover:underline" style={{ color: '#C9922A' }}>página de contacto</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
