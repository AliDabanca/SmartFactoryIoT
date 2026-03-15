import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ─── İkonlar (SVG inline — Heroicons) ─────────────────────────────────────────
const IconThermo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
  </svg>
);

const IconSpeed = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 6v.01M6.343 6.343l.007.007M17.657 6.343l-.007.007M3 12h.01M21 12h-.01M12 21a9 9 0 110-18 9 9 0 010 18zm0 0v-6m0-4l-3 4h6l-3-4z" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M5.636 15.364A9 9 0 1118.364 8.636" />
  </svg>
);

const IconBox = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const IconGas = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const IconRefresh = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

// ─── Bileşenler ────────────────────────────────────────────────────────────────

/** Üst kısım: etiket + değer + alt bilgi */
function MetricCard({ icon, iconBg, iconColor, label, value, sub, subColor, alert, borderColor }) {
  const alertClass = alert
    ? 'border-neon-red shadow-glow-red animate-[pulse-red_1.5s_ease-in-out_infinite]'
    : `border-factory-border ${borderColor || ''}`;

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-factory-card backdrop-blur-sm p-5 flex items-start gap-4 transition-all duration-300 ${alertClass}`}>
      {/* İnce üst çizgi vurgusu */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${alert ? 'bg-neon-red' : (borderColor ? '' : 'bg-neon-cyan/40')}`} />

      <div className={`p-3 rounded-xl ${iconBg} ${iconColor} flex-shrink-0`}>
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono uppercase tracking-widest text-factory-muted mb-1">{label}</p>
        <p className="text-3xl font-display font-bold text-factory-dark leading-none">{value}</p>
        {sub && (
          <p className={`text-xs font-mono mt-2 ${subColor || 'text-factory-muted'}`}>{sub}</p>
        )}
      </div>
    </div>
  );
}

/** Özel Tooltip */
function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1428] border border-neon-cyan/20 rounded-xl px-4 py-3 shadow-glow-cyan">
      <p className="text-neon-cyan font-mono text-xs mb-1">{label}</p>
      <p className="text-factory-dark font-display font-bold text-lg">
        {payload[0].value}°C
      </p>
    </div>
  );
}

