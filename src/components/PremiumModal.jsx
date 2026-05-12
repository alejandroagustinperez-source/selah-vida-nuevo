export default function PremiumModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative animate-[fadeIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dark-blue/30 hover:text-dark-blue text-xl leading-none"
          aria-label="Cerrar"
        >
          &times;
        </button>
        <div className="text-5xl mb-4">⭐</div>
        <h3 className="font-serif text-xl font-bold mb-2">Función exclusiva</h3>
        <p className="text-dark-blue/60 text-sm mb-6">
          Esta función es exclusiva para usuarios Premium.
        </p>
        <button
          onClick={() => window.open('https://pay.hotmart.com/Q105734847S', '_blank')}
          className="w-full bg-gold text-white py-3.5 rounded-full font-semibold text-sm hover:bg-gold-dark transition-colors"
        >
          Quiero ser Premium
        </button>
        <button
          onClick={onClose}
          className="w-full text-dark-blue/50 text-sm mt-3 hover:text-dark-blue transition-colors"
        >
          Ahora no
        </button>
      </div>
    </div>
  );
}
