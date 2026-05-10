import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await register(email, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message === 'User already registered'
        ? 'Este email ya está registrado'
        : 'Error al registrarse');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🙏</div>
          <h1 className="font-serif text-3xl font-bold mb-3">¡Casi listo!</h1>
          <p className="text-dark-blue/60 mb-6">
            Te enviamos un email de confirmación. Revisá tu bandeja de entrada y seguí las instrucciones.
          </p>
          <Link
            to="/login"
            className="inline-block bg-gold text-white px-10 py-3.5 rounded-full font-semibold hover:bg-gold-dark transition-colors"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl inline-block mb-3">🕊️</Link>
          <h1 className="font-serif text-3xl font-bold">Crear cuenta</h1>
          <p className="text-dark-blue/60 mt-1">Unite a Selah Vida</p>
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
            className="w-full px-4 py-3 rounded-xl border border-gold/20 mb-4 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-gold/40"
            placeholder="Mínimo 6 caracteres"
          />

          <label className="block text-sm font-medium text-dark-blue/70 mb-1">Confirmar contraseña</label>
          <input
            type="password" required value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gold/20 mb-6 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-gold/40"
            placeholder="Repetí tu contraseña"
          />

          <button
            type="submit"
            className="w-full bg-gold text-white py-3.5 rounded-full font-semibold hover:bg-gold-dark transition-colors"
          >
            Registrarse
          </button>

          <p className="text-center text-sm text-dark-blue/50 mt-4">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-gold font-medium hover:underline">Iniciá sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
