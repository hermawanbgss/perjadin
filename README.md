# Generator Dokumen Pertanggungjawaban Perjalanan Dinas (Perjadin)
**KPP Pratama Jakarta Tanah Abang Satu**

Aplikasi web ringan untuk menghasilkan 3 jenis dokumen pertanggungjawaban perjalanan dinas sekaligus dalam format Word (`.doc`) maupun Cetak PDF A4:
1. **Laporan Hasil Kegiatan** (Kop Kemenkeu DJP + peserta dinamis + tabel kegiatan + TTE)
2. **Surat Keterangan Kehadiran & Tidak Melakukan Geotagging** (Kop Kemenkeu DJP + TTE Atasan Langsung, Pegawai, dan PPK)
3. **Surat Pernyataan Tidak Menggunakan Kendaraan Dinas** (Format bersih sesuai standar SPJ + TTE PPK dan Pegawai)

## Cara Deploy ke Vercel
1. Upload seluruh isi folder proyek ini ke repository **GitHub** baru.
2. Buka [vercel.com](https://vercel.com), login menggunakan akun GitHub, lalu klik **Add New Project**.
3. Pilih repository tersebut, biarkan pengaturan build default (`Vite` / `npm run build`), lalu klik **Deploy**.
4. Aplikasi siap digunakan secara online!

## Menjalankan di Lokal
```bash
npm install
npm run dev
```
