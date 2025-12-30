
export interface FamilyMember {
  id: number;
  namaLengkap: string;
  nik: string;
  jenisKelamin: 'Laki-Laki' | 'Perempuan';
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  pendidikan: string;
  jenisPekerjaan: string;
  statusPerkawinan: string;
  statusHubungan: string;
  kewarganegaraan: string;
  noPaspor: string;
  noKitasKitap: string;
  namaAyah: string;
  namaIbu: string;
  riwayatPendidikan?: string[];
  riwayatPekerjaan?: string[];
}

export interface FamilyCardData {
  nomorKK: string;
  alamat: string;
  rtRw: string;
  kodePos: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  members: FamilyMember[];
}
