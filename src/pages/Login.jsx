import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
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
