
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FamilyCardData } from '../types';
import { Users, UserPlus, BookOpen, MapPin, Landmark } from 'lucide-react';

interface DashboardProps {
  data: FamilyCardData;
}

const COLORS = ['#312e81', '#4338ca', '#6366f1', '#a5b4fc', '#e0e7ff'];

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  // Hanya hitung anggota yang valid (nama bukan "-")
  const validMembers = useMemo(() => data.members.filter(m => m.namaLengkap !== "-"), [data]);

  const genderData = useMemo(() => {
    const male = validMembers.filter(m => m.jenisKelamin === 'Laki-Laki').length;
    const female = validMembers.filter(m => m.jenisKelamin === 'Perempuan').length;
    return [
      { name: 'Pria', value: male },
      { name: 'Wanita', value: female }
    ];
  }, [validMembers]);

  const educationData = useMemo(() => {
    const counts: Record<string, number> = {};
    validMembers.forEach(m => {
      const edu = m.pendidikan === "-" ? "N/A" : m.pendidikan;
      counts[edu] = (counts[edu] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [validMembers]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users size={22} />} 
          label="Total Anggota Valid" 
          value={`${validMembers.length} Jiwa`} 
          color="indigo"
        />
        <StatCard 
          icon={<Landmark size={22} />} 
          label="Kecamatan" 
          value={data.kecamatan} 
          color="slate"
        />
        <StatCard 
          icon={<MapPin size={22} />} 
          label="Kelurahan" 
          value={data.desaKelurahan} 
          color="slate"
        />
        <StatCard 
          icon={<UserPlus size={22} />} 
          label="Kepala Keluarga" 
          value={validMembers[0]?.namaLengkap.split(' ')[0] || "N/A"} 
          color="slate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm h-80">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Rasio Gender Keluarga</h3>
             <div className="flex gap-2">
                <div className="flex items-center gap-1.5 text-[9px] font-black text-indigo-900"><div className="w-2 h-2 rounded-full bg-indigo-900"></div> PRIA</div>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-indigo-300"><div className="w-2 h-2 rounded-full bg-indigo-300"></div> WANITA</div>
             </div>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={10}
                dataKey="value"
                stroke="none"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm h-80">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Sebaran Pendidikan (Lampung)</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={educationData}>
              <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 'bold' }} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }}
              />
              <Bar dataKey="value" fill="#312e81" radius={[8, 8, 8, 8]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm flex items-center space-x-5 group hover:border-indigo-200 transition-all">
    <div className={`p-4 rounded-2xl transition-all ${color === 'indigo' ? 'bg-indigo-900 text-white shadow-xl shadow-indigo-100' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-black text-slate-900 tracking-tight uppercase">{value}</p>
    </div>
  </div>
);

export default Dashboard;