// ─── Ana Bileşen ───────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData]     = useState([]);
  const [latest, setLatest] = useState({});
  const [restocking, setRestocking] = useState(false);
  const [restockMsg, setRestockMsg] = useState('');

  // Veri çekme
  const fetchData = async () => {
    const { data: rows, error } = await supabase
      .from('factory_telemetry')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) { console.error('Fetch hatası:', error); return; }
    const chartData = rows.reverse();
    setData(chartData);
    setLatest(chartData[chartData.length - 1] || {});
  };

  // Stok yenileme komutu
  const handleRestock = async () => {
    setRestocking(true);
    setRestockMsg('');
    const { error } = await supabase
      .from('factory_commands')
      .insert([{ type: 'RESTOCK', created_at: new Date() }]);
    setRestocking(false);
    if (error) {
      console.error('Komut gönderilemedi:', error.message);
      setRestockMsg('⚠ Komut gönderilemedi!');
    } else {
      setRestockMsg('✓ Komut gönderildi');
      setTimeout(() => setRestockMsg(''), 3000);
    }
  };

  useEffect(() => {
    fetchData();
    const subscription = supabase
      .channel('factory-updates')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'factory_telemetry' },
        (payload) => {
          setData(prev => [...prev.slice(-19), payload.new]);
          setLatest(payload.new);
        })
      .subscribe();
    return () => subscription.unsubscribe();
  }, []);

  // Türetilmiş durum
  const isCriticalTemp = Number(latest.temp) > 50;
  const isGasAlert     = !!latest.gas_alert;
  const isAnyAlert     = isCriticalTemp || isGasAlert;
  const speedLabel     = latest.speed == null
    ? '—'
    : `%${latest.speed}`;
  const speedSub = latest.speed === 0
    ? '⬛ BANT DURDU'
    : latest.status === 'running'
    ? '▶ ÇALIŞIYOR'
    : `${latest.status ?? '—'}`;
  const speedSubColor = latest.speed === 0
    ? 'text-neon-red font-bold'
    : latest.status === 'running'
    ? 'text-neon-green'
    : 'text-factory-muted';

  return (
    <div className="min-h-screen bg-factory-bg bg-grid-pattern bg-grid font-display text-factory-dark relative overflow-x-hidden">

      {/* Tarama çizgisi efekti */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)' }} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-blink" />
              <span className="text-xs font-mono text-neon-cyan tracking-widest uppercase">Live Feed — Realtime</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight leading-none">
              Smart Factory
              <span className="text-neon-cyan"> Dashboard</span>
            </h1>
          </div>

          {/* Sistem durumu rozeti */}
          <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full border font-mono text-sm font-semibold transition-all ${
            isAnyAlert
              ? 'bg-neon-red/10 border-neon-red text-neon-red shadow-glow-red animate-pulse'
              : 'bg-neon-green/10 border-neon-green text-neon-green shadow-glow-green'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isAnyAlert ? 'bg-neon-red animate-ping' : 'bg-neon-green'}`} />
            {isAnyAlert ? 'ALARM: KRİTİK DURUM' : 'SİSTEM: GÜVENLİ'}
          </div>
        </header>

        {/* ── Metrik Kartları ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          {/* Sıcaklık */}
          <MetricCard
            icon={<IconThermo />}
            iconBg="bg-orange-500/10"
            iconColor="text-orange-400"
            label="Sıcaklık"
            value={latest.temp != null ? `${latest.temp}°C` : '—'}
            sub={isCriticalTemp ? '🔴 KRİTİK EŞİK AŞILDI' : '● Normal aralıkta'}
            subColor={isCriticalTemp ? 'text-neon-red font-bold animate-blink' : 'text-neon-green'}
            alert={isCriticalTemp}
          />

          {/* Bant Hızı */}
          <MetricCard
            icon={<IconSpeed />}
            iconBg="bg-cyan-500/10"
            iconColor="text-neon-cyan"
            label="Bant Hızı"
            value={speedLabel}
            sub={speedSub}
            subColor={speedSubColor}
            alert={latest.speed === 0}
          />

          {/* Stok */}
          <div className={`relative overflow-hidden rounded-2xl border bg-factory-card backdrop-blur-sm p-5 flex flex-col gap-4 transition-all duration-300 ${
            latest.restock_needed
              ? 'border-neon-red shadow-glow-red'
              : 'border-factory-border'
          }`}>
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${latest.restock_needed ? 'bg-neon-red' : 'bg-neon-purple/40'}`} />

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-neon-purple flex-shrink-0">
                <IconBox />
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-factory-muted mb-1">Stok</p>
                <p className="text-3xl font-display font-bold text-factory-dark leading-none">
                  {latest.stock ?? '—'}
                </p>
                {latest.restock_needed && (
                  <p className="text-xs font-mono mt-2 text-neon-red font-bold animate-blink">⬛ KRİTİK STOK!</p>
                )}
              </div>
            </div>

            {/* Stok Yenile Butonu */}
            <button
              onClick={handleRestock}
              disabled={restocking}
              className="w-full relative overflow-hidden rounded-xl py-2.5 px-4 font-mono font-bold text-sm tracking-wider
                bg-gradient-to-r from-neon-purple/80 to-neon-cyan/80
                hover:from-neon-purple hover:to-neon-cyan
                disabled:opacity-50 disabled:cursor-not-allowed
                text-[#0a0f1e] shadow-glow-cyan
                transition-all duration-200 flex items-center justify-center gap-2
                active:scale-95"
            >
              <IconRefresh />
              {restocking ? 'GÖNDERİLİYOR...' : 'STOK YENİLE'}
            </button>
            {restockMsg && (
              <p className="text-xs font-mono text-center text-neon-green -mt-2">{restockMsg}</p>
            )}
          </div>

          {/* Gaz Alarmı */}
          <MetricCard
            icon={<IconGas />}
            iconBg={isGasAlert ? 'bg-red-500/20' : 'bg-green-500/10'}
            iconColor={isGasAlert ? 'text-neon-red' : 'text-neon-green'}
            label="Gaz Sensörü"
            value={isGasAlert ? 'TEHLİKE' : 'GÜVENLİ'}
            sub={isGasAlert ? '☠ GAZ ALGILANDI — TAHLİYE' : '● Ortam temiz'}
            subColor={isGasAlert ? 'text-neon-red font-bold animate-blink' : 'text-neon-green'}
            alert={isGasAlert}
          />
        </div>

        {/* ── Grafik ────────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl border border-factory-border bg-factory-card p-6 md:p-8">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-neon-cyan/40" />

          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-neon-cyan mb-1">Time Series</p>
              <h3 className="text-xl font-display font-bold text-factory-dark">
                Sıcaklık Değişimi
              </h3>
            </div>
            <button
              onClick={fetchData}
              className="p-2.5 rounded-xl border border-factory-border hover:border-neon-cyan hover:text-neon-cyan text-factory-muted transition-all duration-200 active:scale-95"
            >
              <IconRefresh />
            </button>
          </div>

          <ResponsiveContainer width="100%" height={300} debounce={1}>
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="rgba(30,45,69,0.8)"
                vertical={false}
              />
              <XAxis dataKey="created_at" hide />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#475569', fontFamily: 'JetBrains Mono, monospace' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<DarkTooltip />} />
              {/* 50°C kritik çizgi */}
              <ReferenceLine
                y={50}
                stroke="rgba(239,68,68,0.4)"
                strokeDasharray="6 3"
                label={{ value: '50°C', fill: 'rgba(239,68,68,0.7)', fontSize: 11, fontFamily: 'monospace' }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#22d3ee"
                strokeWidth={2.5}
                dot={{ r: 3, strokeWidth: 2, fill: '#0a0f1e', stroke: '#22d3ee' }}
                activeDot={{ r: 5, fill: '#22d3ee', stroke: '#0a0f1e', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <footer className="mt-6 text-center text-xs font-mono text-factory-muted opacity-50">
          SMART FACTORY CTRL v2.0 — SUPABASE REALTIME CONNECTED
        </footer>
      </div>
    </div>
  );
}