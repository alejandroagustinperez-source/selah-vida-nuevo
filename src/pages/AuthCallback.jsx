import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { trackEvent } from '../utils/tracking';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Procesando...');

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    console.log('AuthCallback URL:', window.location.href);
    console.log('AuthCallback hash:', hash);
    console.log('AuthCallback search:', search);

    async function handleCallback() {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('AuthCallback getSession:', session);
      if (session) {
        navigate('/chat', { replace: true });
        return;
      }

      if (search) {
        const params = new URLSearchParams(search);
        const code = params.get('code');
        if (code) {
          console.log('AuthCallback exchanging code for session...');
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          console.log('AuthCallback exchangeCodeForSession:', { data, error });
          if (data?.session) {
            navigate('/chat', { replace: true });
            return;
          }
        }
      }

      if (hash) {
        setStatus('Restaurando sesión...');
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        console.log('AuthCallback manual hash:', { accessToken, refreshToken, params: Object.fromEntries(params) });
        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          console.log('AuthCallback setSession:', { data, error });
          if (data?.session) {
            navigate('/chat', { replace: true });
            return;
          }
        }
      }

      setStatus('Esperando sesión...');
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        console.log('AuthCallback poll attempt', attempts);
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          clearInterval(poll);
          navigate('/chat', { replace: true });
        } else if (attempts >= 20) {
          clearInterval(poll);
          setStatus('Error al iniciar sesión. Intente nuevamente.');
        }
      }, 500);
    }

    handleCallback();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AuthCallback onAuthStateChange:', event, session);
      if (event === 'SIGNED_IN') {
        trackEvent('user_signup');
        navigate('/chat', { replace: true });
      }
    });

    return () => subscription?.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <div className="text-5xl mb-4">🕊️</div>
        <p className="text-dark-blue/60">{status}</p>
      </div>
    </div>
  );
}
