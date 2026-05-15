export default function CancelModal({ open, onClose }) {
  if (!open) return null;

  const handleConfirm = () => {
    window.open('https://app.hotmart.com/subscription', '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 text-center border border-gold/10">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="font-serif text-xl font-bold text-dark-blue mb-3">
          ¿Estás seguro que deseas cancelar tu suscripción Premium?
        </h2>
        <p className="text-sm text-dark-blue/60 leading-relaxed mb-6 font-sans">
          Perderás acceso a Música de Alabanza, Juegos Bíblicos y Oración Guiada.
          Tu plan se cancelará al final del período.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gold/30 text-dark-blue font-medium text-sm hover:bg-cream transition-colors"
          >
            Volver
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors"
          >
            Cancelar suscripción
          </button>
        </div>
      </div>
    </div>
  );
}
