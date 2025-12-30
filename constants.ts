
import { FamilyCardData } from './types';

const generate5Members = (headName: string, nikPrefix: string, alamat: string): any[] => [
  {
    id: 1,
    namaLengkap: headName.toUpperCase(),
    nik: `${nikPrefix}0001`,
    jenisKelamin: 'Laki-Laki',
    tempatLahir: 'PURBOLINGGO',
    tanggalLahir: '10-05-1975',
    agama: 'ISLAM',
    pendidikan: 'S1',
    jenisPekerjaan: 'WIRASWASTA',
    statusPerkawinan: 'KAWIN',
    statusHubungan: 'KEPALA KELUARGA',
    kewarganegaraan: 'WNI',
    noPaspor: '-',
    noKitasKitap: '-',
    namaAyah: 'SOEMARTO',
    namaIbu: 'SITI',
    riwayatPendidikan: ['S1 Teknik Sipil', 'SMA N 1 Purbolinggo'],
    riwayatPekerjaan: ['Pemilik Toko Material', 'Kontraktor Lokal']
  },
  {
    id: 2,
    namaLengkap: `SITI ${headName.split(' ')[0]}IAH`.toUpperCase(),
    nik: `${nikPrefix}0002`,
    jenisKelamin: 'Perempuan',
    tempatLahir: 'PURBOLINGGO',
    tanggalLahir: '15-08-1978',
    agama: 'ISLAM',
    pendidikan: 'SMA',
    jenisPekerjaan: 'MENGURUS RUMAH TANGGA',
    statusPerkawinan: 'KAWIN',
    statusHubungan: 'ISTRI',
    kewarganegaraan: 'WNI',
    noPaspor: '-',
    noKitasKitap: '-',
    namaAyah: 'KASIMAN',
    namaIbu: 'AMINAH',
    riwayatPekerjaan: ['Wirausaha Kuliner']
  },
  {
    id: 3,
    namaLengkap: `ADITYA ${headName.split(' ')[0]}`.toUpperCase(),
    nik: `${nikPrefix}0003`,
    jenisKelamin: 'Laki-Laki',
    tempatLahir: 'PURBOLINGGO',
    tanggalLahir: '20-12-2000',
    agama: 'ISLAM',
    pendidikan: 'S1',
    jenisPekerjaan: 'SOFTWARE ENGINEER',
    statusPerkawinan: 'BELUM KAWIN',
    statusHubungan: 'ANAK',
    kewarganegaraan: 'WNI',
    noPaspor: 'B112233',
    noKitasKitap: '-',
    namaAyah: headName,
    namaIbu: `SITI ${headName.split(' ')[0]}IAH`,
    riwayatPekerjaan: ['Junior Dev at TechCorp']
  },
  {
    id: 4,
    namaLengkap: `RANI ${headName.split(' ')[0]}IA`.toUpperCase(),
    nik: `${nikPrefix}0004`,
    jenisKelamin: 'Perempuan',
    tempatLahir: 'PURBOLINGGO',
    tanggalLahir: '05-02-2005',
    agama: 'ISLAM',
    pendidikan: 'SMA',
    jenisPekerjaan: 'PELAJAR/MAHASISWA',
    statusPerkawinan: 'BELUM KAWIN',
    statusHubungan: 'ANAK',
    kewarganegaraan: 'WNI',
    noPaspor: '-',
    noKitasKitap: '-',
    namaAyah: headName,
    namaIbu: `SITI ${headName.split(' ')[0]}IAH`
  },
  {
    id: 5,
    namaLengkap: `BUDI ${headName.split(' ')[0]} SETIAWAN`.toUpperCase(),
    nik: `${nikPrefix}0005`,
    jenisKelamin: 'Laki-Laki',
    tempatLahir: 'PURBOLINGGO',
    tanggalLahir: '12-09-2010',
    agama: 'ISLAM',
    pendidikan: 'SMP',
    jenisPekerjaan: 'PELAJAR/MAHASISWA',
    statusPerkawinan: 'BELUM KAWIN',
    statusHubungan: 'ANAK',
    kewarganegaraan: 'WNI',
    noPaspor: '-',
    noKitasKitap: '-',
    namaAyah: headName,
    namaIbu: `SITI ${headName.split(' ')[0]}IAH`
  }
];

export const INITIAL_KK_LIST: FamilyCardData[] = [
  {
    nomorKK: "1807123456780001",
    alamat: "JL. RAYA PURBOLINGGO NO. 10",
    rtRw: "001 / 002",
    kodePos: "34152",
    desaKelurahan: "PURBOLINGGO",
    kecamatan: "PURBOLINGGO",
    kabupatenKota: "LAMPUNG TIMUR",
    provinsi: "LAMPUNG",
    members: generate5Members("Khoirul Anam", "180701101075", "Purbolinggo")
  },
  {
    nomorKK: "1807123456780002",
    alamat: "GANG MERPATI NO. 5",
    rtRw: "003 / 001",
    kodePos: "34152",
    desaKelurahan: "TAMAN ENDAH",
    kecamatan: "PURBOLINGGO",
    kabupatenKota: "LAMPUNG TIMUR",
    provinsi: "LAMPUNG",
    members: generate5Members("Bambang Susanto", "180701150570", "Taman Endah")
  }
];
