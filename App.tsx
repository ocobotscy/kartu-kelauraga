
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { INITIAL_KK_LIST } from './constants';
import { FamilyCardData, FamilyMember } from './types';
import FamilyDocument from './components/FamilyDocument';
import Dashboard from './components/Dashboard';
import MemberDetail from './components/MemberDetail';
import { 
  Search, LayoutDashboard, FileText, Printer, ChevronRight, User, Users, 
  Hash, MapPin, Info, Zap, X, FileDown, Database, ArrowRight, Plus, 
  Settings, Layers, CreditCard, Trash2, Edit3, Save, CheckCircle2, UserCheck,
  Building2, Map, ShieldCheck, RefreshCw, UserPlus, Filter, ChevronDown
} from 'lucide-react';

const App: React.FC = () => {
  const [kkList, setKkList] = useState<FamilyCardData[]>(() => {
    const saved = localStorage.getItem('sikk_pbo_v1');
    return saved ? JSON.parse(saved) : INITIAL_KK_LIST;
  });
  
  const [activeKKIndex, setActiveKKIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'document' | 'management'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('sikk_pbo_v1', JSON.stringify(kkList));
  }, [kkList]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (selectedMemberId && detailRef.current) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [selectedMemberId]);

  const currentKK = useMemo(() => kkList[activeKKIndex] || kkList[0], [activeKKIndex, kkList]);

  const handleDocSearch = () => {
    const query = docSearchQuery.trim().toLowerCase();
    if (query === '') return;

    const id = parseInt(query);
    if (!isNaN(id) && id >= 1 && id <= currentKK.members.length) {
       const m = currentKK.members.find(mem => mem.id === id);
       if (m && m.namaLengkap !== "-") {
         setSelectedMemberId(id);
         setNotification(`Ditemukan: ${m.namaLengkap}`);
         return;
       }
    }

    const foundMember = currentKK.members.find(m => 
      m.namaLengkap !== "-" && (
        m.namaLengkap.toLowerCase().includes(query) || 
        m.nik.includes(query)
      )
    );

    if (foundMember) {
      setSelectedMemberId(foundMember.id);
      setNotification(`Ditemukan: ${foundMember.namaLengkap}`);
    } else {
      setNotification("Data tidak ditemukan di KK ini.");
    }
  };

  const handleDocSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDocSearch();
    }
  };

  const currentMember = useMemo(() => 
    currentKK.members.find(m => m.id === selectedMemberId), 
  [selectedMemberId, currentKK]);

  const handleUpdateKK = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      const formData = new FormData(e.currentTarget);
      const updatedList = [...kkList];
      updatedList[activeKKIndex] = {
        ...currentKK,
        alamat: (formData.get('alamat') as string).toUpperCase(),
        rtRw: formData.get('rtRw') as string,
        desaKelurahan: (formData.get('desa') as string).toUpperCase(),
        kecamatan: (formData.get('kecamatan') as string).toUpperCase(),
        kabupatenKota: "LAMPUNG TIMUR",
        provinsi: "LAMPUNG",
      };
      setKkList(updatedList);
      setIsVerifying(false);
      setNotification("Verified: Arsip KK Berhasil Disinkronkan ke Pusat!");
    }, 1500);
  };

  const handleUpdateMember = (updatedMember: FamilyMember) => {
    const updatedList = [...kkList];
    const members = [...currentKK.members];
    const mIdx = members.findIndex(m => m.id === updatedMember.id);
    if (mIdx !== -1) {
      members[mIdx] = updatedMember;
      updatedList[activeKKIndex] = { ...currentKK, members };
      setKkList(updatedList);
      setNotification(`Data ${updatedMember.namaLengkap} Telah Diverifikasi.`);
    }
  };

  const handleDeleteKK = (idx: number) => {
    if (kkList.length === 1) return;
    if (confirm("Hapus arsip Kartu Keluarga ini dari database Purbolinggo?")) {
      const newList = kkList.filter((_, i) => i !== idx);
      setKkList(newList);
      setActiveKKIndex(0);
      setNotification("Arsip telah dihapus dari server.");
    }
  };

  const handleAddNewKK = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const headNIK = formData.get('nik') as string;
    
    // Inisialisasi KK dengan 1 orang (Kepala)
    const newKK: FamilyCardData = {
      nomorKK: formData.get('nomorKK') as string,
      alamat: (formData.get('alamat') as string || '-').toUpperCase(),
      rtRw: formData.get('rtRw') as string || '000/000',
      kodePos: formData.get('kodePos') as string || '34152',
      desaKelurahan: (formData.get('desa') as string || '-').toUpperCase(),
      kecamatan: (formData.get('kecamatan') as string || 'PURBOLINGGO').toUpperCase(),
      kabupatenKota: "LAMPUNG TIMUR",
      provinsi: "LAMPUNG",
      members: [
        {
          id: 1,
          namaLengkap: (formData.get('nama') as string).toUpperCase(),
          nik: headNIK,
          jenisKelamin: 'Laki-Laki',
          tempatLahir: 'PURBOLINGGO',
          tanggalLahir: '01-01-1980',
          agama: 'ISLAM',
          pendidikan: '-',
          jenisPekerjaan: '-',
          statusPerkawinan: 'KAWIN',
          statusHubungan: 'KEPALA KELUARGA',
          kewarganegaraan: 'WNI',
          noPaspor: '-',
          noKitasKitap: '-',
          namaAyah: '-',
          namaIbu: '-'
        }
      ]
    };
    setKkList([newKK, ...kkList]);
    setActiveKKIndex(0);
    setIsAddModalOpen(false);
    setNotification("Registrasi Berhasil & Diverifikasi Lampung!");
  };

  const handleAddNewMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedList = [...kkList];
    const members = [...currentKK.members];
    
    const newMember: FamilyMember = {
      id: members.length + 1,
      namaLengkap: (formData.get('nama') as string).toUpperCase(),
      nik: formData.get('nik') as string,
      jenisKelamin: formData.get('gender') as any,
      statusHubungan: formData.get('hubungan') as string,
      tempatLahir: (formData.get('tempatLahir') as string || 'PURBOLINGGO').toUpperCase(),
      tanggalLahir: formData.get('tglLahir') as string || '01-01-2000',
      agama: formData.get('agama') as string || 'ISLAM',
      pendidikan: formData.get('pendidikan') as string || '-',
      jenisPekerjaan: formData.get('pekerjaan') as string || '-',
      statusPerkawinan: formData.get('statusKawin') as string || 'BELUM KAWIN',
      kewarganegaraan: 'WNI',
      noPaspor: '-',
      noKitasKitap: '-',
      namaAyah: formData.get('ayah') as string || '-',
      namaIbu: formData.get('ibu') as string || '-',
    };

    members.push(newMember);
    updatedList[activeKKIndex] = { ...currentKK, members };
    setKkList(updatedList);
    setIsAddMemberModalOpen(false);
    setNotification(`Anggota ${formData.get('nama')} berhasil ditambahkan!`);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex flex-col md:flex-row text-slate-800 font-sans">
      
      {notification && (
        <div className="fixed top-8 right-8 z-[100] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 border border-white/10">
           <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
             <ShieldCheck size={16} className="text-white" />
           </div>
           <span className="text-xs font-black uppercase tracking-wider">{notification}</span>
        </div>
      )}

      <aside className="w-full md:w-[360px] bg-white border-r border-slate-200 p-8 flex flex-col no-print sticky top-0 h-screen z-20 overflow-y-auto">
        <div className="flex items-center space-x-5 mb-14">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-900 to-blue-800 rounded-[22px] flex items-center justify-center text-white shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50">
            <Building2 size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-none tracking-tight">SIKK PBO</h1>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mt-2">Wilayah Purbolinggo</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem active={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setSelectedMemberId(null);}} icon={<LayoutDashboard size={20} />} label="Dashboard Kependudukan" />
          <NavItem active={activeTab === 'document'} onClick={() => {setActiveTab('document'); setDocSearchQuery('');}} icon={<FileText size={20} />} label="Arsip Digital (KK)" />
          <NavItem active={activeTab === 'management'} onClick={() => {setActiveTab('management'); setSelectedMemberId(null);}} icon={<Settings size={20} />} label="Manajemen Data Pusat" />

          <div className="mt-12 pt-10 border-t border-slate-100">
             <div className="flex justify-between items-center px-5 mb-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Daftar Kartu Keluarga</p>
                <Map size={14} className="text-indigo-600" />
             </div>
             <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
                {kkList.map((kk, idx) => (
                  <button
                    key={kk.nomorKK}
                    onClick={() => { setActiveKKIndex(idx); setSelectedMemberId(null); setActiveTab('dashboard'); }}
                    className={`w-full group text-left p-5 rounded-[22px] transition-all border ${activeKKIndex === idx ? 'bg-indigo-900 border-indigo-900 shadow-xl shadow-indigo-100' : 'bg-white border-slate-50 hover:bg-slate-50'}`}
                  >
                    <div className={`text-xs font-black uppercase truncate mb-1 ${activeKKIndex === idx ? 'text-white' : 'text-slate-800'}`}>
                      {kk.members[0]?.namaLengkap || "NAMA BELUM TERISI"}
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] font-mono ${activeKKIndex === idx ? 'text-indigo-300' : 'text-slate-400'}`}>
                      <Hash size={10} /> {kk.nomorKK}
                    </div>
                  </button>
                ))}
             </div>
          </div>
        </nav>
        <div className="mt-auto pt-8">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full flex items-center justify-center gap-4 py-5 bg-indigo-900 text-white rounded-[22px] text-xs font-black uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:scale-[0.98] transition-all"
          >
            <Plus size={18} /> Daftarkan KK Baru
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#fcfdfe] relative scroll-smooth">
        <header className="sticky top-0 z-30 bg-[#fcfdfe]/80 backdrop-blur-md border-b border-slate-100 px-6 md:px-14 py-8 no-print transition-all">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">Provinsi Lampung</span>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Active ID: {currentKK.nomorKK}</p>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">
                {activeTab === 'dashboard' ? 'Kependudukan' : activeTab === 'document' ? 'Arsip Visual' : 'Database Pusat'}
              </h2>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-14 pt-10">
          {activeTab === 'dashboard' && (
            <div className="space-y-14 animate-in fade-in duration-700 pb-20">
              <Dashboard data={currentKK} />
              <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                      <UserCheck size={18} className="text-indigo-600" /> Katalog Personal ({currentKK.members.length} Anggota)
                  </h3>
                  <button 
                    onClick={() => setIsAddMemberModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-900 hover:text-white transition-all shadow-sm"
                  >
                    <UserPlus size={16} /> Tambah Anggota Keluarga
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {currentKK.members.map(m => (
                      <button 
                        key={m.id}
                        onClick={() => setSelectedMemberId(m.id)}
                        className={`p-8 rounded-[36px] border-2 transition-all flex flex-col items-center gap-6 group relative ${selectedMemberId === m.id ? 'bg-indigo-900 border-indigo-900 shadow-2xl scale-[1.03]' : 'bg-white border-slate-100 hover:border-indigo-200'}`}
                      >
                        <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center transition-transform group-hover:rotate-6 ${selectedMemberId === m.id ? 'bg-indigo-800 ring-4 ring-indigo-500/20' : 'bg-slate-50 shadow-inner'}`}>
                          <User size={38} className={selectedMemberId === m.id ? 'text-white' : 'text-slate-300'} />
                        </div>
                        <div className="text-center">
                          <div className={`text-[11px] font-black uppercase tracking-tight truncate w-32 mb-1.5 ${selectedMemberId === m.id ? 'text-white' : 'text-slate-800'}`}>{m.namaLengkap}</div>
                          <div className={`text-[9px] font-bold uppercase ${selectedMemberId === m.id ? 'text-indigo-400' : 'text-slate-400'}`}>{m.statusHubungan}</div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
              {currentMember && (
                <div ref={detailRef} className="animate-in slide-in-from-bottom-12 duration-700 scroll-mt-32">
                  <MemberDetail member={currentMember} onClose={() => setSelectedMemberId(null)} onUpdate={handleUpdateMember} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'document' && (
            <div className="space-y-20 animate-in fade-in duration-700 pb-32 flex flex-col items-center">
              
              <div className="w-full max-w-5xl flex justify-end no-print px-4">
                  <button onClick={() => window.print()} className="group flex items-center gap-4 px-10 py-5 bg-indigo-900 text-white rounded-[24px] shadow-2xl shadow-indigo-100 hover:bg-slate-900 transition-all text-xs font-black uppercase tracking-[0.2em] transform hover:-translate-y-1">
                      <Printer size={22} className="group-hover:rotate-6 transition-transform" /> 
                      Cetak Dokumen Kartu Keluarga
                  </button>
              </div>

              <div className="w-full bg-white p-6 md:p-14 rounded-[60px] shadow-2xl border border-slate-50 ring-1 ring-slate-900/5 overflow-x-auto">
                  <FamilyDocument data={currentKK} highlightId={selectedMemberId} />
              </div>

              <div className="w-full max-w-5xl space-y-8 no-print pt-10 border-t-4 border-dashed border-slate-100">
                  <div className="bg-white p-10 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col lg:flex-row items-center gap-10">
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-4 mb-4 ml-4">
                           <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Filter size={20} /></div>
                           <div>
                              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Filter Arsip Digital</h3>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cepat Temukan Anggota Keluarga</p>
                           </div>
                        </div>
                        <div className="relative group">
                           <input 
                             type="text" 
                             placeholder="Ketik ID (Urutan), Nama, atau NIK lalu Enter..." 
                             className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-transparent rounded-[32px] text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none transition-all shadow-inner"
                             value={docSearchQuery}
                             onChange={(e) => setDocSearchQuery(e.target.value)}
                             onKeyDown={handleDocSearchKeyDown}
                           />
                           <Search size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                           <button onClick={handleDocSearch} className="absolute right-4 top-1/2 -translate-y-1/2 px-8 py-3.5 bg-indigo-900 text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Cari (Enter)</button>
                        </div>
                      </div>

                      <div className="flex flex-col items-center lg:items-end gap-4 w-full lg:w-auto">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">Quick Navigation:</p>
                         <div className="flex flex-wrap justify-center lg:justify-end gap-3 max-w-[280px]">
                            {currentKK.members.map(m => (
                              <button 
                                key={m.id}
                                onClick={() => setSelectedMemberId(m.id)}
                                className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all border-2 ${selectedMemberId === m.id ? 'bg-indigo-900 border-indigo-900 text-white shadow-xl scale-110' : 'bg-white border-slate-100 hover:border-indigo-400 text-slate-400 hover:text-indigo-600'}`}
                              >
                                <span className="text-xs font-black">{m.id}</span>
                              </button>
                            ))}
                         </div>
                      </div>
                  </div>

                  <div className="pt-6 animate-in slide-in-from-top-8 duration-700">
                    <div className="flex items-center gap-4 mb-10 px-6">
                        <div className="w-12 h-1 bg-indigo-600 rounded-full"></div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Detail Personal Terpilih</h3>
                    </div>

                    {currentMember ? (
                      <div ref={detailRef} className="scroll-mt-40">
                        <MemberDetail member={currentMember} onClose={() => setSelectedMemberId(null)} onUpdate={handleUpdateMember} />
                      </div>
                    ) : (
                      <div className="bg-slate-50/50 rounded-[60px] p-24 text-center border-4 border-dashed border-slate-200 opacity-60">
                         <div className="w-24 h-24 bg-white rounded-[32px] shadow-lg flex items-center justify-center mx-auto mb-8">
                            <User size={48} className="text-slate-200" />
                         </div>
                         <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Silahkan cari atau pilih ID anggota di atas</h4>
                         <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-2">Data akan otomatis tersinkronisasi dengan filter</p>
                      </div>
                    )}
                  </div>
              </div>
            </div>
          )}

          {activeTab === 'management' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-700 pb-24">
              <div className="lg:col-span-2 space-y-10">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-3">Arsip Terdaftar Lampung</h3>
                  <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                          <tr>
                              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">No. KK</th>
                              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kepala Keluarga</th>
                              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jumlah Anggota</th>
                              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {kkList.map((kk, idx) => (
                            <tr key={kk.nomorKK} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6 text-xs font-mono font-black text-slate-500">{kk.nomorKK}</td>
                                <td className="px-8 py-6 text-sm font-black text-slate-900 uppercase">{kk.members[0]?.namaLengkap || "-"}</td>
                                <td className="px-8 py-6 text-xs font-bold text-slate-400 uppercase">{kk.members.length} Orang</td>
                                <td className="px-8 py-6 text-center">
                                  <div className="flex items-center justify-center gap-3">
                                    <button onClick={() => { setActiveKKIndex(idx); setActiveTab('dashboard'); }} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><ArrowRight size={18} /></button>
                                    <button onClick={() => handleDeleteKK(idx)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                                  </div>
                                </td>
                            </tr>
                          ))}
                        </tbody>
                    </table>
                  </div>
              </div>
              <div className="space-y-10">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-3">Update & Verifikasi</h3>
                  <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden">
                    {isVerifying && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-in fade-in">
                         <RefreshCw size={40} className="text-indigo-600 animate-spin mb-4" />
                         <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Menghubungi Server Lampung...</p>
                      </div>
                    )}
                    <form onSubmit={handleUpdateKK} className="space-y-8">
                        <div className="space-y-5">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><MapPin size={14} /></div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lokasi Domisili</label>
                          </div>
                          <textarea name="alamat" defaultValue={currentKK.alamat} placeholder="Alamat Lengkap" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold uppercase focus:bg-white transition-all min-h-[100px]" />
                          <div className="grid grid-cols-2 gap-4">
                              <input name="rtRw" defaultValue={currentKK.rtRw} placeholder="RT/RW" className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold" />
                              <input name="desa" defaultValue={currentKK.desaKelurahan} placeholder="Desa/Kel" className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold uppercase" />
                          </div>
                          <input name="kecamatan" defaultValue={currentKK.kecamatan} placeholder="Kecamatan" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold uppercase" />
                        </div>
                        <button type="submit" className="group w-full py-6 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] hover:scale-[0.98] transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-4">
                          <ShieldCheck size={20} className="group-hover:rotate-12 transition-transform" /> 
                          Apply Verifikasi Database Pusat
                        </button>
                    </form>
                  </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL REGISTRASI KK BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="px-12 py-10 border-b border-slate-50 flex justify-between items-center bg-indigo-900 text-white">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white/10 text-white rounded-[24px] flex items-center justify-center border border-white/20">
                  <Plus size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Registrasi KK Baru</h3>
                  <p className="text-xs text-indigo-200 font-bold uppercase tracking-widest mt-1">Sistem Kependudukan Lampung</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full transition-all flex items-center justify-center text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddNewKK} className="p-12 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">No. KK (Mulai 18 untuk Lampung)</label>
                  <input required name="nomorKK" maxLength={16} placeholder="1807xxxxxxxxxxxx" className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-indigo-500 focus:outline-none font-mono text-sm tracking-[0.2em]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kepala Keluarga</label>
                  <input required name="nama" placeholder="Nama Lengkap" className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-indigo-500 focus:outline-none text-sm font-black uppercase" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NIK Kepala</label>
                  <input required name="nik" maxLength={16} placeholder="1807xxxxxxxxxxxx" className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-indigo-500 focus:outline-none text-sm font-mono tracking-widest" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Domisili Lampung</label>
                  <input required name="alamat" placeholder="Jalan, Blok, No. Rumah" className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-indigo-500 focus:outline-none text-sm font-medium" />
                </div>
              </div>
              <div className="pt-8 flex gap-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-5 border-2 border-slate-100 rounded-[24px] text-xs font-black text-slate-400 hover:bg-slate-50 uppercase tracking-widest transition-all">Batal</button>
                <button type="submit" className="flex-[2] py-5 bg-indigo-900 text-white rounded-[24px] text-xs font-black uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-800 transition-all">Daftarkan Sekarang</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH ANGGOTA BARU */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="px-12 py-10 border-b border-slate-50 flex justify-between items-center bg-indigo-600 text-white">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white/10 text-white rounded-[24px] flex items-center justify-center border border-white/20">
                  <UserPlus size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Tambah Anggota Baru</h3>
                  <p className="text-xs text-indigo-100 font-bold uppercase tracking-widest mt-1">Lengkapi Berkas Kartu Keluarga</p>
                </div>
              </div>
              <button onClick={() => setIsAddMemberModalOpen(false)} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full transition-all flex items-center justify-center text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddNewMember} className="p-12 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <input required name="nama" placeholder="Nama Lengkap" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-indigo-500 focus:outline-none text-sm font-black uppercase" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NIK</label>
                  <input required name="nik" maxLength={16} placeholder="NIK 16 Digit" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-indigo-500 focus:outline-none text-sm font-mono tracking-widest" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hubungan</label>
                  <select name="hubungan" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-indigo-500 focus:outline-none text-sm font-bold uppercase">
                    <option value="ISTRI">ISTRI</option>
                    <option value="ANAK">ANAK</option>
                    <option value="MERTUA">MERTUA</option>
                    <option value="LAINNYA">LAINNYA</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jenis Kelamin</label>
                  <select name="gender" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-indigo-500 focus:outline-none text-sm font-bold uppercase">
                    <option value="Laki-Laki">LAKI-LAKI</option>
                    <option value="Perempuan">PEREMPUAN</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pekerjaan</label>
                  <input name="pekerjaan" placeholder="Contoh: PELAJAR" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-indigo-500 focus:outline-none text-sm font-bold uppercase" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pendidikan</label>
                  <input name="pendidikan" placeholder="Contoh: SMA" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-indigo-500 focus:outline-none text-sm font-bold uppercase" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ayah Kandung</label>
                   <input name="ayah" placeholder="Nama Ayah" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-indigo-500 focus:outline-none text-sm font-bold uppercase" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ibu Kandung</label>
                   <input name="ibu" placeholder="Nama Ibu" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-indigo-500 focus:outline-none text-sm font-bold uppercase" />
                </div>
              </div>
              <div className="pt-8 flex gap-4">
                <button type="button" onClick={() => setIsAddMemberModalOpen(false)} className="flex-1 py-5 border-2 border-slate-100 rounded-[24px] text-xs font-black text-slate-400 hover:bg-slate-50 uppercase tracking-widest transition-all">Batal</button>
                <button type="submit" className="flex-[2] py-5 bg-indigo-600 text-white rounded-[24px] text-xs font-black uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Tambah Anggota</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center px-6 py-5 rounded-[22px] transition-all group ${active ? 'bg-indigo-50 text-indigo-700 font-black shadow-sm shadow-indigo-50' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
  >
    <span className={`mr-5 ${active ? 'text-indigo-700' : 'text-slate-300 group-hover:text-slate-600'} transition-colors`}>{icon}</span>
    <span className="text-sm tracking-tight">{label}</span>
  </button>
);

export default App;
