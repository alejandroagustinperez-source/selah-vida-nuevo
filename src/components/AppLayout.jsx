import { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import PremiumModal from '../components/PremiumModal';
import CancelModal from '../components/CancelModal';
import { trackEvent, updateLocation } from '../utils/tracking';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const navItems = [
  { to: '/chat', icon: '💬', label: 'Chat con Rafael' },
  { to: '/music', icon: '🎵', label: 'Música de Alabanza' },
  { to: '/games', icon: '🎮', label: 'Juegos Bíblicos' },
  { to: '/canvas', icon: '🖼️', label: 'El Lienzo Sagrado' },
  { to: '/prayer', icon: '🙏', label: 'Oración Guiada' },
];

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
  const [modalItem, setModalItem] = useState(null);
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

  const handleNavClick = (item) => {
    setSidebarOpen(false);
    if (item.isLocked && !isPremium) {
      setModalItem(item);
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
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gold/10 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSidebarOpen(true)} className="text-xl" aria-label="Menú">
          ☰
        </button>
        <NavLink to="/" className="font-serif text-base font-bold text-dark-blue flex items-center gap-2">
          <span>🕊️</span> Selah Vida
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
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gold/10 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="px-6 pt-6 pb-4 border-b border-gold/10">
          <NavLink to="/" className="font-serif text-xl font-bold text-dark-blue flex items-center gap-2">
            <span>🕊️</span> Selah Vida
          </NavLink>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {itemsWithLock.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <button
                key={item.to}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-colors ${
                  isActive
                    ? 'bg-gold/10 text-gold'
                    : isPremium && item.to !== '/chat'
                      ? 'text-dark-blue hover:bg-cream'
                      : 'text-dark-blue/70 hover:bg-cream'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.isLocked && (
                  <span className="text-xs text-dark-blue/30" title="Premium">🔒</span>
                )}
              </button>
            );
          })}

          {/* Admin link - only for admin email */}
          {user?.email?.toLowerCase() === 'origenvitalsl@gmail.com' && (
            <div className="pt-4 mt-4 border-t border-gold/10">
              <button
                onClick={() => { setSidebarOpen(false); navigate('/admin'); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-colors ${
                  location.pathname === '/admin' ? 'bg-gold/10 text-gold' : 'text-dark-blue/70 hover:bg-cream'
                }`}
              >
                <span className="text-lg">📊</span>
                <span>Dashboard</span>
              </button>
            </div>
          )}

          {/* Chat history for Premium users */}
          {isPremium && location.pathname === '/chat' && (
            <div className="mt-4 pt-4 border-t border-gold/10">
              <div className="flex items-center justify-between px-4 mb-2">
                <span className="text-xs font-semibold text-dark-blue/40 uppercase tracking-wider">
                  Conversaciones
                </span>
                <button
                  onClick={handleNewChat}
                  className="text-gold hover:text-gold-dark text-lg leading-none p-1"
                  title="Nuevo chat"
                >
                  +
                </button>
              </div>
              {loadingChats ? (
                <div className="px-4 py-2 text-xs text-dark-blue/30 animate-pulse">Cargando…</div>
              ) : chats.length === 0 ? (
                <div className="px-4 py-2 text-xs text-dark-blue/30">Sin conversaciones guardadas</div>
              ) : (
                <div className="space-y-0.5">
                  {chats.map((chat) => (
                    <div key={chat.id} className="group relative">
                      {deleteConfirmId === chat.id ? (
                        <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50">
                          <span className="text-xs text-red-700 flex-1">¿Eliminar?</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); executeDelete(chat.id); }}
                            className="text-xs text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600"
                          >
                            Eliminar
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                            className="text-xs text-dark-blue/50 px-2 py-1 rounded hover:bg-white/50"
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
                          className="w-full px-4 py-2 rounded-lg text-xs bg-cream border border-gold/30 focus:outline-none focus:ring-1 focus:ring-gold/50 text-dark-blue"
                        />
                      ) : (
                        <button
                          onClick={() => handleChatClick(chat)}
                          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-xs text-left hover:bg-cream transition-colors"
                        >
                          <span className="text-dark-blue/40 shrink-0">💬</span>
                          <span className="flex-1 truncate text-dark-blue/70">{chat.title}</span>
                          <span className="text-dark-blue/30 shrink-0 text-[10px]">{formatDate(chat.updated_at)}</span>
                          <button
                            onClick={(e) => toggleMenu(e, chat.id)}
                            className="opacity-0 group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 text-dark-blue/30 hover:text-dark-blue transition-opacity shrink-0 px-0.5"
                          >
                            ⋯
                          </button>
                        </button>
                      )}

                      {/* Mini menu */}
                      {menuChatId === chat.id && (
                        <div
                          ref={menuRef}
                          className="absolute right-2 top-full mt-0.5 z-50 bg-white border border-gold/10 rounded-lg shadow-lg py-1 min-w-[140px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => startRename(e, chat)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs text-left text-dark-blue/70 hover:bg-cream transition-colors"
                          >
                            ✏️ Renombrar
                          </button>
                          <button
                            onClick={(e) => confirmDelete(e, chat.id)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs text-left text-red-500 hover:bg-red-50 transition-colors"
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
        <div className="px-4 py-4 border-t border-gold/10 space-y-2">
          {isPremium ? (
            <div className="px-2 space-y-2">
              <span className="text-xs text-gold bg-gold/10 px-2.5 py-1 rounded-full font-semibold inline-block">
                Premium
              </span>
              <button
                onClick={() => setCancelOpen(true)}
                className="block w-full text-left text-sm text-red-500 hover:text-red-700 hover:underline transition-colors"
              >
                Cancelar suscripción
              </button>
            </div>
          ) : null}
          <button
            onClick={handleLogout}
            className="w-full text-left px-2 py-2 text-sm text-dark-blue/40 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 min-h-0 lg:pt-0 pt-[52px]">
          {children}
        </div>
      </div>

      <PremiumModal
        open={!!modalItem}
        onClose={() => setModalItem(null)}
      />
      <CancelModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
      />
    </div>
  );
}
