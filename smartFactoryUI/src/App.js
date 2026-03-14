import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Thermometer, Box, AlertTriangle, RefreshCcw } from 'lucide-react';

const supabase = createClient(
  'https://rbofbqxwxjevxyfchxix.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJib2ZicXh3eGpldnh5ZmNoeGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MzcwNTEsImV4cCI6MjA4ODMxMzA1MX0.FlkvIHJEzRr7KCyG1ZGvYp_Vb4Z84e6eQldKOWlkl3E'
);

function App() {
  const [data, setData] = useState([]);
  const [latest, setLatest] = useState({});

  const fetchData = async () => {
    let { data: factory_telemetry, error } = await supabase
      .from('factory_telemetry')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error("Fetch hatası:", error);
      return;
    }
    const chartData = factory_telemetry.reverse();
    setData(chartData);
    setLatest(chartData[chartData.length - 1] || {});
  };

  const handleRestock = async () => {
    const { error } = await supabase
      .from('factory_commands')
      .insert([{ type: 'RESTOCK', created_at: new Date() }]);

    if (error) {
      console.error("Komut gönderilemedi:", error.message);
    } else {
      console.log("Restock komutu Supabase'e yazıldı!");
    }
  };

  useEffect(() => {
    fetchData();

    const subscription = supabase
      .channel('factory-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'factory_telemetry' },
        (payload) => {
          setData((prev) => [...prev.slice(1), payload.new]);
          setLatest(payload.new);
        })
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-factory-bg p-6 md:p-10 font-sans">

      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row items-center justify-between border-b pb-6 gap-4">
        <h1 className="text-4xl font-extrabold text-factory-dark tracking-tight">Smart Factory Dashboard</h1>
        <div className={`px-4 py-2 rounded-full font-semibold text-sm ${latest.gas_alert ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {latest.gas_alert ? 'Safety Alert: GAS DETECTED' : 'System Status: SECURE'}
        </div>
      </header>

      {/* Metrik Kartları Girdisi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

        {/* Sıcaklık */}
        <div className="bg-factory-card p-6 rounded-2xl shadow-lg flex items-start gap-5 hover:shadow-xl transition-shadow border border-gray-100">
          <div className="p-4 bg-orange-100 rounded-xl text-orange-600">
            <Thermometer size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Sıcaklık</p>
            <p className="text-3xl font-bold text-factory-dark">{latest.temp}°C</p>
            <p className={`text-xs mt-1 font-semibold ${latest.status === 'running' ? 'text-green-600' : 'text-red-600'}`}>
              Durum: {latest.status}
            </p>
          </div>
        </div>

        {/* Bant Hızı */}
        <div className="bg-factory-card p-6 rounded-2xl shadow-lg flex items-start gap-5 hover:shadow-xl transition-shadow border border-gray-100">
          <div className="p-4 bg-blue-100 rounded-xl text-blue-600">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Bant Hızı</p>
            <p className="text-3xl font-bold text-factory-dark">%{latest.speed}</p>
          </div>
        </div>

        {/* Stok */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-purple-400">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-purple-100 rounded-lg text-purple-600"><Box /></div>
            <span className="text-gray-500 font-medium">Stok</span>
          </div>
          <div className="text-3xl font-bold">{latest.stock || 0}</div>

          {/* YENİ BUTON BURAYA: Stok uyarısı varsa veya her zaman görünebilir */}
          <button
            onClick={handleRestock}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <RefreshCcw size={16} /> Stok Yenile
          </button>

          {latest.restock_needed && (
            <div className="text-xs mt-2 bg-red-100 text-red-700 p-1 rounded text-center font-bold animate-bounce">
              ⚠️ STOK KRİTİK!
            </div>
          )}
        </div>

        {/* Gaz Alarmı */}
        <div className={`bg-factory-card p-6 rounded-2xl shadow-lg flex items-start gap-5 hover:shadow-xl transition-shadow border-2 ${latest.gas_alert ? 'border-red-400 animate-pulse' : 'border-green-400'}`}>
          <div className={`p-4 rounded-xl ${latest.gas_alert ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            <AlertTriangle size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Gaz</p>
            <p className={`text-3xl font-bold ${latest.gas_alert ? 'text-red-700' : 'text-green-700'}`}>
              {latest.gas_alert ? 'TEHLİKE' : 'GÜVENLİ'}
            </p>
          </div>
        </div>
      </div>

      {/* Grafik Bölümü */}
      <div className="bg-factory-card p-8 rounded-3xl shadow-lg border border-gray-100 mb-10 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-factory-dark flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
            Sıcaklık Değişimi (Zaman Serisi)
          </h3>
          <button onClick={fetchData} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
            <RefreshCcw size={20} />
          </button>
        </div>
        <div className="w-full" style={{ minHeight: '350px' }}>
          <ResponsiveContainer width="100%" height={350} debounce={1}>
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="created_at" tick={{ fontSize: 10, fill: '#6b7280' }} hide />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} />
              <Tooltip
                contentStyle={{ border: 'none', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 3, fill: 'white' }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;