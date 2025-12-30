
import React from 'react';
import { FamilyCardData } from '../types';

interface FamilyDocumentProps {
  data: FamilyCardData;
  highlightId?: number | null;
}

const FamilyDocument: React.FC<FamilyDocumentProps> = ({ data, highlightId }) => {
  const kepalaKeluarga = data.members.find(m => m.statusHubungan === 'KEPALA KELUARGA')?.namaLengkap || data.members[0]?.namaLengkap || "-";

  // Standard display: minimal 10 baris
  const displayCount = Math.max(data.members.length, 10);
  const displayRows = Array.from({ length: displayCount }, (_, i) => data.members[i] || null);

  return (
    <div className="bg-white border-[1.5px] border-black p-8 md:p-14 shadow-2xl max-w-[1100px] mx-auto print:shadow-none print:border-none print:p-0 text-black font-serif relative overflow-hidden transition-all duration-500 min-h-[1200px]">
      
      {/* Header Utama Dokumen */}
      <div className="relative z-10 mb-10 border-b-[3px] border-black pb-6">
        <div className="text-center">
          <h2 className="text-sm md:text-base font-bold tracking-[0.2em] mb-0.5 opacity-80 uppercase">Republik Indonesia</h2>
          <h1 className="text-2xl md:text-4xl font-black tracking-[0.3em] uppercase mb-4">KARTU KELUARGA</h1>
          <div className="inline-block pt-1 px-16 border-t-[1px] border-black">
             <p className="text-lg md:text-xl font-bold tracking-[0.2em]">No. {data.nomorKK}</p>
          </div>
        </div>
      </div>

      {/* Informasi Alamat & Wilayah */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 mb-8 text-[11px] font-bold uppercase relative z-10">
        <div className="space-y-1 pr-4">
          <div className="flex">
            <span className="w-48">NAMA KEPALA KELUARGA</span>
            <span className="flex-1">: {kepalaKeluarga}</span>
          </div>
          <div className="flex">
            <span className="w-48">ALAMAT</span>
            <span className="flex-1">: {data.alamat}</span>
          </div>
          <div className="flex">
            <span className="w-48">RT / RW</span>
            <span className="flex-1">: {data.rtRw}</span>
          </div>
          <div className="flex">
            <span className="w-48">DESA / KELURAHAN</span>
            <span className="flex-1">: {data.desaKelurahan}</span>
          </div>
        </div>
        <div className="space-y-1 pl-0 md:pl-4">
          <div className="flex">
            <span className="w-48">KECAMATAN</span>
            <span className="flex-1">: {data.kecamatan}</span>
          </div>
          <div className="flex">
            <span className="w-48">KABUPATEN / KOTA</span>
            <span className="flex-1">: {data.kabupatenKota}</span>
          </div>
          <div className="flex">
            <span className="w-48">KODE POS</span>
            <span className="flex-1">: {data.kodePos}</span>
          </div>
          <div className="flex">
            <span className="w-48">PROVINSI</span>
            <span className="flex-1">: {data.provinsi}</span>
          </div>
        </div>
      </div>

      {/* TABEL DATA UTAMA */}
      <div className="mb-6 relative z-10 overflow-x-auto">
        <table className="w-full border-collapse border-[1.5px] border-black text-[9px] uppercase font-bold text-black">
          <thead>
            <tr className="h-11 text-center bg-slate-50/50">
              <th className="border-[1.5px] border-black p-1 w-8">NO</th>
              <th className="border-[1.5px] border-black p-1">NAMA LENGKAP</th>
              <th className="border-[1.5px] border-black p-1">NIK</th>
              <th className="border-[1.5px] border-black p-1 w-20">JENIS KELAMIN</th>
              <th className="border-[1.5px] border-black p-1">TEMPAT LAHIR</th>
              <th className="border-[1.5px] border-black p-1 w-24">TGL LAHIR</th>
              <th className="border-[1.5px] border-black p-1 w-16">AGAMA</th>
              <th className="border-[1.5px] border-black p-1">PENDIDIKAN</th>
              <th className="border-[1.5px] border-black p-1">JENIS PEKERJAAN</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((m, idx) => (
              <tr key={m ? m.id : `empty-${idx}`} className={`h-10 ${m && highlightId === m.id ? 'bg-blue-50 ring-1 ring-blue-400 ring-inset' : ''}`}>
                <td className="border-[1.5px] border-black text-center">{idx + 1}</td>
                <td className="border-[1.5px] border-black px-2">{m ? m.namaLengkap : ""}</td>
                <td className="border-[1.5px] border-black px-2 text-center font-mono text-[10px] tracking-tight">{m ? m.nik : ""}</td>
                <td className="border-[1.5px] border-black text-center">{m ? m.jenisKelamin : ""}</td>
                <td className="border-[1.5px] border-black px-2">{m ? m.tempatLahir : ""}</td>
                <td className="border-[1.5px] border-black text-center">{m ? m.tanggalLahir : ""}</td>
                <td className="border-[1.5px] border-black text-center">{m ? m.agama : ""}</td>
                <td className="border-[1.5px] border-black px-2">{m ? m.pendidikan : ""}</td>
                <td className="border-[1.5px] border-black px-2">{m ? m.jenisPekerjaan : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TABEL DATA STATUS */}
      <div className="mb-14 relative z-10 overflow-x-auto">
        <table className="w-full border-collapse border-[1.5px] border-black text-[9px] uppercase font-bold text-black">
          <thead className="text-center bg-slate-50/50">
            <tr className="h-11">
              <th className="border-[1.5px] border-black w-8" rowSpan={2}>NO</th>
              <th className="border-[1.5px] border-black" rowSpan={2}>STATUS PERKAWINAN</th>
              <th className="border-[1.5px] border-black" rowSpan={2}>HUBUNGAN KELUARGA</th>
              <th className="border-[1.5px] border-black" rowSpan={2}>KEWARGANEGARAAN</th>
              <th className="border-[1.5px] border-black" colSpan={2}>IMIGRASI</th>
              <th className="border-[1.5px] border-black" colSpan={2}>NAMA ORANG TUA</th>
            </tr>
            <tr className="h-9">
              <th className="border-[1.5px] border-black">NO. PASPOR</th>
              <th className="border-[1.5px] border-black">NO. KITAS/KITAP</th>
              <th className="border-[1.5px] border-black">AYAH</th>
              <th className="border-[1.5px] border-black">IBU</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((m, idx) => (
              <tr key={m ? m.id : `empty-status-${idx}`} className={`h-10 ${m && highlightId === m.id ? 'bg-blue-50 ring-1 ring-blue-400 ring-inset' : ''}`}>
                <td className="border-[1.5px] border-black text-center">{idx + 1}</td>
                <td className="border-[1.5px] border-black text-center">{m ? m.statusPerkawinan : ""}</td>
                <td className="border-[1.5px] border-black text-center">{m ? m.statusHubungan : ""}</td>
                <td className="border-[1.5px] border-black text-center">{m ? m.kewarganegaraan : ""}</td>
                <td className="border-[1.5px] border-black text-center">{m ? m.noPaspor : ""}</td>
                <td className="border-[1.5px] border-black text-center">{m ? m.noKitasKitap : ""}</td>
                <td className="border-[1.5px] border-black px-2">{m ? m.namaAyah : ""}</td>
                <td className="border-[1.5px] border-black px-2">{m ? m.namaIbu : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PENGESAHAN */}
      <div className="grid grid-cols-3 gap-10 text-[11px] font-bold uppercase relative z-10 mt-20 px-10">
        <div className="text-center flex flex-col items-center">
          <p className="mb-4 text-[10px] opacity-70">DIKELUARKAN TANGGAL: 01-01-2024</p>
          <p className="mb-28">KEPALA KELUARGA,</p>
          <div className="border-b-[2px] border-black px-12 pb-1.5">
            <span className="text-[12px]">{kepalaKeluarga}</span>
          </div>
        </div>
        
        <div className="flex flex-col justify-center items-center">
          <div className="w-24 h-24 border-[2px] border-black bg-slate-50 mb-3 shadow-inner flex items-center justify-center p-2">
             <div className="text-[6px] text-center font-black leading-[1] opacity-40">
               DIGITAL<br/>SIGNATURE<br/>APPROVED
             </div>
          </div>
          <p className="text-[7px] text-center tracking-tighter uppercase font-black leading-tight opacity-60">
            TANDA TANGAN ELEKTRONIK<br/>TERVERIFIKASI SISTEM
          </p>
        </div>

        <div className="text-center flex flex-col items-center">
          <p>KEPALA DINAS KEPENDUDUKAN DAN</p>
          <p className="mb-8">PENCATATAN SIPIL KAB. PURBOLINGGO</p>
          <div className="mb-28"></div>
          <div className="border-b-[2px] border-black px-12 pb-1.5">
            <span className="text-[12px]">DRS. H. PURWOKO, M.SI</span>
          </div>
          <p className="text-[9px] mt-1.5 normal-case font-black opacity-80">NIP. 19650101 199003 1 001</p>
        </div>
      </div>
    </div>
  );
};

export default FamilyDocument;
