import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase';
import PremiumModal from '../../components/PremiumModal';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const GRID_SIZE = 14;
const THEMES = [
  { key: 'profetas', label: 'Profetas' },
  { key: 'discípulos', label: 'Discípulos' },
  { key: 'lugares', label: 'Lugares' },
  { key: 'ángeles', label: 'Ángeles' },
  { key: 'milagros', label: 'Milagros' },
  { key: 'oración', label: 'Oración' },
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
  const completedRef = useRef(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
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
    completedRef.current = false;
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
    if (foundWords.length === words.length && words.length > 0 && !completedRef.current) {
      completedRef.current = true;
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

  if (screen === 'start') {
    return (
      <>
        <div className="h-full flex flex-col px-6 py-6 overflow-y-auto" style={{ background: '#FAF7F2' }}>
          <button onClick={onBack} className="self-start text-sm mb-4 hover:underline" style={{ color: '#6b6b6b' }}>&larr; Volver a juegos</button>
          <div className="text-center mb-6">
            <div className="text-[28px] mb-3 leading-none" style={{ color: '#C9922A' }}>✦</div>
            <h2 className="font-['Playfair_Display'] text-2xl font-bold mb-2" style={{ color: '#0F3D3D' }}>Sopa de Letras</h2>
            <p className="text-sm max-w-sm mx-auto" style={{ color: '#6b6b6b' }}>
              Encontrá las palabras bíblicas ocultas en la grilla.
              Tocá las letras en orden para marcar cada palabra.
            </p>
          </div>
          <p className="text-center mb-3" style={{ color: '#C9922A', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Elegí un tema:</p>
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full">
            {THEMES.map((t) => (
              <button
                key={t.key}
                onClick={() => { if (!isPremium) { setShowPremiumModal(true); } else { startGame(t.key); } }}
                style={{ background: '#fff', border: '1px solid #E8E0D0', borderRadius: '6px', padding: '16px' }}
                className="text-center transition-all active:scale-[0.98]"
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#C9922A'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E8E0D0'}
              >
                <div className="mb-1 flex justify-center">
                  {{
                    profetas: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
                    discípulos: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                    lugares: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                    ángeles: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>,
                    milagros: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
                    oración: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5"><path d="M18 11V7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4"/><path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>,
                  }[t.key]}
                </div>
                <div className="font-['Playfair_Display'] font-bold text-sm" style={{ color: '#0F3D3D' }}>{t.label}</div>
              </button>
            ))}
          </div>
        </div>
        <PremiumModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
      </>
    );
  }

  if (screen === 'loading') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6" style={{ background: '#FAF7F2' }}>
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-sm" style={{ color: '#6b6b6b' }}>Generando sopa de letras...</p>
      </div>
    );
  }

  if (screen === 'error') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6" style={{ background: '#FAF7F2' }}>
        <div className="text-4xl mb-4">❌</div>
        <p className="mb-2 text-sm" style={{ color: '#0F3D3D' }}>{error}</p>
        <button onClick={() => startGame(theme)} className="px-6 py-2.5 text-sm font-['Playfair_Display'] transition-colors" style={{ background: '#0F3D3D', color: '#FAF7F2', border: 'none', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.background = '#C9922A'} onMouseLeave={(e) => e.currentTarget.style.background = '#0F3D3D'}>Intentar de nuevo</button>
        <button onClick={onBack} className="text-sm mt-3 hover:underline" style={{ color: '#6b6b6b' }}>Volver a juegos</button>
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6" style={{ background: '#FAF7F2' }}>
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="font-['Playfair_Display'] text-2xl font-bold mb-1" style={{ color: '#0F3D3D' }}>¡Completaste la sopa de letras!</h2>
        <p className="text-sm mb-2" style={{ color: '#6b6b6b' }}>Tema: {theme}</p>
        <p className="text-xs mb-6" style={{ color: '#6b6b6b' }}>{foundWords.length} palabras encontradas</p>
        <div className="flex gap-3">
          <button onClick={() => startGame(theme)} className="px-6 py-2.5 text-sm font-['Playfair_Display'] transition-colors" style={{ background: '#0F3D3D', color: '#FAF7F2', border: 'none', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.background = '#C9922A'} onMouseLeave={(e) => e.currentTarget.style.background = '#0F3D3D'}>Jugar de nuevo</button>
          <button onClick={onBack} className="px-6 py-2.5 text-sm font-medium transition-colors" style={{ background: '#fff', border: '1px solid #E8E0D0', color: '#0F3D3D', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#C9922A'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E8E0D0'}>Volver a juegos</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col px-4 py-4 overflow-y-auto" style={{ background: '#FAF7F2' }}>
      <button onClick={onBack} className="self-start text-sm mb-3 hover:underline" style={{ color: '#6b6b6b' }}>&larr; Volver a juegos</button>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 max-w-3xl mx-auto w-full">
        {/* Word list */}
        <div className="lg:w-48 shrink-0 order-2 lg:order-1">
          <div className="p-4" style={{ background: '#fff', border: '1px solid #E8E0D0', borderRadius: '6px' }}>
            <h3 className="font-['Playfair_Display'] font-bold text-sm mb-3" style={{ color: '#0F3D3D' }}>Palabras</h3>
            <div className="space-y-1.5">
              {words.map((w) => {
                const isFoundWord = foundWords.includes(w);
                return (
                  <div
                    key={w}
                    className="text-xs px-3 py-1.5 transition-all"
                    style={{
                      color: isFoundWord ? '#6b6b6b' : '#0F3D3D',
                      textDecoration: isFoundWord ? 'line-through' : 'none',
                      opacity: isFoundWord ? 0.5 : 1,
                    }}
                  >
                    {w}
                  </div>
                );
              })}
            </div>
            <p className="text-xs mt-3" style={{ color: '#C9922A' }}>
              {foundWords.length}/{words.length} encontradas
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 order-1 lg:order-2 flex justify-center">
          <div
            className="inline-grid gap-[1px] p-[2px] overflow-hidden touch-none select-none"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              maxWidth: '100%',
              background: '#E8E0D0',
              borderRadius: '6px',
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const sel = isSelected(r, c);
                const found = isFound(r, c);
                let bg = '#fff';
                let color = '#0F3D3D';
                if (found) { bg = '#C9922A'; color = '#FAF7F2'; }
                else if (sel) { bg = '#0F3D3D'; color = '#FAF7F2'; }

                return (
                  <button
                    key={`${r}-${c}`}
                    onMouseDown={(e) => { e.preventDefault(); handleCellClick(r, c); }}
                    onTouchStart={(e) => { e.preventDefault(); handleCellClick(r, c); }}
                    className="w-full aspect-square flex items-center justify-center transition-colors active:scale-90"
                    style={{ background: bg, color: color, minWidth: '22px', minHeight: '22px', fontFamily: "'Playfair Display', serif", fontSize: '14px' }}
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
        <div className="text-center mt-3 text-xs" style={{ color: '#6b6b6b' }}>
          Seleccionando: <span style={{ color: '#C9922A' }}>{selection.map((p) => grid[p.row][p.col]).join('')}</span>
        </div>
      )}
    </div>
  );
}
