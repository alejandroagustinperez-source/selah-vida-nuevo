import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const ADMIN_EMAIL = 'origenvitalsl@gmail.com';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token requerido' });
    }
    const token = auth.split(' ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return res.status(401).json({ error: 'Usuario no válido' });
    }

    if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    // ── 1. Summary counts ──
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: premiumUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_premium', true);

    const { count: freeUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_premium', false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: newToday } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // ── 2. Messages per day (last 7 days) ──
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { data: msgsByDay } = await supabase
      .from('analytics')
      .select('created_at')
      .eq('event_type', 'message_sent')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    const messagesPerDay = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      messagesPerDay[key] = 0;
    }
    (msgsByDay || []).forEach((ev) => {
      const key = ev.created_at?.slice(0, 10);
      if (key && key in messagesPerDay) messagesPerDay[key]++;
    });

    // ── 3. Top 5 countries ──
    const { data: countries } = await supabase
      .from('profiles')
      .select('country')
      .not('country', 'is', null);

    const countryCounts = {};
    (countries || []).forEach((p) => {
      if (p.country) countryCounts[p.country] = (countryCounts[p.country] || 0) + 1;
    });
    const topCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // ── 4. Top 5 cities ──
    const { data: cities } = await supabase
      .from('profiles')
      .select('city')
      .not('city', 'is', null);

    const cityCounts = {};
    (cities || []).forEach((p) => {
      if (p.city) cityCounts[p.city] = (cityCounts[p.city] || 0) + 1;
    });
    const topCities = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // ── 5. Games played ──
    const { data: gameEvents } = await supabase
      .from('analytics')
      .select('metadata')
      .eq('event_type', 'game_played');

    const gameCounts = {};
    (gameEvents || []).forEach((ev) => {
      const game = ev.metadata?.game || 'unknown';
      gameCounts[game] = (gameCounts[game] || 0) + 1;
    });
    const topGames = Object.entries(gameCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    // ── 6. Last 10 users ──
    const { data: lastUsers } = await supabase
      .from('profiles')
      .select('id, email, country, city, is_premium, created_at, gender')
      .order('created_at', { ascending: false })
      .limit(10);

    // ── 7. Premium vs Free ──
    const premiumVsFree = [
      { name: 'Premium', value: premiumUsers },
      { name: 'Free', value: freeUsers },
    ];

    return res.json({
      summary: { totalUsers, premiumUsers, freeUsers, newToday },
      messagesPerDay: Object.entries(messagesPerDay).map(([date, count]) => ({ date, count })),
      premiumVsFree,
      topCountries,
      topCities,
      topGames,
      lastUsers: (lastUsers || []).map((u) => ({
        email: u.email,
        country: u.country || '—',
        city: u.city || '—',
        isPremium: u.is_premium,
        createdAt: u.created_at,
        gender: u.gender || 'no especificado',
      })),
    });
  } catch (err) {
    console.error('Admin stats error:', err?.message || err);
    return res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
}
