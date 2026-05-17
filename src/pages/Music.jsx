import { useAuth } from '../context/AuthContext';

export default function Music() {
  const { isPremium } = useAuth();

  if (!isPremium) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="text-5xl mb-4">⭐</div>
        <h2 className="font-serif text-xl font-bold mb-2">Función exclusiva</h2>
        <p className="text-dark-blue/60 text-sm mb-6">Música de Alabanza es exclusiva para usuarios Premium.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col px-4 sm:px-6 py-6 overflow-y-auto">
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">🎵</div>
        <h1 className="font-serif text-2xl font-bold text-dark-blue">Música de Alabanza</h1>
        <p className="text-dark-blue/50 text-sm mt-1 max-w-md mx-auto">
          La mejor música cristiana para acompañar tu momento con Dios
        </p>
      </div>

      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-2xl border border-gold/10 overflow-hidden shadow-md">
          <div className="relative" style={{ padding: '56.25% 0 0 0' }}>
            <iframe
              src="https://www.youtube.com/embed/fHz2yRafi9s?autoplay=1&rel=0"
              title="Éxitos Cristianos - La Mejor Música Cristiana del Mundo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        <div className="mt-6 text-center max-w-lg mx-auto">
          <p className="text-dark-blue/60 text-sm leading-relaxed italic">
            &ldquo;La alabanza y la adoración son el puente que conecta nuestro corazón con el corazón de Dios.&rdquo;
          </p>
          <p className="text-xs text-dark-blue/40 mt-3">
            Deja que estas canciones llenen tu espíritu de paz y esperanza.
          </p>
        </div>
      </div>
    </div>
  );
}
