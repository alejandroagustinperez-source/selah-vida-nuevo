import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const GRID_SIZE = 14;
const THEMES = [
  { key: 'profetas', label: 'Profetas', emoji: '📜' },
  { key: 'discípulos', label: 'Discípulos', emoji: '🐟' },
  { key: 'lugares', label: 'Lugares', emoji: '🗺️' },
  { key: 'ángeles', label: 'Ángeles', emoji: '👼' },
  { key: 'milagros', label: 'Milagros', emoji: '✨' },
  { key: 'oración', label: 'Oración', emoji: '🙏' },
];

function generateGrid(words) {
  const size = GRID_SIZE;
  const grid = Array.from({ length: size }, () => Array(size).fill(''));
  const wordPositions = {};
  const sorted = [...words].sort((a, b) => b.length - a.length);

  const directions = [
    [0, 1],  // right
    [1, 0],  // down
    [1, 1],  // down-right
    [0, -1], // left
    [-1, 0], // up
    [-1, -1],// up-left
    [1, -1], // down-left
    [-1, 1], // up-right
  ];

  for (const word of sorted) {
    const upper = word.toUpperCase().replace(/[^A-ZÁÉÍÓÚÜÑ]/g, '');
    if (upper.length < 2) continue;
    let placed = false;

    for (let attempts = 0; attempts < 200 && !placed; attempts++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * size);
      const startCol = Math.floor(Math.random() * size);
      const endRow = startRow + dir[0] * (upper.length - 1);
      const endCol = startCol + dir[1] * (upper.length - 1);

      if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) continue;

      let fits = true;
      const positions = [];
      for (let i = 0; i < upper.length; i++) {
        const r = startRow + dir[0] * i;
        const c = startCol + dir[1] * i;
        if (grid[r][c] !== '' && grid[r][c] !== upper[i]) { fits = false; break; }
        positions.push({ row: r, col: c });
      }

      if (fits) {
        for (let i = 0; i < upper.length; i++) {
          grid[positions[i].row][positions[i].col] = upper[i];
        }
        wordPositions[upper] = positions;
        placed = true;
      }
    }
  }

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }

  return { grid, wordPositions, size };
}

function checkAdjacent(r1, c1, r2, c2) {
  return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1;
}

function getWordAtPosition(pos, wordPositions) {
  for (const [word, positions] of Object.entries(wordPositions)) {
    const posSet = new Set(positions.map((p) => `${p.row},${p.col}`));
    if (pos.length === positions.length && pos.every((p) => posSet.has(`${p.row},${p.col}`))) {
      return word;
    }
    const reversed = [...positions].reverse();
    const revSet = new Set(reversed.map((p) => `${p.row},${p.col}`));
    if (pos.length === reversed.length && pos.every((p) => revSet.has(`${p.row},${p.col}`))) {
      return word;
    }
  }
  return null;
}

