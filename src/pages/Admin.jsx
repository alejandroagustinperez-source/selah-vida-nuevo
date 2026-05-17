import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const ADMIN_EMAIL = 'alejandro.agustin.perez@gmail.com';

const COLORS = { gold: '#C9A84C', cream: '#FAF6EF', blue: '#1a3a4a' };
const PIE_COLORS = ['#C9A84C', '#3a3a5c'];

function Card({ title, value, subtitle, icon }) {
  return (
    <div className="rounded-xl bg-[#16213e] border border-[#1e2d4a] p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-gray-500">{subtitle}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  );
}

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
      navigate('/chat', { replace: true });
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (!res.ok) throw new Error('Error fetching stats');
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) return null;
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: '#1a1a2e' }}>
        <div className="text-gold text-lg animate-pulse">Cargando dashboard…</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: '#1a1a2e' }}>
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  const { summary, messagesPerDay, premiumVsFree, topCountries, topCities, topGames, genderBreakdown, lastUsers } = data;
  const maxMsgs = Math.max(...messagesPerDay.map((d) => d.count), 1);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-[#1e2d4a] border border-[#2a3d5e] rounded-lg px-3 py-2 text-xs text-white shadow-lg">
          <p>{label}</p>
          <p className="text-gold font-semibold">{payload[0].value} mensajes</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: '#1a1a2e' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white font-serif">📊 Dashboard</h1>
            <p className="text-xs text-gray-500 mt-0.5">Panel de administración de Selah Vida</p>
          </div>
          <button onClick={fetchData} className="text-xs text-gold hover:text-gold-dark bg-gold/10 px-3 py-1.5 rounded-lg transition-colors">
            ↻ Actualizar
          </button>
        </div>

        {/* FILA 1 - Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card icon="👥" value={summary.totalUsers} title="Usuarios registrados" subtitle="" />
          <Card icon="👑" value={summary.premiumUsers} title="Usuarios Premium" subtitle={`${summary.totalUsers ? Math.round(summary.premiumUsers / summary.totalUsers * 100) : 0}% del total`} />
          <Card icon="🆓" value={summary.freeUsers} title="Usuarios Free" subtitle="" />
          <Card icon="📈" value={summary.newToday} title="Nuevos hoy" subtitle="últimas 24h" />
        </div>

        {/* FILA 2 - Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bar chart - messages per day */}
          <div className="rounded-xl bg-[#16213e] border border-[#1e2d4a] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">💬 Mensajes enviados por día</h3>
            {messagesPerDay.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={messagesPerDay} barCategoryGap="30%">
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => v.slice(5)} />
                  <YAxis hide domain={[0, 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill={COLORS.gold} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-500 text-xs">Sin datos</div>
            )}
          </div>

          {/* Pie chart - premium vs free */}
          <div className="rounded-xl bg-[#16213e] border border-[#1e2d4a] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">👑 Premium vs Free</h3>
            {summary.totalUsers > 0 ? (
              <div className="flex items-center justify-center gap-6">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={premiumVsFree} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={4}>
                      {premiumVsFree.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {premiumVsFree.map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[idx] }} />
                      <span className="text-gray-400">{item.name}</span>
                      <span className="text-white font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[160px] flex items-center justify-center text-gray-500 text-xs">Sin datos</div>
            )}
          </div>
        </div>

        {/* FILA 3 - Rankings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Top countries */}
          <div className="rounded-xl bg-[#16213e] border border-[#1e2d4a] p-5">
            <h3 className="text-sm font-semibold text-white mb-3">🌍 Top países</h3>
            {topCountries.length > 0 ? (
              <div className="space-y-2">
                {topCountries.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 w-4">{i + 1}.</span>
                    <span className="flex-1 text-gray-300 truncate">{c.name}</span>
                    <span className="text-gold font-semibold">{c.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500">Sin datos</div>
            )}
          </div>

          {/* Top cities */}
          <div className="rounded-xl bg-[#16213e] border border-[#1e2d4a] p-5">
            <h3 className="text-sm font-semibold text-white mb-3">🏙️ Top ciudades</h3>
            {topCities.length > 0 ? (
              <div className="space-y-2">
                {topCities.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 w-4">{i + 1}.</span>
                    <span className="flex-1 text-gray-300 truncate">{c.name}</span>
                    <span className="text-gold font-semibold">{c.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500">Sin datos</div>
            )}
          </div>

          {/* Top games */}
          <div className="rounded-xl bg-[#16213e] border border-[#1e2d4a] p-5">
            <h3 className="text-sm font-semibold text-white mb-3">🎮 Juegos más jugados</h3>
            {topGames.length > 0 ? (
              <div className="space-y-2">
                {topGames.map((g, i) => (
                  <div key={g.name} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 w-4">{i + 1}.</span>
                    <span className="flex-1 text-gray-300 truncate capitalize">{g.name}</span>
                    <span className="text-gold font-semibold">{g.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500">Sin datos</div>
            )}
          </div>

          {/* Gender */}
          <div className="rounded-xl bg-[#16213e] border border-[#1e2d4a] p-5">
            <h3 className="text-sm font-semibold text-white mb-3">⚧️ Por género</h3>
            {genderBreakdown && genderBreakdown.some((g) => g.value > 0) ? (
              <div className="space-y-2">
                {genderBreakdown.map((g) => (
                  <div key={g.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{
                      background: g.name === 'Hombre' ? '#60a5fa' : g.name === 'Mujer' ? '#f472b6' : '#6b7280'
                    }} />
                    <span className="flex-1 text-gray-300">{g.name}</span>
                    <span className="text-gold font-semibold">{g.value}</span>
                    <span className="text-gray-500 text-[10px]">
                      ({summary.totalUsers ? Math.round(g.value / summary.totalUsers * 100) : 0}%)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500">
                <p>Los usuarios pueden especificar su género en el perfil.</p>
              </div>
            )}
          </div>
        </div>

        {/* FILA 4 - Last users table */}
        <div className="rounded-xl bg-[#16213e] border border-[#1e2d4a] p-5">
          <h3 className="text-sm font-semibold text-white mb-4">👤 Últimos 10 usuarios registrados</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-500 border-b border-[#1e2d4a]">
                  <th className="text-left py-2 pr-4 font-medium">Email</th>
                  <th className="text-left py-2 pr-4 font-medium">País</th>
                  <th className="text-left py-2 pr-4 font-medium">Ciudad</th>
                  <th className="text-left py-2 pr-4 font-medium">Plan</th>
                  <th className="text-left py-2 pr-4 font-medium">Género</th>
                  <th className="text-left py-2 font-medium">Registro</th>
                </tr>
              </thead>
              <tbody>
                {lastUsers.map((u) => (
                  <tr key={u.email} className="border-b border-[#1e2d4a]/50 hover:bg-[#1a2a45] transition-colors">
                    <td className="py-2.5 pr-4 text-white truncate max-w-[160px]">{u.email}</td>
                    <td className="py-2.5 pr-4 text-gray-300">{u.country}</td>
                    <td className="py-2.5 pr-4 text-gray-300">{u.city}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${u.isPremium ? 'bg-gold/20 text-gold' : 'bg-gray-700/50 text-gray-400'}`}>
                        {u.isPremium ? 'Premium' : 'Free'}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-gray-300">{u.gender}</td>
                    <td className="py-2.5 text-gray-400 whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
