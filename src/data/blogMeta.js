import { Hand, BookOpen, Heart, Shield, RefreshCw, DollarSign, Sun, Users, Moon, Flame, Sparkles, Feather, CloudRain, Compass } from 'lucide-react';

// Tipo de contenido (para los filtros)
export const TYPES = [
  { id: 'todos', label: 'Todos' },
  { id: 'oracion', label: 'Oraciones' },
  { id: 'versiculos', label: 'Versículos' },
  { id: 'ensenanza', label: 'Enseñanzas' },
];

export function getType(slug) {
  if (slug.startsWith('oracion')) return 'oracion';
  if (slug.startsWith('versiculos')) return 'versiculos';
  return 'ensenanza';
}

const TOPICS = [
  ['ansiedad', { icon: Feather, color: '#2C5F7A' }],
  ['soledad', { icon: Compass, color: '#6B5B8B' }],
  ['tristeza', { icon: CloudRain, color: '#2C5F7A' }],
  ['miedo', { icon: Shield, color: '#1C5A4A' }],
  ['perdon', { icon: RefreshCw, color: '#8B4A3A' }],
  ['economico', { icon: DollarSign, color: '#5A6B3A' }],
  ['desesperanza', { icon: Sun, color: '#B07A12' }],
  ['familia', { icon: Users, color: '#7A4B6B' }],
  ['muerte', { icon: Flame, color: '#5B6470' }],
  ['dormir', { icon: Moon, color: '#34507A' }],
  ['ruptura', { icon: Heart, color: '#9A3F4F' }],
  ['fortaleza', { icon: Shield, color: '#8A5A12' }],
  ['amor-de-dios', { icon: Heart, color: '#9A3F4F' }],
  ['mujeres', { icon: Sparkles, color: '#7A4B6B' }],
  ['paz-interior', { icon: Feather, color: '#2C6A5F' }],
  ['abandonado', { icon: Compass, color: '#6B5B8B' }],
  ['jovenes', { icon: Sparkles, color: '#B07A12' }],
];

export function getTopic(slug) {
  const s = slug.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const hit = TOPICS.find(([k]) => s.includes(k));
  return hit ? hit[1] : { icon: type2icon(getType(slug)), color: '#C9922A' };
}

function type2icon(t) {
  return t === 'oracion' ? Hand : BookOpen;
}

export function readingTime(html = '') {
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const MONTHS = { enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5, julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11 };
export function dateValue(d = '') {
  const m = d.match(/(\d+) de (\w+), (\d{4})/);
  return m ? new Date(+m[3], MONTHS[m[2].toLowerCase()] ?? 0, +m[1]).getTime() : 0;
}