export default function WordSearchGame({ onBack, onComplete }) {
  const [screen, setScreen] = useState('start');
  const [theme, setTheme] = useState('profetas');
  const [words, setWords] = useState([]);
  const [grid, setGrid] = useState([]);
  const [wordPositions, setWordPositions] = useState({});
  const [selection, setSelection] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [error, setError] = useState('');
  const { isPremium } = useAuth();

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const startGame = async (selectedTheme) => {
    setTheme(selectedTheme);
    setScreen('loading');
    setError('');
    setSelection([]);
    setFoundWords([]);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: 'wordsearch', params: { theme: selectedTheme } }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al generar sopa de letras');
      }
      const data = await res.json();
      const wordList = (data.words || []).filter((w) => w.length >= 2);
      if (wordList.length < 3) throw new Error('No se generaron suficientes palabras');
      const { grid: g, wordPositions: wp } = generateGrid(wordList);
      setWords(wordList.map((w) => w.toUpperCase()));
      setGrid(g);
      setWordPositions(wp);
      setScreen('playing');
    } catch (err) {
      setError(err.message);
      setScreen('error');
    }
  };

  useEffect(() => {
    if (screen !== 'playing') return;
    if (foundWords.length === words.length && words.length > 0) {
      onComplete?.('word_search');
      const timer = setTimeout(() => setScreen('result'), 800);
      return () => clearTimeout(timer);
    }
  }, [foundWords, words, screen]);

  const handleCellClick = useCallback((row, col) => {
    if (screen !== 'playing') return;
    setSelection((prev) => {
      if (prev.length === 0) return [{ row, col }];

      const last = prev[prev.length - 1];
      if (last.row === row && last.col === col) return prev;

      if (!checkAdjacent(last.row, last.col, row, col)) {
        return [{ row, col }];
      }

      if (prev.some((p) => p.row === row && p.col === col)) return prev;

      const newSel = [...prev, { row, col }];
      const selWord = newSel.map((p) => grid[p.row][p.col]).join('');
      const revWord = [...newSel].reverse().map((p) => grid[p.row][p.col]).join('');

      for (const w of words) {
        if (foundWords.includes(w)) continue;
        if (selWord === w || revWord === w) {
          setFoundWords((fw) => [...fw, w]);
          return [];
        }
      }

      return newSel;
    });
  }, [screen, grid, words, foundWords]);

  const isSelected = (r, c) => selection.some((p) => p.row === r && p.col === c);
  const isFound = (r, c) => {
    for (const word of foundWords) {
      const pos = wordPositions[word];
      if (pos && pos.some((p) => p.row === r && p.col === c)) return true;
    }
    return false;
  };

  const isStartOfSelection = (r, c) => selection.length > 0 && selection[0].row === r && selection[0].col === c;

  if (!isPremium) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="text-5xl mb-4">⭐</div>
        <h2 className="font-serif text-xl font-bold mb-2">Función exclusiva</h2>
        <p className="text-dark-blue/60 text-sm mb-6">Esta función es exclusiva para usuarios Premium.</p>
        <button onClick={onBack} className="text-gold text-sm font-medium hover:underline">Volver a juegos</button>
      </div>
    );
  }

  if (screen === 'start') {
    return (
      <div className="h-full flex flex-col px-6 py-6 overflow-y-auto">
        <button onClick={onBack} className="self-start text-dark-blue/50 hover:text-dark-blue text-sm mb-4">&larr; Volver a juegos</button>
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔤</div>
          <h2 className="font-serif text-2xl font-bold mb-2">Sopa de Letras</h2>
          <p className="text-dark-blue/60 text-sm max-w-sm mx-auto">
            Encontrá las palabras bíblicas ocultas en la grilla.
            Tocá las letras en orden para marcar cada palabra.
          </p>
        </div>
        <p className="text-xs text-dark-blue/40 text-center mb-3">Elegí un tema:</p>
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full">
          {THEMES.map((t) => (
            <button
              key={t.key}
              onClick={() => startGame(t.key)}
              className="bg-white border border-gold/10 rounded-2xl p-4 text-center hover:border-gold/30 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="text-2xl mb-1">{t.emoji}</div>
              <div className="font-semibold text-dark-blue text-sm">{t.label}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'loading') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-dark-blue/60 text-sm">Generando sopa de letras...</p>
      </div>
    );
  }

  if (screen === 'error') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="text-4xl mb-4">❌</div>
        <p className="text-dark-blue/70 mb-2 text-sm">{error}</p>
        <button onClick={() => startGame(theme)} className="bg-gold text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gold-dark transition-colors">Intentar de nuevo</button>
        <button onClick={onBack} className="text-dark-blue/50 text-sm mt-3 hover:text-dark-blue">Volver a juegos</button>
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="font-serif text-2xl font-bold mb-1">¡Completaste la sopa de letras!</h2>
        <p className="text-dark-blue/50 text-sm mb-2">Tema: {theme}</p>
        <p className="text-dark-blue/40 text-xs mb-6">{foundWords.length} palabras encontradas</p>
        <div className="flex gap-3">
          <button onClick={() => startGame(theme)} className="bg-gold text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gold-dark transition-colors">Jugar de nuevo</button>
          <button onClick={onBack} className="bg-white border border-gold/10 text-dark-blue px-6 py-2.5 rounded-full text-sm font-medium hover:border-gold/30 transition-colors">Volver a juegos</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col px-4 py-4 overflow-y-auto">
      <button onClick={onBack} className="self-start text-dark-blue/50 hover:text-dark-blue text-sm mb-3">&larr; Volver a juegos</button>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 max-w-3xl mx-auto w-full">
        {/* Word list */}
        <div className="lg:w-48 shrink-0 order-2 lg:order-1">
          <div className="bg-white rounded-2xl border border-gold/10 p-4">
            <h3 className="font-semibold text-dark-blue text-sm mb-3 flex items-center gap-2">
              <span>📋</span> Palabras
            </h3>
            <div className="space-y-1.5">
              {words.map((w) => {
                const isFoundWord = foundWords.includes(w);
                return (
                  <div
                    key={w}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                      isFoundWord
                        ? 'bg-green-50 text-green-600 line-through border border-green-200'
                        : 'text-dark-blue/70 bg-cream'
                    }`}
                  >
                    {isFoundWord ? '✓' : '○'} {w}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-dark-blue/40 mt-3">
              {foundWords.length}/{words.length} encontradas
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 order-1 lg:order-2 flex justify-center">
          <div
            className="inline-grid gap-[1px] bg-gold/10 p-[2px] rounded-xl overflow-hidden touch-none select-none"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              maxWidth: '100%',
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const sel = isSelected(r, c);
                const found = isFound(r, c);
                const start = isStartOfSelection(r, c);
                let bg = 'bg-cream hover:bg-gold/10';
                if (found) bg = 'bg-green-100';
                else if (sel && start) bg = 'bg-gold/30';
                else if (sel) bg = 'bg-gold/20';

                return (
                  <button
                    key={`${r}-${c}`}
                    onMouseDown={(e) => { e.preventDefault(); handleCellClick(r, c); }}
                    onTouchStart={(e) => { e.preventDefault(); handleCellClick(r, c); }}
                    className={`w-full aspect-square flex items-center justify-center text-xs sm:text-sm font-medium text-dark-blue rounded-sm transition-colors active:scale-90 ${bg}`}
                    style={{ minWidth: '22px', minHeight: '22px' }}
                  >
                    {cell}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {selection.length > 0 && (
        <div className="text-center mt-3 text-xs text-dark-blue/50">
          Seleccionando: <span className="font-semibold text-gold">{selection.map((p) => grid[p.row][p.col]).join('')}</span>
        </div>
      )}
    </div>
  );
}
