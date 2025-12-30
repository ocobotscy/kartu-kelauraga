
import React, { useState } from 'react';
import { FamilyMember } from '../types';
import { 
  User, Hash, MapPin, Heart, GraduationCap, Briefcase, Flag, Globe, 
  Info, ShieldCheck, Landmark, FileText, X, Printer, Cpu, Fingerprint, 
  Edit3, Save, History, Calendar, ChevronRight, RefreshCw
} from 'lucide-react';

interface MemberDetailProps {
  member: FamilyMember;
  onClose: () => void;
  onUpdate?: (member: FamilyMember) => void;
}

const MemberDetail: React.FC<MemberDetailProps> = ({ member, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<FamilyMember>(member);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSave = () => {
    setIsVerifying(true);
    // Simulasi Sinkronisasi Database Pusat
    setTimeout(() => {
      onUpdate?.(editedData);
      setIsVerifying(false);
      setIsEditing(false);
    }, 1200);
  };

  const handleChange = (field: keyof FamilyMember, value: string) => {
    setEditedData({ ...editedData, [field]: value });
  };

  return (
    <div className="bg-white rounded-[48px] border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in-95 duration-700 relative">
      
      {isVerifying && (
        <div className="absolute inset-0 z-[60] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in">
           <div className="w-24 h-24 bg-indigo-50 rounded-[32px] flex items-center justify-center mb-6 relative">
              <RefreshCw size={40} className="text-indigo-600 animate-spin" />
              <ShieldCheck size={20} className="absolute -bottom-2 -right-2 text-green-500 bg-white rounded-full shadow-lg" />
           </div>
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Verifikasi Identitas Pusat...</h3>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Sinkronisasi Basis Data Nasional Purbolinggo</p>
        </div>
      )}

      {/* Header Profile Section */}
      <div className={`px-10 py-12 flex flex-col md:flex-row items-center md:items-start gap-10 border-b border-slate-100 relative transition-colors ${isEditing ? 'bg-indigo-50/30' : 'bg-white'}`}>
        <div className="absolute top-8 right-8 flex gap-3 no-print">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 rounded-2xl transition-all shadow-sm flex items-center gap-2 text-xs font-black uppercase tracking-wider">
              <Edit3 size={16} /> Edit Profil
            </button>
          ) : (
            <button onClick={handleSave} className="px-6 py-3 bg-indigo-900 text-white rounded-2xl transition-all shadow-xl shadow-indigo-200 flex items-center gap-2 text-xs font-black uppercase tracking-wider group">
              <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" /> Apply Verifikasi
            </button>
          )}
          <button onClick={onClose} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 rounded-2xl transition-all shadow-sm">
            <X size={22} />
          </button>
        </div>

        <div className="relative">
          <div className="w-28 h-28 md:w-40 md:h-40 bg-slate-50 rounded-[40px] flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden ring-1 ring-slate-100">
             {isEditing ? <Cpu size={56} className="text-indigo-300 animate-pulse" /> : <User size={64} className="text-slate-200" />}
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-50">
             <Fingerprint size={24} className="text-indigo-500" />
          </div>
        </div>
        
        <div className="text-center md:text-left pt-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-5">
            <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">PURBOLINGGO ID #{member.id}</span>
            <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">{member.statusHubungan}</span>
          </div>
          {isEditing ? (
            <input 
              className="text-3xl font-black text-slate-900 uppercase tracking-tight bg-white p-2 px-4 rounded-xl border-2 border-indigo-200 focus:border-indigo-600 focus:outline-none w-full max-w-lg shadow-sm"
              value={editedData.namaLengkap}
              onChange={(e) => handleChange('namaLengkap', e.target.value)}
            />
          ) : (
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-3">{member.namaLengkap}</h2>
          )}
          <p className="text-slate-400 font-mono text-lg tracking-[0.2em]">{member.nik}</p>
        </div>
      </div>

      {/* Profile Detail Grid */}
      <div className="p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column: Primary Data & Education */}
          <div className="space-y-12">
            <div>
              <SectionHeader icon={<Info size={18} />} title="Biodata Primer Purbolinggo" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 mt-8 bg-slate-50/50 p-8 rounded-[40px] border border-slate-50">
                <EditableField label="NIK Terverifikasi" value={editedData.nik} editing={isEditing} onChange={(v) => handleChange('nik', v)} icon={<Fingerprint size={14} />} />
                <EditableField label="Jenis Kelamin" value={editedData.jenisKelamin} editing={isEditing} onChange={(v) => handleChange('jenisKelamin', v as any)} icon={<Heart size={14} />} />
                <EditableField label="Tempat Lahir" value={editedData.tempatLahir} editing={isEditing} onChange={(v) => handleChange('tempatLahir', v)} icon={<MapPin size={14} />} />
                <EditableField label="Tanggal Lahir" value={editedData.tanggalLahir} editing={isEditing} onChange={(v) => handleChange('tanggalLahir', v)} icon={<Calendar size={14} />} />
                <EditableField label="Agama" value={editedData.agama} editing={isEditing} onChange={(v) => handleChange('agama', v)} icon={<Landmark size={14} />} />
                <EditableField label="Profesi Aktif" value={editedData.jenisPekerjaan} editing={isEditing} onChange={(v) => handleChange('jenisPekerjaan', v)} icon={<Briefcase size={14} />} />
              </div>
            </div>

            <div>
              <SectionHeader icon={<GraduationCap size={18} />} title="Riwayat Akademik Terdaftar" />
              <div className="mt-8 space-y-4">
                 {member.riwayatPendidikan ? member.riwayatPendidikan.map((edu, i) => (
                   <div key={i} className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-[24px] shadow-sm hover:border-indigo-200 transition-colors">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs">{i+1}</div>
                      <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{edu}</span>
                      <ChevronRight size={16} className="ml-auto text-slate-300" />
                   </div>
                 )) : <p className="text-xs text-slate-400 italic px-4">Informasi akademik belum diperbarui.</p>}
              </div>
            </div>
          </div>

          {/* Right Column: Work & Immigration */}
          <div className="space-y-12">
            <div>
              <SectionHeader icon={<Globe size={18} />} title="Status Kewarganegaraan & Imigrasi" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 mt-8 bg-slate-900 p-8 rounded-[40px] text-white">
                <EditableField dark label="Nasionalitas" value={editedData.kewarganegaraan} editing={isEditing} onChange={(v) => handleChange('kewarganegaraan', v)} icon={<Flag size={14} />} />
                <EditableField dark label="Status Perkawinan" value={editedData.statusPerkawinan} editing={isEditing} onChange={(v) => handleChange('statusPerkawinan', v)} icon={<FileText size={14} />} />
                <EditableField dark label="Nomor Paspor" value={editedData.noPaspor} editing={isEditing} onChange={(v) => handleChange('noPaspor', v)} icon={<Globe size={14} />} />
                <EditableField dark label="No. Kitas/Kitap" value={editedData.noKitasKitap} editing={isEditing} onChange={(v) => handleChange('noKitasKitap', v)} icon={<ShieldCheck size={14} />} />
              </div>
            </div>

            <div>
              <SectionHeader icon={<History size={18} />} title="Log Riwayat Pekerjaan" />
              <div className="mt-8 space-y-6">
                 {member.riwayatPekerjaan ? member.riwayatPekerjaan.map((work, i) => (
                   <div key={i} className="flex gap-6 group">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-50 group-hover:scale-125 transition-transform"></div>
                        {i !== (member.riwayatPekerjaan?.length || 0) - 1 && <div className="w-0.5 flex-1 bg-slate-100 my-2"></div>}
                      </div>
                      <div className="pb-8">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Record #{i+1}</p>
                        <h4 className="text-sm font-black text-slate-800 uppercase leading-relaxed">{work}</h4>
                      </div>
                   </div>
                 )) : <p className="text-xs text-slate-400 italic px-4">Log riwayat pekerjaan kosong.</p>}
              </div>
            </div>

            <div className="p-8 bg-slate-50 border border-slate-100 rounded-[32px]">
               <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Informasi Orang Tua Kandung</h5>
               <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-2">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ayah Kandung</p>
                   {isEditing ? <input className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold" value={editedData.namaAyah} onChange={e => handleChange('namaAyah', e.target.value)} /> : <p className="text-xs font-black text-slate-800 uppercase">{member.namaAyah}</p>}
                 </div>
                 <div className="space-y-2">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ibu Kandung</p>
                   {isEditing ? <input className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold" value={editedData.namaIbu} onChange={e => handleChange('namaIbu', e.target.value)} /> : <p className="text-xs font-black text-slate-800 uppercase">{member.namaIbu}</p>}
                 </div>
               </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6 no-print">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl"><ShieldCheck size={20} /></div>
             <div>
                <p className="text-xs font-black text-slate-900 uppercase">Dokumen Resmi Purbolinggo</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tervalidasi Database Kependudukan Nasional.</p>
             </div>
          </div>
          <button 
            onClick={() => window.print()}
            className="w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-indigo-900 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl shadow-indigo-200"
          >
            <Printer size={20} /> Cetak Profil Digital
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ icon, title }: { icon: any, title: string }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">{icon}</div>
    <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">{title}</h3>
  </div>
);

const EditableField = ({ label, value, editing, onChange, icon, dark }: { label: string, value: string, editing: boolean, onChange: (v: string) => void, icon: any, dark?: boolean }) => (
  <div className="space-y-3">
    <div className={`flex items-center gap-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
      {icon}
      <span className="text-[10px] font-black uppercase tracking-[0.1em]">{label}</span>
    </div>
    {editing ? (
      <input 
        className={`w-full px-5 py-3 rounded-xl text-xs font-black uppercase transition-all focus:outline-none focus:ring-4 ${dark ? 'bg-slate-800 border-slate-700 text-white focus:ring-indigo-500/20' : 'bg-white border-indigo-200 text-slate-800 focus:ring-indigo-500/5 focus:border-indigo-400'}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <p className={`text-sm font-black truncate uppercase tracking-tight ${dark ? 'text-white' : 'text-slate-800'}`}>{value || '-'}</p>
    )}
  </div>
);

export default MemberDetail;
