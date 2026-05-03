import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine,
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ─── İkonlar ──────────────────────────────────────────────────────────────────
const IconThermo = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" /></svg>;
const IconSpeed = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v.01M6.343 6.343l.007.007M17.657 6.343l-.007.007M3 12h.01M21 12h-.01M12 21a9 9 0 110-18 9 9 0 010 18zm0 0v-6m0-4l-3 4h6l-3-4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 15.364A9 9 0 1118.364 8.636" /></svg>;
const IconBox = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const IconGas = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;
const IconRefresh = ({ spinning = false }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} style={spinning ? { animationDuration: '0.7s' } : {}}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;
const IconDroplet = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C12 2 5 10.5 5 14.5a7 7 0 0014 0C19 10.5 12 2 12 2z" /></svg>;
const IconChart = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>;
const IconActivity = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const IconCalendar = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconLock = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const IconUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconUsersGroup = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;

// ─── YARDIMCI KART BİLEŞENLERİ (MetricCard, GasCard vb. Aynı) ───
function MetricCard({ icon, iconBg, iconColor, label, value, sub, subColor, alert }) {
  const alertClass = alert ? 'border-neon-red shadow-glow-red animate-[pulse-red_1.5s_ease-in-out_infinite]' : 'border-factory-border';
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-factory-card backdrop-blur-sm p-5 flex items-start gap-4 transition-all duration-300 ${alertClass}`}>
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${alert ? 'bg-neon-red' : 'bg-neon-cyan/40'}`} />
      <div className={`p-3 rounded-xl ${iconBg} ${iconColor} flex-shrink-0`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono uppercase tracking-widest text-factory-muted mb-1">{label}</p>
        <p className="text-3xl font-display font-bold text-factory-dark leading-none">{value}</p>
        {sub && <p className={`text-xs font-mono mt-2 ${subColor || 'text-factory-muted'}`}>{sub}</p>}
      </div>
    </div>
  );
}

