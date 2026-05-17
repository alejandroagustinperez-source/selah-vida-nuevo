import { supabase } from '../supabase';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function trackEvent(eventType, metadata = {}) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    await fetch(`${API_BASE}/analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ event_type: eventType, metadata }),
    });
  } catch (err) {
    // Silently fail tracking
  }
}

export async function updateLocation(country, city) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    await fetch(`${API_BASE}/analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ event_type: 'location_update', country, city }),
    });
  } catch (err) {
    // Silently fail
  }
}
