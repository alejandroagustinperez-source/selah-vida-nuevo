import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const free = [
  'Chat con Rafael, 20 mensajes por día',
  'Versículo del día personalizado',
  'Blog con reflexiones bíblicas',
  'Sin tarjeta de crédito',
];

const premium = [
  'Chat con Rafael sin límite',
  'Historial de conversaciones guardado',
  'Juegos bíblicos sin límite diario',
  'El Lienzo Sagrado completo',
  'Oración guiada sin límite',
  'Música de alabanza sin interrupciones',
];

const HOTMART_URL = 'https://pay.hotmart.com/Q105734847S';
const WHATSAPP_URL = 'https://wa.me/5492665066606?text=Hola%20Alejandro%2C%20tengo%20una%20consulta%20sobre%20Selah%20Vida%20Premium';

export default function Pricing() {
  return (
    <section id="precios" className="bg-sv-parchment py-20 md:py-28 px-6">
      <div className="max-w-[960px] mx-auto flex flex-col gap-12">
        <h2 className="font-display font-semibold text-sv-teal leading-tight" style={{ fontSize: 'clamp(2rem, 3.6vw, 2.75rem)' }}>
          Empieza gratis. Pasa a Premium cuando quieras.
        </h2>

        <div className="flex flex-wrap gap-7 items-stretch">
          <div className="flex-[1_1_320px] min-w-0 border border-[#D8CDB8] rounded-3xl p-8 md:p-9 flex flex-col gap-6 bg-sv-cream">
            <h3 className="font-display text-[26px] font-semibold text-sv-teal">Gratis</h3>
            <p className="text-[40px] font-semibold leading-none text-sv-ink">USD 0</p>
            <ul className="flex flex-col gap-2.5 text-[17px] text-sv-muted">
              {free.map((t) => (
                <li key={t} className="flex gap-2.5 items-start">
                  <Check size={18} className="shrink-0 mt-1 text-sv-teal" aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="mt-auto flex items-center justify-center min-h-[52px] rounded-full border-[1.5px] border-sv-teal text-sv-teal font-semibold hover:bg-sv-teal hover:text-sv-cream transition-colors"
            >
              Hablar con Rafael gratis
            </Link>
          </div>

          <div className="flex-[1_1_320px] min-w-0 bg-sv-teal text-sv-cream rounded-3xl p-8 md:p-9 flex flex-col gap-6">
            <h3 className="font-display text-[26px] font-semibold">Premium</h3>
            <p className="flex items-baseline gap-2">
              <span className="text-[40px] font-semibold leading-none">USD 4,99</span>
              <span className="text-sv-sage">por mes</span>
            </p>
            <ul className="flex flex-col gap-2.5 text-[17px] text-sv-mist">
              <li className="flex gap-2.5 items-start">
                <Check size={18} className="shrink-0 mt-1 text-sv-gold-light" aria-hidden="true" />
                <span>Todo lo del plan gratis</span>
              </li>
              {premium.map((t) => (
                <li key={t} className="flex gap-2.5 items-start">
                  <Check size={18} className="shrink-0 mt-1 text-sv-gold-light" aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <a
              href={HOTMART_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto flex items-center justify-center min-h-[52px] rounded-full bg-sv-gold hover:bg-sv-gold-hover text-sv-night font-semibold transition-colors"
            >
              Suscribirme a Premium
            </a>
            <p className="text-sm text-sv-sage text-center">
              Pago seguro con Hotmart. Cancelas cuando quieras.{' '}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="underline text-sv-mist hover:text-white">
                ¿Dudas? Escríbenos por WhatsApp
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
