import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/chat');
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Email o contraseña incorrectos'
        : 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl inline-block mb-3">🕊️</Link>
          <h1 className="font-serif text-3xl font-bold">Selah Vida</h1>
          <p className="text-dark-blue/60 mt-1">Iniciar sesión</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-gold/10">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4 text-center">{error}</div>
          )}

          <button
            type="button"
            onClick={() => { setGoogleLoading(true); loginWithGoogle().catch(() => setGoogleLoading(false)); }}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-dark-blue border border-gold/30 py-3 rounded-full font-medium text-sm hover:bg-cream transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {googleLoading ? 'Conectando...' : 'Continuar con Google'}
          </button>

          <div className="flex items-center gap-3 my-5">
            <span className="flex-1 h-px bg-gold/20" />
            <span className="text-xs text-dark-blue/40">o con email</span>
            <span className="flex-1 h-px bg-gold/20" />
          </div>

          <label className="block text-sm font-medium text-dark-blue/70 mb-1">Email</label>
          <input
            type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gold/20 mb-4 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-gold/40"
            placeholder="tu@email.com"
          />

          <label className="block text-sm font-medium text-dark-blue/70 mb-1">Contraseña</label>
          <input
            type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gold/20 mb-6 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-gold/40"
            placeholder="••••••••"
          />

          <button
            type="submit"
            className="w-full bg-gold text-white py-3.5 rounded-full font-semibold hover:bg-gold-dark transition-colors"
          >
            Entrar
          </button>

          <p className="text-center text-sm text-dark-blue/50 mt-4">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="text-gold font-medium hover:underline">Registrate</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
