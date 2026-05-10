import { Link } from 'react-router-dom';

export default function Music() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <div className="text-6xl mb-5">🎵</div>
      <h2 className="font-serif text-2xl font-bold mb-2">Música de Alabanza</h2>
      <p className="text-dark-blue/60 max-w-md mb-8">
        Ambientá tu corazón con alabanzas seleccionadas para conectarte con Dios.
      </p>
      <div className="bg-white rounded-2xl p-8 border border-gold/10 w-full max-w-md">
        <p className="text-dark-blue/40 text-sm italic">
          🎶 Reproductor musical próximamente...
        </p>
        <Link
          to="/chat"
          className="inline-block mt-4 text-gold text-sm font-medium hover:underline"
        >
          Volver al Chat con Rafael
        </Link>
      </div>
    </div>
  );
}