function GasCard({ latest }) {
  const level = Number(latest.gas_level) || 0;
  const isDanger = level > 70;
  const isWarning = level > 40 && level <= 70;
  let style = { bg: 'bg-green-500/10', text: 'text-neon-green', label: 'GÜVENLİ', sub: '● Ortam temiz', border: 'border-factory-border', line: 'bg-neon-green/40', bar: 'bg-neon-green' };
  if (isDanger) style = { bg: 'bg-red-500/20', text: 'text-neon-red', label: 'TEHLİKE', sub: '☠ ACİL TAHLİYE', border: 'border-neon-red shadow-glow-red animate-[pulse-red_1.5s_ease-in-out_infinite]', line: 'bg-neon-red', bar: 'bg-neon-red' };
  else if (isWarning) style = { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'UYARI', sub: '⚠ Sızıntı Şüphesi', border: 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]', line: 'bg-yellow-400', bar: 'bg-yellow-400' };

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-factory-card backdrop-blur-sm p-5 flex flex-col gap-3 transition-all duration-300 ${style.border}`}>
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${style.line}`} />
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl flex-shrink-0 ${style.bg} ${style.text}`}><IconGas /></div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono uppercase tracking-widest text-factory-muted mb-1">Gaz Seviyesi</p>
          <div className="flex items-end gap-2"><p className={`text-3xl font-display font-bold leading-none ${style.text}`}>%{level}</p></div>
          <p className={`text-xs font-mono mt-2 font-bold ${style.text} ${isDanger ? 'animate-blink' : ''}`}>{style.sub}</p>
        </div>
      </div>
      <div className="w-full h-1.5 bg-[#0a0f1e] rounded-full mt-1 overflow-hidden border border-[#1e2d45]">
        <div className={`h-full transition-all duration-500 ${style.bar}`} style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}

function HumidityCard({ latest, historyData }) {
  const humidity = latest.humidity ?? null;
  const isHighHumid = humidity != null && humidity > 70;
  const sparkData = historyData.slice(-10).map((d, i) => ({ i, h: d.humidity ?? 0 }));
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-factory-card backdrop-blur-sm p-5 flex flex-col gap-3 transition-all duration-300 ${isHighHumid ? 'border-neon-red shadow-glow-red animate-[pulse-red_1.5s_ease-in-out_infinite]' : 'border-factory-border'}`}>
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${isHighHumid ? 'bg-neon-red' : 'bg-blue-400/40'}`} />
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl flex-shrink-0 ${isHighHumid ? 'bg-red-500/10 text-neon-red' : 'bg-blue-500/10 text-blue-400'}`}><IconDroplet /></div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono uppercase tracking-widest text-factory-muted mb-1">Nem</p>
          <p className="text-3xl font-display font-bold text-factory-dark leading-none">{humidity != null ? `%${humidity}` : '—'}</p>
          <p className={`text-xs font-mono mt-2 ${isHighHumid ? 'text-neon-red font-bold animate-blink' : 'text-blue-400'}`}>{isHighHumid ? '💧 YÜKSEK NEM UYARISI' : '● Normal aralıkta'}</p>
        </div>
      </div>
      {sparkData.length > 1 && (
        <div className="w-full h-[52px] mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
              <defs><linearGradient id="humidGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={isHighHumid ? '#ef4444' : '#60a5fa'} stopOpacity={0.3} /><stop offset="95%" stopColor={isHighHumid ? '#ef4444' : '#60a5fa'} stopOpacity={0} /></linearGradient></defs>
              <Area type="monotone" dataKey="h" stroke={isHighHumid ? '#ef4444' : '#60a5fa'} strokeWidth={1.8} fill="url(#humidGrad)" dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function StockCard({ latest, restocking, restockMsg, onRestock, isAdmin }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-factory-card backdrop-blur-sm p-5 flex flex-col gap-4 transition-all duration-300 ${latest.restock_needed ? 'border-neon-red shadow-glow-red' : 'border-factory-border'}`}>
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${latest.restock_needed ? 'bg-neon-red' : 'bg-neon-purple/40'}`} />
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-purple-500/10 text-neon-purple flex-shrink-0"><IconBox /></div>
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-factory-muted mb-1">Stok</p>
          <p className="text-3xl font-display font-bold text-factory-dark leading-none">{latest.stock ?? '—'}</p>
          {latest.restock_needed && <p className="text-xs font-mono mt-2 text-neon-red font-bold animate-blink">⬛ KRİTİK STOK!</p>}
        </div>
      </div>
      {/* RBAC: Sadece Admin ise Buton Tıklanabilir */}
      <button onClick={onRestock} disabled={restocking || !isAdmin}
        title={!isAdmin ? "Bu işlem için Yetkiniz Yok" : ""}
        className="w-full relative overflow-hidden rounded-xl py-2.5 px-4 font-mono font-bold text-sm tracking-wider bg-gradient-to-r from-neon-purple/80 to-neon-cyan/80 hover:from-neon-purple hover:to-neon-cyan disabled:opacity-30 disabled:cursor-not-allowed text-[#0a0f1e] shadow-glow-cyan transition-all duration-200 flex items-center justify-center gap-2 active:scale-95">
        <IconRefresh spinning={restocking} /> {restocking ? 'GÖNDERİLİYOR...' : (!isAdmin ? 'YETKİ YOK' : 'STOK YENİLE')}
      </button>
      {restockMsg && !restocking && <p className="text-xs font-mono text-center text-neon-green -mt-2">{restockMsg}</p>}
    </div>
  );
}

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1428] border border-neon-cyan/30 rounded-xl px-4 py-3 shadow-glow-cyan">
      {label && <p className="text-xs text-factory-muted mb-1">{label}</p>}
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }} className="font-display font-bold text-lg">{entry.name}: {entry.value}</p>
      ))}
    </div>
  );
}

