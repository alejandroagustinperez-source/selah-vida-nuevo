import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';

export default function usePremium() {
  const [premium, setPremium] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPremium = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/user/usage`,
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
      const data = await res.json();
      setPremium(data);
    } catch {
      setPremium(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPremium(); }, [fetchPremium]);

  return {
    messagesCount: premium?.messagesCount ?? 0,
    limit: premium?.limit ?? 20,
    isPremium: premium?.isPremium ?? false,
    premiumUntil: premium?.premiumUntil ?? null,
    loading,
    refetch: fetchPremium,
  };
}
