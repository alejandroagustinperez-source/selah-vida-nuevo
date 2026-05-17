import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const ICONS = ['🎵', '🙏'];
const GRADIENTS = [
  'from-amber-300 to-amber-600',
  'from-blue-300 to-blue-600',
  'from-purple-300 to-purple-600',
  'from-emerald-300 to-emerald-600',
  'from-rose-300 to-rose-600',
  'from-indigo-300 to-indigo-600',
  'from-orange-300 to-orange-600',
  'from-violet-300 to-violet-600',
  'from-cyan-300 to-cyan-600',
  'from-teal-300 to-teal-600',
  'from-yellow-300 to-yellow-600',
  'from-sky-300 to-sky-600',
];

const SONGS = [
  { id: 1, title: 'Oceans (Where Feet May Fail)', artist: 'Hillsong en Español', category: 'Adoración', youtubeId: 'dy9nwe9_xzw', gradient: 0 },
  { id: 2, title: 'Rindo Todo', artist: 'Hillsong en Español', category: 'Adoración', youtubeId: '8p9J1p9dztQ', gradient: 1 },
  { id: 3, title: 'Eres Todo Poderoso', artist: 'Marcos Witt', category: 'Alabanza', youtubeId: 'UlMFSGzpFXk', gradient: 2 },
  { id: 4, title: 'Tu Fidelidad', artist: 'New Wine en Español', category: 'Adoración', youtubeId: '5H2elUTB_8I', gradient: 3 },
  { id: 5, title: 'Nada Se Compara', artist: 'Hillsong en Español', category: 'Adoración', youtubeId: '4YZQwkBpDck', gradient: 4 },
  { id: 6, title: 'Quiero Conocerte Más', artist: 'Jesús Adrián Romero', category: 'Adoración', youtubeId: '7f3GQxoZO8M', gradient: 5 },
  { id: 7, title: 'Me Rindo A Ti', artist: 'Tercer Cielo', category: 'Alabanza', youtubeId: 'cC9OKZ6NLXI', gradient: 6 },
  { id: 8, title: 'Glorioso', artist: 'Marcela Gándara', category: 'Alabanza', youtubeId: 'kHCqBFMHNKA', gradient: 7 },
  { id: 9, title: 'Ven A Este Lugar', artist: 'Elevation Worship en Español', category: 'Adoración', youtubeId: '5yqCXSMdkEc', gradient: 8 },
  { id: 10, title: 'Cuán Grande Es Él', artist: 'Clásico Adoración', category: 'Clásicos', youtubeId: 'KFCzQPNlRtY', gradient: 9 },
  { id: 11, title: 'No Hay Lugar Más Alto', artist: 'Hillsong en Español', category: 'Adoración', youtubeId: 'Xm8a7nUNHpY', gradient: 10 },
  { id: 12, title: 'Soy Libre', artist: 'Christine D\'Clario', category: 'Alabanza', youtubeId: 'xZCjPHCkDKs', gradient: 11 },
];

const CATEGORIES = ['Todas', 'Adoración', 'Alabanza', 'Clásicos'];

export default function Music() {
  const { isPremium } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [selectedSong, setSelectedSong] = useState(null);

  const filtered = useMemo(() => {
    return SONGS.filter((s) => {
      const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.artist.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'Todas' || s.category === category;
      return matchSearch && matchCategory;
    });
  }, [search, category]);



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
          Ambientá tu corazón con alabanzas seleccionadas para conectarte con Dios.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto w-full mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar canción o artista..."
          className="w-full px-5 py-3 rounded-full border border-gold/20 bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm"
        />
      </div>

      {/* Categories */}
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-gold text-white'
                : 'bg-white text-dark-blue/60 border border-gold/10 hover:border-gold/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center text-dark-blue/40 text-sm py-12">
          No se encontraron canciones
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto w-full">
          {filtered.map((song) => (
            <button
              key={song.id}
              onClick={() => setSelectedSong(song)}
              className="group rounded-2xl overflow-hidden text-left hover:shadow-lg hover:brightness-110 transition-all active:scale-[0.98] focus:outline-none"
            >
              <div className={`h-40 bg-gradient-to-br ${GRADIENTS[song.gradient]} relative flex flex-col items-center justify-center p-4`}>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                <span className="text-3xl mb-1.5">{ICONS[song.id % ICONS.length]}</span>
                <h3 className="text-sm font-bold text-white text-center leading-tight line-clamp-2 px-2 drop-shadow-sm">
                  {song.title}
                </h3>
                <p className="text-xs text-white/80 mt-1 drop-shadow-sm">{song.artist}</p>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white text-sm ml-0.5">▶</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedSong && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
          onClick={() => setSelectedSong(null)}
        >
          <div
            className="bg-cream rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gold/10">
              <div className="min-w-0 flex-1 mr-4">
                <h2 className="font-serif font-bold text-dark-blue text-base truncate">{selectedSong.title}</h2>
                <p className="text-xs text-dark-blue/50">{selectedSong.artist}</p>
              </div>
              <button
                onClick={() => setSelectedSong(null)}
                className="shrink-0 w-8 h-8 rounded-full bg-gold/10 text-dark-blue hover:bg-gold/20 transition-colors flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>
            <div className="relative" style={{ padding: '56.25% 0 0 0' }}>
              <iframe
                src={`https://www.youtube.com/embed/${selectedSong.youtubeId}?autoplay=1&rel=0`}
                title={selectedSong.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
