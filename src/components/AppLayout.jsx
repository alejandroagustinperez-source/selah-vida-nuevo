import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PremiumModal from '../components/PremiumModal';
import CancelModal from '../components/CancelModal';

const navItems = [
  { to: '/chat', icon: '💬', label: 'Chat con Rafael' },
  { to: '/music', icon: '🎵', label: 'Música de Alabanza' },
  { to: '/games', icon: '🎮', label: 'Juegos Bíblicos' },
  { to: '/canvas', icon: '🖼️', label: 'El Lienzo Sagrado' },
  { to: '/prayer', icon: '🙏', label: 'Oración Guiada' },
];

export default function AppLayout({ children }) {
  const { user, logout, isPremium } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [cancelOpen, setCancelOpen] = useState(false);

  const handleNavClick = (item) => {
    setSidebarOpen(false);
    if (item.isLocked && !isPremium) {
      setModalItem(item);
      return;
    }
    navigate(item.to);
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
    <div className="h-[100dvh] flex overflow-hidden bg-cream">
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
        {/* Page content with padding for fixed mobile header */}
        <div className="flex-1 min-h-0 lg:pt-0 pt-[52px]">
          {children}
        </div>
      </div>

      {/* Premium modal */}
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
