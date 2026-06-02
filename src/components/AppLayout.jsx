import { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import CancelModal from '../components/CancelModal';
import { trackEvent, updateLocation } from '../utils/tracking';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const navItems = [
  { to: '/chat', label: 'Chat con Rafael' },
  { to: '/music', label: 'Música de Alabanza' },
  { to: '/games', label: 'Juegos Bíblicos' },
  { to: '/canvas', label: 'El Lienzo Sagrado' },
  { to: '/prayer', label: 'Oración Guiada' },
];

const iconWrap = { minWidth: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' };

const NAV_ICONS = {
  '/chat': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  '/music': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5">
      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </svg>
  ),
  '/games': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  '/canvas': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  '/prayer': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5">
      <path d="M18 11V7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4" /><path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" /><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  ),
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const day = 86400000;
  if (diff < day) return 'Hoy';
  if (diff < 2 * day) return 'Ayer';
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export default function AppLayout({ children }) {
  const { user, logout, isPremium } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPremiumToast, setShowPremiumToast] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [menuChatId, setMenuChatId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const editInputRef = useRef(null);
  const menuRef = useRef(null);

  const getToken = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  }, []);

  const fetchChats = useCallback(async () => {
    if (!isPremium) { setChats([]); return; }
    try {
      setLoadingChats(true);
      const token = await getToken();
      const res = await fetch(`${API_BASE}/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setChats(data || []);
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
    } finally {
      setLoadingChats(false);
    }
  }, [isPremium, getToken]);

  useEffect(() => {
    if (sidebarOpen && isPremium) fetchChats();
  }, [sidebarOpen, isPremium, fetchChats]);

  useEffect(() => {
    if (location.pathname === '/chat' && isPremium) fetchChats();
  }, [location.pathname, location.search, isPremium, fetchChats]);

  // Track page views + update location on first load
  const locationTrackedRef = useRef(false);
  useEffect(() => {
    if (!user) return;
    trackEvent('page_view', { path: location.pathname });
  }, [location.pathname, user]);

  useEffect(() => {
    if (locationTrackedRef.current || !user) return;
    locationTrackedRef.current = true;
    // Get location from IP on first load
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        if (data.country_name || data.city) {
          updateLocation(data.country_name || '', data.city || '');
        }
      })
      .catch(() => {});
  }, [user]);

  // Click outside to close menu
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuChatId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (!showPremiumToast) return;
    const t = setTimeout(() => setShowPremiumToast(false), 5000);
    return () => clearTimeout(t);
  }, [showPremiumToast]);

  const handleNavClick = (item) => {
    setSidebarOpen(false);
    if (item.isLocked && !isPremium) {
      setShowPremiumToast(true);
      return;
    }
    navigate(item.to);
  };

  const handleChatClick = (chat) => {
    if (menuChatId || editingChatId) return;
    setSidebarOpen(false);
    navigate('/chat?id=' + chat.id);
  };

  const handleNewChat = () => {
    setSidebarOpen(false);
    navigate('/chat?t=' + Date.now());
  };

  const toggleMenu = (e, chatId) => {
    e.stopPropagation();
    setMenuChatId(menuChatId === chatId ? null : chatId);
    setEditingChatId(null);
    setDeleteConfirmId(null);
  };

  const startRename = (e, chat) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
    setMenuChatId(null);
    setTimeout(() => editInputRef.current?.focus(), 50);
  };

  const saveRename = async (chatId) => {
    const title = editTitle.trim();
    if (!title) { setEditingChatId(null); return; }
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/chats`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: chatId, title }),
      });
      if (res.ok) {
        setChats((prev) => prev.map((c) => c.id === chatId ? { ...c, title } : c));
      }
    } catch (err) {
      console.error('Error renaming chat:', err);
    }
    setEditingChatId(null);
  };

  const handleRenameKeyDown = (e, chatId) => {
    if (e.key === 'Enter') saveRename(chatId);
    if (e.key === 'Escape') setEditingChatId(null);
  };

  const confirmDelete = (e, chatId) => {
    e.stopPropagation();
    setDeleteConfirmId(chatId);
    setMenuChatId(null);
  };

  const executeDelete = async (chatId) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/chats?id=${chatId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        const params = new URLSearchParams(location.search);
        if (params.get('id') === chatId) {
          navigate('/chat?t=' + Date.now(), { replace: true });
        }
      }
    } catch (err) {
      console.error('Error deleting chat:', err);
    }
    setDeleteConfirmId(null);
  };

  const isActive = (to) => location.pathname === to;

  const itemsWithLock = navItems.map((item) => ({
    ...item,
    isLocked: item.to !== '/chat' && !isPremium,
  }));

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-cream">
      {/* Mobile header - fixed */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 px-4 py-3 flex items-center gap-3" style={{ backgroundColor: '#0F3D3D' }}>
        <button onClick={() => setSidebarOpen(true)} className="text-xl" aria-label="Menú" style={{ color: '#FAF7F2' }}>
          ☰
        </button>
        <NavLink to="/" className="font-serif text-base font-bold flex items-center gap-2" style={{ color: '#FAF7F2' }}>
          <img src="/logo.png" alt="Selah Vida" style={{ width: '28px', height: '28px', objectFit: 'contain' }} /> Selah Vida
        </NavLink>
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '220px', backgroundColor: '#0F3D3D' }}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(250,247,242,0.08)' }}>
          <NavLink to="/" className="font-serif text-lg font-bold flex items-center gap-2" style={{ color: '#FAF7F2' }}>
            <img src="/logo.png" alt="Selah Vida" style={{ width: '32px', height: '32px', objectFit: 'contain' }} /> Selah Vida
          </NavLink>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" style={{ scrollbarColor: 'rgba(250,247,242,0.15) transparent' }}>
          {itemsWithLock.map((item) => (
            <button
              key={item.to}
              onClick={() => handleNavClick(item)}
              className="w-full flex items-center gap-3 text-sm font-medium text-left transition-colors"
              style={{
                padding: '10px 16px',
                borderRadius: '6px',
                color: isActive(item.to) ? '#C9922A' : '#FAF7F2',
                backgroundColor: isActive(item.to) ? 'rgba(201,146,42,0.2)' : 'transparent',
                borderLeft: isActive(item.to) ? '3px solid #C9922A' : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.to)) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.to)) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span style={iconWrap}>{NAV_ICONS[item.to]}</span>
              <span style={{ fontSize: '14px' }}>{item.label}</span>
              {item.isLocked && (
                <span className="ml-auto text-xs" style={{ color: 'rgba(201,146,42,0.5)' }} title="Premium">🔒</span>
              )}
            </button>
          ))}

          {/* Admin link - only for admin email */}
          {user?.email?.toLowerCase() === 'alejandro.agustin.perez@gmail.com' && (
            <div className="pt-3 mt-3" style={{ borderTop: '1px solid rgba(250,247,242,0.08)' }}>
              <button
                onClick={() => { setSidebarOpen(false); navigate('/admin'); }}
                className="w-full flex items-center gap-3 text-sm font-medium text-left transition-colors"
                style={{
                  padding: '10px 16px',
                  borderRadius: '6px',
                  color: isActive('/admin') ? '#C9922A' : '#FAF7F2',
                  backgroundColor: isActive('/admin') ? 'rgba(201,146,42,0.2)' : 'transparent',
                  borderLeft: isActive('/admin') ? '3px solid #C9922A' : '3px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/admin')) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/admin')) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={iconWrap}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="1.5">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
              </span>
                <span style={{ fontSize: '14px' }}>Dashboard</span>
              </button>
            </div>
          )}

          {/* Chat history for Premium users */}
          {isPremium && location.pathname === '/chat' && (
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(250,247,242,0.08)' }}>
              <div className="flex items-center justify-between px-3 mb-2">
                <span style={{ color: '#C9922A', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Conversaciones
                </span>
                <button
                  onClick={handleNewChat}
                  style={{ color: '#C9922A', fontSize: '16px', lineHeight: 1, padding: '2px 6px', background: 'none', border: 'none', cursor: 'pointer' }}
                  title="Nuevo chat"
                >
                  +
                </button>
              </div>
              {loadingChats ? (
                <div className="px-3 py-2 text-xs" style={{ color: 'rgba(250,247,242,0.4)' }}>Cargando…</div>
              ) : chats.length === 0 ? (
                <div className="px-3 py-2 text-xs" style={{ color: 'rgba(250,247,242,0.4)' }}>Sin conversaciones guardadas</div>
              ) : (
                <div className="space-y-0.5">
                  {chats.map((chat) => (
                    <div key={chat.id} className="group relative">
                      {deleteConfirmId === chat.id ? (
                        <div className="flex items-center gap-1 px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(201,146,42,0.15)' }}>
                          <span className="text-xs flex-1" style={{ color: '#FAF7F2' }}>¿Eliminar?</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); executeDelete(chat.id); }}
                            className="text-xs px-2 py-1 rounded"
                            style={{ backgroundColor: '#8B1A1A', color: '#FAF7F2' }}
                          >
                            Eliminar
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                            className="text-xs px-2 py-1 rounded"
                            style={{ color: 'rgba(250,247,242,0.5)' }}
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : editingChatId === chat.id ? (
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => saveRename(chat.id)}
                          onKeyDown={(e) => handleRenameKeyDown(e, chat.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full px-4 py-2 rounded-lg text-xs focus:outline-none"
                          style={{ backgroundColor: '#0F3D3D', border: '1px solid #C9922A', color: '#FAF7F2' }}
                        />
                      ) : (
                        <button
                          onClick={() => handleChatClick(chat)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left transition-colors"
                          style={{ color: 'rgba(250,247,242,0.7)', fontSize: '13px' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#FAF7F2'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(250,247,242,0.7)'}
                        >
                          <span style={{ color: '#C9922A', opacity: 0.6 }}>💬</span>
                          <span className="flex-1 truncate">{chat.title}</span>
                          <span className="shrink-0" style={{ color: 'rgba(250,247,242,0.3)', fontSize: '10px' }}>{formatDate(chat.updated_at)}</span>
                          <button
                            onClick={(e) => toggleMenu(e, chat.id)}
                            className="shrink-0 px-0.5 opacity-0 group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                            style={{ color: 'rgba(250,247,242,0.3)' }}
                          >
                            ⋯
                          </button>
                        </button>
                      )}

                      {/* Mini menu */}
                      {menuChatId === chat.id && (
                        <div
                          ref={menuRef}
                          className="absolute right-2 top-full mt-0.5 z-50 border rounded-lg shadow-lg py-1 min-w-[140px]"
                          style={{ backgroundColor: '#0F3D3D', border: '1px solid #C9922A' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => startRename(e, chat)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs text-left transition-colors"
                            style={{ color: 'rgba(250,247,242,0.8)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            ✏️ Renombrar
                          </button>
                          <button
                            onClick={(e) => confirmDelete(e, chat.id)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs text-left transition-colors"
                            style={{ color: '#8B1A1A' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(139,26,26,0.15)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 space-y-2" style={{ borderTop: '1px solid #C9922A' }}>
          {isPremium ? (
            <div className="space-y-1">
              <span className="text-xs font-semibold inline-block" style={{ backgroundColor: '#C9922A', color: '#0F3D3D', padding: '3px 10px', borderRadius: '2px' }}>
                Premium
              </span>
              <button
                onClick={() => setCancelOpen(true)}
                className="block w-full text-left py-2.5 px-3 rounded-lg text-sm cursor-pointer touch-action-manipulation transition-colors"
                style={{ color: 'rgba(250,247,242,0.6)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FAF7F2'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(250,247,242,0.6)'}
              >
                Cancelar suscripción
              </button>
            </div>
          ) : (
            <div className="px-2 py-2" style={{ border: '1px solid rgba(201,146,42,0.3)', borderRadius: '8px' }}>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ color: '#C9922A', fontSize: '14px' }}>✦</span>
                <span className="text-xs font-semibold" style={{ color: '#FAF7F2' }}>Accedé a todo con Premium</span>
              </div>
              <p className="text-[10px] mb-2" style={{ color: 'rgba(250,247,242,0.5)' }}>
                Música, juegos, oraciones ilimitadas y más.
              </p>
              <a
                href="https://pay.hotmart.com/Q105734847S"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-xs py-2 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#C9922A', color: '#0F3D3D' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Ver planes
              </a>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm cursor-pointer touch-action-manipulation transition-colors"
            style={{ color: 'rgba(250,247,242,0.6)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FAF7F2'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(250,247,242,0.6)'}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="flex-1 min-h-0 lg:pt-0 pt-[52px]">
          {children}
        </div>
      </div>

      {/* Premium toast */}
      {showPremiumToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] animate-fadeIn">
          <div className="border shadow-xl px-5 py-3 flex items-center gap-3 max-w-sm mx-4" style={{ backgroundColor: '#FAF7F2', border: '1px solid #C9922A', borderRadius: '10px' }}>
            <span style={{ color: '#C9922A', fontSize: '18px' }}>✦</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium" style={{ color: '#0F3D3D' }}>
                Esta función es exclusiva de Premium. ¿Querés desbloquearla?
              </p>
            </div>
            <a
              href="https://pay.hotmart.com/Q105734847S"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs font-semibold whitespace-nowrap"
              style={{ color: '#C9922A' }}
            >
              Ver planes →
            </a>
          </div>
        </div>
      )}

      <CancelModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
      />
    </div>
  );
}