// ─── GİRİŞ (LOGIN) EKRANI BİLEŞENİ ───
function LoginScreen({ onLogin, authError, isLoading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-factory-bg bg-grid-pattern bg-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a0f1e] border border-factory-border rounded-2xl p-8 shadow-[0_0_40px_rgba(34,211,238,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan to-neon-purple" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-cyan/10 text-neon-cyan mb-4">
            <IconLock />
          </div>
          <h2 className="text-3xl font-display font-black text-white tracking-tight">Sisteme Giriş</h2>
          <p className="text-sm font-mono text-factory-muted mt-2">Endüstriyel IoT Yönetim Paneli</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-factory-muted mb-1 uppercase tracking-wider">E-Posta Adresi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-factory-muted"><IconUser /></div>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d1428] border border-factory-border text-white text-sm rounded-lg focus:ring-neon-cyan focus:border-neon-cyan block pl-10 p-2.5 font-mono" placeholder="yonetici@fabrika.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono text-factory-muted mb-1 uppercase tracking-wider">Şifre</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0d1428] border border-factory-border text-white text-sm rounded-lg focus:ring-neon-cyan focus:border-neon-cyan block p-2.5 font-mono" placeholder="••••••••" />
          </div>

          {authError && <div className="text-neon-red text-xs font-mono font-bold text-center bg-red-500/10 py-2 rounded border border-red-500/20">{authError}</div>}

          <button type="submit" disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-neon-cyan to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-[#0a0f1e] font-mono font-bold rounded-xl transition-all shadow-glow-cyan active:scale-95 disabled:opacity-50">
            {isLoading ? 'DOĞRULANIYOR...' : 'GÜVENLİ GİRİŞ YAP'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── ANA BİLEŞEN (DASHBOARD) ───────────────────────────────────────────────────
export default function App() {

  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('viewer');
  const [userMsg, setUserMsg] = useState({ text: '', type: '' });

  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState('live');
  const [timeRange, setTimeRange] = useState('monthly');
  const [historyData, setHistoryData] = useState([]);
  const [liveData, setLiveData] = useState([]);
  const [latest, setLatest] = useState({});
  const [restocking, setRestocking] = useState(false);
  const [restockMsg, setRestockMsg] = useState('');
  const waitingForConfirm = useRef(false);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setUserMsg({ text: 'Oluşturuluyor...', type: 'loading' });
    try {
      const res = await fetch('http://localhost:3001/api/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, password: newPassword, role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        setUserMsg({ text: '✅ Çalışan başarıyla eklendi!', type: 'success' });
        setNewEmail(''); setNewPassword('');
        setTimeout(() => setUserMsg({ text: '', type: '' }), 4000);
      } else {
        setUserMsg({ text: `❌ Hata: ${data.message}`, type: 'error' });
      }
    } catch (err) {
      setUserMsg({ text: '❌ Backend API sunucusuna ulaşılamadı (Port 3001)', type: 'error' });
    }
  };

  // ─── AUTH (GİRİŞ) İŞLEMLERİ ───
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkUserRole(session.user.id);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkUserRole(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email, password) => {
    setAuthLoading(true); setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError('Giriş Başarısız: Bilgilerinizi kontrol edin.');
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const checkUserRole = async (userId) => {
    const { data, error } = await supabase.from('user_roles').select('role').eq('user_id', userId).single();
    if (data && data.role === 'admin') setIsAdmin(true);
    else setIsAdmin(false);
  };

  // ─── VERİ ÇEKME VE SİMÜLASYON ───
  const fetchData = async () => {
    const { data: rows, error } = await supabase.from('factory_telemetry').select('*').order('created_at', { ascending: false }).limit(1000);
    if (error || !rows) return;
    const chartData = rows.reverse();
    setHistoryData(chartData);
    setLiveData(chartData.slice(-30));
    setLatest(chartData[chartData.length - 1] || {});
  };

  const sendCommand = async (cmdType) => {
    if (!isAdmin) return; // RBAC Güvenliği
    const { error } = await supabase.from('factory_commands').insert([{ type: cmdType, target_line: 'line_01', created_at: new Date() }]);
    if (error) console.error('Yetki/Komut Hatası:', error.message);
  };

  const handleRestock = async () => {
    if (!isAdmin) return;
    setRestocking(true); setRestockMsg(''); waitingForConfirm.current = true;
    const { error } = await supabase.from('factory_commands').insert([{ type: 'RESTOCK', created_at: new Date() }]);
    if (error) { setRestockMsg('⚠ Yetkiniz Yok!'); setRestocking(false); waitingForConfirm.current = false; return; }
    setTimeout(() => {
      if (waitingForConfirm.current) { waitingForConfirm.current = false; setRestocking(false); setRestockMsg('⚠ Zaman aşımı'); setTimeout(() => setRestockMsg(''), 3000); }
    }, 15000);
  };

  useEffect(() => {
    if (!session) return; // Sadece giriş yapmışsa veriyi dinle
    fetchData();
    const subscription = supabase.channel('factory-updates').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'factory_telemetry' }, (payload) => {
      setHistoryData(prev => [...prev, payload.new]);
      setLiveData(prev => [...prev.slice(-29), payload.new]);
      setLatest(payload.new);
      if (waitingForConfirm.current && payload.new.stock >= 500) {
        waitingForConfirm.current = false; setRestocking(false); setRestockMsg('✓ Stok güncellendi'); setTimeout(() => setRestockMsg(''), 3000);
      }
    }).subscribe();
    return () => subscription.unsubscribe();
  }, [session]);

  // Auth Yükleniyorsa Ekranı
  if (authLoading) return <div className="min-h-screen bg-factory-bg flex items-center justify-center"><IconRefresh spinning /></div>;

  // Giriş Yapılmamışsa Login Ekranı
  if (!session) return <LoginScreen onLogin={handleLogin} authError={authError} isLoading={authLoading} />;

  // ─── ANALİZ VERİLERİ VE DASHBOARD EKRANI ───
  const cutoffDate = new Date();
  if (timeRange === 'daily') cutoffDate.setDate(cutoffDate.getDate() - 1);
  else if (timeRange === 'weekly') cutoffDate.setDate(cutoffDate.getDate() - 7);
  else cutoffDate.setDate(cutoffDate.getDate() - 30);

  const filteredHistory = historyData.filter(d => new Date(d.created_at) >= cutoffDate);
  const runningCount = filteredHistory.filter(d => d.status === 'running').length;
  const uptimePercent = filteredHistory.length > 0 ? Math.round((runningCount / filteredHistory.length) * 100) : 0;
  const totalConsumption = runningCount * 20;
  const avgDailyConsumption = timeRange === 'daily' ? totalConsumption : Math.round(totalConsumption / (timeRange === 'weekly' ? 7 : 30));
  const maxTemp = filteredHistory.length > 0 ? Math.max(...filteredHistory.map(d => d.temp || 0)).toFixed(1) : 0;
  const criticalCount = filteredHistory.filter(d => d.status === 'Acil Tahliye!').length;

  const statusCounts = filteredHistory.reduce((acc, curr) => { acc[curr.status] = (acc[curr.status] || 0) + 1; return acc; }, {});
  const pieData = Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] }));
  const COLORS = { 'running': '#10b981', 'Gaz Uyarısı!': '#eab308', 'Acil Tahliye!': '#ef4444', 'Stok Tükendi!': '#64748b' };

  const barDataMap = filteredHistory.reduce((acc, curr) => {
    const d = new Date(curr.created_at);
    const key = timeRange === 'daily' ? d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
    if (!acc[key]) acc[key] = { date: key, tempSum: 0, gasSum: 0, count: 0 };
    acc[key].tempSum += curr.temp; acc[key].gasSum += curr.gas_level; acc[key].count += 1;
    return acc;
  }, {});
  const barData = Object.values(barDataMap).map(d => ({ date: d.date, 'Ort. Sıcaklık': Math.round(d.tempSum / d.count), 'Ort. Gaz': Math.round(d.gasSum / d.count) }));

  const isCriticalTemp = Number(latest.temp) > 50;
  const isAnyAlert = isCriticalTemp || !!latest.gas_alert || Number(latest.humidity) > 70;
  const speedLabel = latest.speed == null ? '—' : `%${latest.speed}`;
  const speedSub = latest.speed === 0 ? '⬛ BANT DURDU' : latest.status === 'running' ? '▶ ÇALIŞIYOR' : `${latest.status ?? '—'}`;

  return (
    <div className="min-h-screen bg-factory-bg bg-grid-pattern bg-grid font-display text-factory-dark relative overflow-x-hidden pb-10">
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)' }} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* HEADER & TABS & LOGOUT */}
        <header className="flex flex-col mb-10 gap-6 border-b border-factory-border pb-6">
          <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-neon-cyan animate-blink" />
                <span className="text-xs font-mono text-neon-cyan tracking-widest uppercase">Endüstri 4.0 // {isAdmin ? 'Yetkili Mod' : 'İzleyici Modu'}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight leading-none">Smart Factory<span className="text-neon-cyan"> Dashboard</span></h1>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex bg-[#0a0f1e] p-1.5 rounded-xl border border-factory-border shadow-md">
                <button onClick={() => setActiveTab('live')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-mono text-xs font-bold transition-all ${activeTab === 'live' ? 'bg-neon-cyan/20 text-neon-cyan shadow-glow-cyan' : 'text-factory-muted hover:text-white'}`}><IconActivity /> CANLI İZLEME</button>
                <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-mono text-xs font-bold transition-all ${activeTab === 'analytics' ? 'bg-neon-purple/20 text-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'text-factory-muted hover:text-white'}`}><IconChart /> SİSTEM ANALİZİ</button>
              </div>
              {isAdmin && (
                <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-mono text-xs font-bold transition-all ${activeTab === 'users' ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-factory-muted hover:text-white'}`}><IconUsersGroup /> YÖNETİM</button>
              )}
              <button onClick={handleLogout} className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg font-mono text-xs font-bold transition-all">ÇIKIŞ YAP</button>
            </div>
          </div>
        </header>

        {/* ── LIVE TAB ── */}
        {activeTab === 'live' && (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-5 mb-8">
              <div className="flex flex-col items-center justify-center w-full md:w-auto p-4 rounded-2xl bg-[#0a0f1e] border-2 border-factory-border shadow-[0_0_20px_rgba(34,211,238,0.05)]">
                <div className="flex items-center justify-center w-full gap-2 mb-3 px-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                  <p className="text-[10px] font-mono text-factory-muted tracking-widest uppercase text-center">TEST & SİMÜLASYON KONTROLÜ</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button onClick={() => sendCommand('SIMULATE_LEAK')} disabled={!isAdmin} className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/30 text-yellow-400 border border-yellow-500/50 rounded-xl font-mono text-xs font-black tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"><span className="text-lg">☢️</span> SIZINTI</button>
                  <button onClick={() => sendCommand('STOP_SIMULATION')} disabled={!isAdmin} className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 hover:from-emerald-500/30 text-neon-green border border-emerald-500/50 rounded-xl font-mono text-xs font-black tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"><span className="text-lg">✅</span> NORMALE DÖN</button>
                </div>
              </div>
              <div className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 font-mono text-sm font-bold transition-all h-full w-full md:w-auto ${isAnyAlert ? 'bg-neon-red/10 border-neon-red text-neon-red shadow-glow-red animate-pulse' : 'bg-neon-green/10 border-neon-green text-neon-green shadow-glow-green'}`}><span className={`w-3 h-3 rounded-full ${isAnyAlert ? 'bg-neon-red animate-ping' : 'bg-neon-green'}`} />{isAnyAlert ? 'SİSTEM: KRİTİK' : 'SİSTEM: GÜVENLİ'}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="lg:col-span-1"><MetricCard icon={<IconThermo />} iconBg="bg-orange-500/10" iconColor="text-orange-400" label="Sıcaklık" value={latest.temp != null ? `${latest.temp}°C` : '—'} sub={isCriticalTemp ? '🔴 KRİTİK EŞİK AŞILDI' : '● Normal aralıkta'} alert={isCriticalTemp} /></div>
              <div className="lg:col-span-1"><MetricCard icon={<IconSpeed />} iconBg="bg-cyan-500/10" iconColor="text-neon-cyan" label="Bant Hızı" value={speedLabel} sub={speedSub} alert={latest.speed === 0} /></div>
              <div className="lg:col-span-1"><HumidityCard latest={latest} historyData={liveData} /></div>
              <div className="lg:col-span-1"><StockCard latest={latest} restocking={restocking} restockMsg={restockMsg} onRestock={handleRestock} isAdmin={isAdmin} /></div>
              <div className="lg:col-span-1"><GasCard latest={latest} /></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative overflow-hidden rounded-2xl border border-factory-border bg-factory-card p-6"><div className="absolute top-0 left-0 right-0 h-[2px] bg-neon-cyan/40" /><p className="text-xs font-mono uppercase tracking-widest text-factory-muted mb-6">Canlı Sıcaklık Akışı (°C)</p><ResponsiveContainer width="100%" height={260}><LineChart data={liveData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}><CartesianGrid strokeDasharray="4 4" stroke="rgba(30,45,69,0.8)" vertical={false} /><XAxis dataKey="created_at" hide /><YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} /><RechartsTooltip content={<DarkTooltip />} /><ReferenceLine y={50} stroke="rgba(239,68,68,0.4)" strokeDasharray="6 3" label={{ value: 'Kritik (50°C)', fill: 'rgba(239,68,68,0.7)', fontSize: 11 }} /><Line type="monotone" dataKey="temp" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 3, fill: '#0a0f1e', stroke: '#22d3ee' }} isAnimationActive={false} /></LineChart></ResponsiveContainer></div>
              <div className="relative overflow-hidden rounded-2xl border border-factory-border bg-factory-card p-6"><div className="absolute top-0 left-0 right-0 h-[2px] bg-yellow-400/40" /><p className="text-xs font-mono uppercase tracking-widest text-factory-muted mb-6">Canlı Gaz Seviyesi (%)</p><ResponsiveContainer width="100%" height={260}><LineChart data={liveData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}><CartesianGrid strokeDasharray="4 4" stroke="rgba(30,45,69,0.8)" vertical={false} /><XAxis dataKey="created_at" hide /><YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} /><RechartsTooltip content={<DarkTooltip />} /><ReferenceLine y={70} stroke="rgba(239,68,68,0.6)" strokeDasharray="6 3" label={{ value: 'Kritik Eşik (%70)', fill: 'rgba(239,68,68,0.9)', fontSize: 11 }} /><Line type="monotone" dataKey="gas_level" stroke="#eab308" strokeWidth={2.5} dot={{ r: 3, fill: '#0a0f1e', stroke: '#eab308' }} isAnimationActive={false} /></LineChart></ResponsiveContainer></div>
            </div>
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <div className="flex justify-end mb-6">
              <div className="flex bg-[#0a0f1e] p-1 rounded-full border border-factory-border shadow-md">
                {['daily', 'weekly', 'monthly'].map((range) => (
                  <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-1.5 rounded-full font-mono text-xs font-bold transition-all flex items-center gap-2 ${timeRange === range ? 'bg-neon-purple/20 text-neon-purple' : 'text-factory-muted'}`}><IconCalendar />{range === 'daily' ? 'GÜNLÜK' : range === 'weekly' ? 'HAFTALIK' : 'AYLIK'}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-[#0a0f1e] border border-emerald-500/30"><p className="text-xs font-mono text-emerald-400 mb-2 uppercase tracking-widest">Çalışma Oranı (Uptime)</p><p className="text-4xl font-display font-bold text-white">%{uptimePercent}</p></div>
              <div className="p-6 rounded-2xl bg-[#0a0f1e] border border-yellow-500/30"><p className="text-xs font-mono text-yellow-400 mb-2 uppercase tracking-widest">En Yüksek Sıcaklık</p><p className="text-4xl font-display font-bold text-white">{maxTemp}°C</p></div>
              <div className="p-6 rounded-2xl bg-[#0a0f1e] border border-neon-red/30"><p className="text-xs font-mono text-neon-red mb-2 uppercase tracking-widest">Kritik Olay</p><p className="text-4xl font-display font-bold text-white">{criticalCount} <span className="text-sm text-factory-muted">Kez</span></p></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-factory-border bg-factory-card p-6"><div className="absolute top-0 left-0 right-0 h-[2px] bg-neon-purple/40" /><p className="text-xs font-mono uppercase tracking-widest text-factory-muted mb-6">{timeRange === 'daily' ? 'Saatlik Ortalamalar' : 'Günlük Ortalamalar'}</p><ResponsiveContainer width="100%" height={300}><BarChart data={barData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}><CartesianGrid strokeDasharray="4 4" stroke="rgba(30,45,69,0.8)" vertical={false} /><XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} /><RechartsTooltip contentStyle={{ backgroundColor: '#0d1428', border: '1px solid #1e2d45', borderRadius: '12px' }} /><Legend wrapperStyle={{ paddingTop: '20px' }} /><Bar dataKey="Ort. Sıcaklık" fill="#22d3ee" radius={[4, 4, 0, 0]} /><Bar dataKey="Ort. Gaz" fill="#eab308" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
              <div className="relative overflow-hidden rounded-2xl border border-factory-border bg-factory-card p-6 flex flex-col items-center"><div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500/40" /><p className="text-xs font-mono uppercase tracking-widest text-factory-muted mb-2 self-start">Durum Dağılımı</p><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">{pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#ffffff'} />))}</Pie><RechartsTooltip contentStyle={{ backgroundColor: '#0d1428', border: '1px solid #1e2d45', borderRadius: '12px' }} /></PieChart></ResponsiveContainer><div className="flex flex-wrap justify-center gap-3 mt-4">{pieData.map((entry, idx) => (<div key={idx} className="flex items-center gap-1.5 text-xs font-mono text-factory-muted"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[entry.name] }}></span>{entry.name} ({entry.value})</div>))}</div></div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-factory-border bg-factory-card p-6"><div className="absolute top-0 left-0 right-0 h-[2px] bg-neon-cyan/40" /><div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4"><p className="text-xs font-mono uppercase tracking-widest text-factory-muted">Hammadde Tüketimi</p><div className="flex gap-6 text-right"><div><p className="text-[10px] font-mono text-factory-muted tracking-widest">TOPLAM TÜKETİM</p><p className="text-xl font-bold text-white">{totalConsumption} <span className="text-sm font-normal text-factory-muted">Birim</span></p></div><div><p className="text-[10px] font-mono text-factory-muted tracking-widest">ORTALAMA</p><p className="text-xl font-bold text-neon-cyan">{avgDailyConsumption} <span className="text-sm font-normal text-factory-muted">Birim</span></p></div></div></div><ResponsiveContainer width="100%" height={200}><AreaChart data={filteredHistory} margin={{ top: 5, right: 0, bottom: 5, left: 0 }}><defs><linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} /><stop offset="95%" stopColor="#a855f7" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="4 4" stroke="rgba(30,45,69,0.8)" vertical={false} /><XAxis dataKey="created_at" hide /><YAxis domain={[0, 1000]} hide /><RechartsTooltip content={<DarkTooltip />} /><Area type="monotone" dataKey="stock" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorStock)" isAnimationActive={false} /></AreaChart></ResponsiveContainer></div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/*                       SEKME 3: KULLANICI YÖNETİMİ                  */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'users' && isAdmin && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl border border-factory-border bg-factory-card p-8 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500/40" />

              <div className="mb-8">
                <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">Sistem Erişimi</p>
                <h2 className="text-2xl font-display font-bold text-white">Yeni Çalışan / Operatör Ekle</h2>
                <p className="text-sm font-mono text-factory-muted mt-2">Endüstriyel ağa yeni bir personel ekleyin ve yetki seviyesini belirleyin.</p>
              </div>

              <form onSubmit={handleAddUser} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono text-factory-muted mb-2 uppercase tracking-wider">Çalışan E-Posta</label>
                  <input type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-[#0d1428] border border-factory-border text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-3 font-mono" placeholder="operator@fabrika.com" />
                </div>

                <div>
                  <label className="block text-xs font-mono text-factory-muted mb-2 uppercase tracking-wider">Geçici Şifre (Min 6 Karakter)</label>
                  <input type="password" required minLength="6" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#0d1428] border border-factory-border text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-3 font-mono" placeholder="••••••••" />
                </div>

                <div>
                  <label className="block text-xs font-mono text-factory-muted mb-2 uppercase tracking-wider">Yetki Seviyesi (Rol)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setNewRole('viewer')}
                      className={`p-3 rounded-xl border font-mono text-sm font-bold flex flex-col items-center gap-1 transition-all ${newRole === 'viewer' ? 'bg-blue-500/10 border-blue-400 text-blue-400' : 'border-factory-border text-factory-muted hover:border-factory-muted'}`}>
                      <span className="text-lg">👀</span> İZLEYİCİ (Viewer)
                      <span className="text-[10px] font-normal text-center opacity-70">Sadece izler, müdahale edemez.</span>
                    </button>
                    <button type="button" onClick={() => setNewRole('admin')}
                      className={`p-3 rounded-xl border font-mono text-sm font-bold flex flex-col items-center gap-1 transition-all ${newRole === 'admin' ? 'bg-neon-red/10 border-neon-red text-neon-red' : 'border-factory-border text-factory-muted hover:border-factory-muted'}`}>
                      <span className="text-lg">🛠️</span> YÖNETİCİ (Admin)
                      <span className="text-[10px] font-normal text-center opacity-70">Sistemi durdurabilir, stok yeniler.</span>
                    </button>
                  </div>
                </div>

                {userMsg.text && (
                  <div className={`p-3 rounded border text-xs font-mono font-bold text-center ${userMsg.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-neon-red' :
                      userMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    }`}>
                    {userMsg.text}
                  </div>
                )}

                <button type="submit" disabled={userMsg.type === 'loading'}
                  className="w-full py-3.5 mt-4 bg-emerald-500/10 border border-emerald-500/50 hover:bg-emerald-500/20 text-emerald-400 font-mono font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] active:scale-95 disabled:opacity-50">
                  {userMsg.type === 'loading' ? 'SUNUCU İLE İLETİŞİM KURULUYOR...' : '+ YENİ ÇALIŞAN OLUŞTUR'}
                </button>
              </form>
            </div>
          </div>
        )}  

      </div>
    </div>
  );
}