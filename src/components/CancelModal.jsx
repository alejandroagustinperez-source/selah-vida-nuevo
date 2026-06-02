export default function CancelModal({ open, onClose }) {
  if (!open) return null;

  const handleConfirm = () => {
    window.open('https://app.hotmart.com/subscriptions', '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0" style={{ backgroundColor: 'rgba(15,61,61,0.5)' }} onClick={onClose} />
      <div className="relative max-w-md w-full p-6 sm:p-8 text-center" style={{ backgroundColor: '#FAF7F2', borderRadius: '10px', border: '1px solid #C9922A' }}>
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="font-serif text-xl font-bold mb-3" style={{ color: '#0F3D3D' }}>
          ¿Estás seguro que deseas cancelar tu suscripción Premium?
        </h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(15,61,61,0.6)' }}>
          Perderás acceso a Música de Alabanza, Juegos Bíblicos y Oración Guiada.
          Tu plan se cancelará al final del período.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
            style={{ border: '1px solid #E8E0D0', color: '#0F3D3D', backgroundColor: '#FFFFFF' }}
          >
            Volver
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
            style={{ backgroundColor: '#8B1A1A', color: '#FAF7F2' }}
          >
            Cancelar suscripción
          </button>
        </div>
      </div>
    </div>
  );
}
