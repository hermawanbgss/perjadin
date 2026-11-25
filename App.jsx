import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  Users,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Settings,
  Upload,
  FolderDown,
  Building2,
  Calendar,
  MapPin,
  UserCheck,
  Briefcase
} from 'lucide-react';

const DEFAULT_PEGAWAI = [
  {
    id: '1',
    nama: 'Faradina Nur Fitriansyah',
    nip: '200005122019121005',
    pangkat: 'Pengatur/IIc',
    jabatan: 'Bendaharawan',
    seksi: 'Subbagian Umum dan Kepatuhan Internal',
    unitKerja: 'KPP Pratama Jakarta Tanah Abang Satu'
  },
  {
    id: '2',
    nama: 'Enjang Milanti Okky Kusuma Astuti',
    nip: '199510092016122004',
    pangkat: 'Pengatur/IIc',
    jabatan: 'Pelaksana',
    seksi: 'Subbagian Umum dan Kepatuhan Internal',
    unitKerja: 'KPP Pratama Jakarta Tanah Abang Satu'
  },
  {
    id: '3',
    nama: 'Bagas Hermawan',
    nip: '200005122019121005',
    pangkat: 'Pengatur/IIc',
    jabatan: 'Pelaksana',
    seksi: 'Subbagian Umum dan Kepatuhan Internal',
    unitKerja: 'KPP Pratama Jakarta Tanah Abang Satu'
  }
];

const DEFAULT_PEJABAT = [
  {
    id: 'p1',
    nama: 'Herwin Endar Mulia Siregar',
    jabatan: 'Kepala Subbagian Umum dan Kepatuhan Internal',
    jabatanSingkat: 'Kepala Seksi'
  }
];

const BULAN_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function formatTanggalIndonesia(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(monthIdx) || monthIdx < 0 || monthIdx > 11) return dateStr;
  return `${day} ${BULAN_ID[monthIdx]} ${year}`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'master'
  const [activeDoc, setActiveDoc] = useState('laporan'); // 'laporan' | 'geotagging' | 'kendaraan'
  const [activePegawaiIdx, setActivePegawaiIdx] = useState(0);

  // Master Data State
  const [pegawaiList, setPegawaiList] = useState(() => {
    const saved = localStorage.getItem('perjadin_pegawai_v1');
    return saved ? JSON.parse(saved) : DEFAULT_PEGAWAI;
  });

  const [pejabatList, setPejabatList] = useState(() => {
    const saved = localStorage.getItem('perjadin_pejabat_v1');
    return saved ? JSON.parse(saved) : DEFAULT_PEJABAT;
  });

  // Form Data State
  const [selectedIds, setSelectedIds] = useState(['1', '2', '3']);
  const [formData, setFormData] = useState({
    nomorSt: 'ST-297/KPP.0610/2026',
    tanggalSt: '2026-05-21',
    tanggalKegiatan: '2026-05-25',
    tujuanKunjungan: 'Sosialisasi Pelaporan Data Capaian Output 2026 di KPPN Jakarta II Jl. Wahidin II No.3, Pasar Baru, Kecamatan Sawah Besar, Kota Jakarta Pusat',
    rencanaTindakLanjut: '-',
    kotaKeberangkatan: 'Bendungan Hilir, Jakarta Pusat',
    kotaTujuan: 'Kecamatan Sawah Besar, Jakarta Pusat',
    kotaKepulangan: 'Bendungan Hilir, Jakarta Pusat',
    tanggalTtd: '2026-07-22',
    tempatTtdLaporan: 'Jakarta',
    tempatTtdGeotag: 'Jakarta Pusat',
    atsungId: 'p1',
    namaPpk: 'Mauludin Gojali'
  });

  // New Pegawai / Pejabat inputs
  const [newPegawai, setNewPegawai] = useState({
    nama: '',
    nip: '',
    pangkat: '',
    jabatan: 'Pelaksana',
    seksi: 'Subbagian Umum dan Kepatuhan Internal',
    unitKerja: 'KPP Pratama Jakarta Tanah Abang Satu'
  });

  const [newPejabat, setNewPejabat] = useState({
    nama: '',
    jabatan: '',
    jabatanSingkat: 'Kepala Seksi'
  });

  const [logoBase64, setLogoBase64] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('perjadin_pegawai_v1', JSON.stringify(pegawaiList));
  }, [pegawaiList]);

  useEffect(() => {
    localStorage.setItem('perjadin_pejabat_v1', JSON.stringify(pejabatList));
  }, [pejabatList]);

  // Convert public/logo-kemenkeu.png to base64 so exported .doc files embed the exact logo cleanly
  useEffect(() => {
    fetch('/logo-kemenkeu.png')
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setLogoBase64(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {
        setLogoBase64('/logo-kemenkeu.png');
      });
  }, []);

  const selectedPegawai = pegawaiList.filter((p) => selectedIds.includes(p.id));
  const currentPegawai = selectedPegawai[activePegawaiIdx] || selectedPegawai[0] || pegawaiList[0];
  const selectedAtsung = pejabatList.find((p) => p.id === formData.atsungId) || pejabatList[0] || {
    nama: 'Herwin Endar Mulia Siregar',
    jabatan: 'Kepala Subbagian Umum dan Kepatuhan Internal',
    jabatanSingkat: 'Kepala Seksi'
  };

  useEffect(() => {
    if (activePegawaiIdx >= selectedPegawai.length) {
      setActivePegawaiIdx(0);
    }
  }, [selectedPegawai.length, activePegawaiIdx]);

  const toggleSelectPegawai = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddPegawai = (e) => {
    e.preventDefault();
    if (!newPegawai.nama || !newPegawai.nip) return;
    const item = { ...newPegawai, id: Date.now().toString() };
    setPegawaiList((prev) => [...prev, item]);
    setNewPegawai({
      nama: '',
      nip: '',
      pangkat: '',
      jabatan: 'Pelaksana',
      seksi: 'Subbagian Umum dan Kepatuhan Internal',
      unitKerja: 'KPP Pratama Jakarta Tanah Abang Satu'
    });
  };

  const handleDeletePegawai = (id) => {
    setPegawaiList((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleAddPejabat = (e) => {
    e.preventDefault();
    if (!newPejabat.nama || !newPejabat.jabatan) return;
    const item = { ...newPejabat, id: 'p_' + Date.now().toString() };
    setPejabatList((prev) => [...prev, item]);
    setNewPejabat({ nama: '', jabatan: '', jabatanSingkat: 'Kepala Seksi' });
  };

  const handleExportMaster = () => {
    const payload = { pegawaiList, pejabatList };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'master-data-perjadin-kpp0610.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportMaster = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (Array.isArray(parsed.pegawaiList)) setPegawaiList(parsed.pegawaiList);
        if (Array.isArray(parsed.pejabatList)) setPejabatList(parsed.pejabatList);
        alert('Data master berhasil diimpor!');
      } catch {
        alert('Format file JSON tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  // HTML Builders for Word (.doc) Export
  const getKopSuratHtml = () => {
    const imgSrc = logoBase64 || `${window.location.origin}/logo-kemenkeu.png`;
    return `
      <table style="width: 100%; border-collapse: collapse; border-bottom: 3px solid #000000; margin-bottom: 14px; font-family: Arial, sans-serif;">
        <tr>
          <td style="width: 85px; vertical-align: middle; text-align: center; padding-bottom: 6px;">
            <img src="${imgSrc}" width="72" height="72" style="width: 72px; height: auto;" />
          </td>
          <td style="vertical-align: middle; text-align: center; padding-bottom: 6px;">
            <div style="font-size: 11pt; font-weight: bold; line-height: 1.2;">KEMENTERIAN KEUANGAN REPUBLIK INDONESIA</div>
            <div style="font-size: 10pt; font-weight: bold; line-height: 1.2;">DIREKTORAT JENDERAL PAJAK</div>
            <div style="font-size: 9.5pt; font-weight: bold; line-height: 1.2;">KANTOR WILAYAH DIREKTORAT JENDERAL PAJAK JAKARTA PUSAT</div>
            <div style="font-size: 10.5pt; font-weight: bold; line-height: 1.2;">KANTOR PELAYANAN PAJAK PRATAMA JAKARTA TANAH ABANG SATU</div>
            <div style="font-size: 7.5pt; line-height: 1.25; margin-top: 2px;">
              JALAN PENJERNIHAN I NO.36, JAKARTA PUSAT 10210<br/>
              TELEPON (021) 5735206, 5735207, 5734726, 5734727, FAKSIMILE (021) 5734738; LAMAN www.pajak.go.id<br/>
              LAYANAN INFORMASI DAN PENGADUAN KRING PAJAK (021) 1500200;<br/>
              SUREL pengaduan@pajak.go.id; informasi@pajak.go.id
            </div>
          </td>
        </tr>
      </table>
    `;
  };

  const buildLaporanHtml = () => {
    const pesertaBlocks = selectedPegawai
      .map(
        (p) => `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px; font-family: Arial, sans-serif; font-size: 10pt;">
          <tr><td style="width: 160px; padding: 1px 0;">Nama/NIP</td><td style="width: 15px;">:</td><td>${p.nama}/${p.nip}</td></tr>
          <tr><td style="padding: 1px 0;">Pangkat/Gol.</td><td>:</td><td>${p.pangkat}</td></tr>
          <tr><td style="padding: 1px 0;">Jabatan</td><td>:</td><td>${p.jabatan}</td></tr>
          <tr><td style="padding: 1px 0;">Seksi</td><td>:</td><td>${p.seksi}</td></tr>
        </table>
      `
      )
      .join('');

    const pesertaTtdBlocks = selectedPegawai
      .map(
        (p, idx) => `
        <div style="margin-bottom: 18px;">
          <div>Peserta ${idx + 1}</div>
          <div style="height: 36px; line-height: 36px; color: #555555; font-style: italic; font-size: 9pt;">Ditandatangani secara elektronik</div>
          <div>${p.nama}</div>
        </div>
      `
      )
      .join('');

    return `
      ${getKopSuratHtml()}
      <div style="font-family: Arial, sans-serif; font-size: 10pt; color: #000;">
        <div style="text-align: center; font-weight: bold; font-size: 11pt; margin: 12px 0 14px 0;">LAPORAN HASIL KEGIATAN</div>
        <div style="font-weight: bold; margin-bottom: 6px;">Identitas Pelaksana Kegiatan</div>
        ${pesertaBlocks}
        <div style="font-weight: bold; margin: 14px 0 6px 0;">Deskripsi Kegiatan</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 9.5pt; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #000; padding: 6px; width: 35px; text-align: center;">No.</th>
              <th style="border: 1px solid #000; padding: 6px; width: 155px; text-align: center;">Nomor ST/SIK/Surat Penugasan</th>
              <th style="border: 1px solid #000; padding: 6px; width: 105px; text-align: center;">Tanggal Kunjungan</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center;">Tujuan Kunjungan</th>
              <th style="border: 1px solid #000; padding: 6px; width: 115px; text-align: center;">Rencana Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #000; padding: 6px; text-align: center; vertical-align: top;">1.</td>
              <td style="border: 1px solid #000; padding: 6px; vertical-align: top;">${formData.nomorSt}</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: center; vertical-align: top;">${formatTanggalIndonesia(formData.tanggalKegiatan)}</td>
              <td style="border: 1px solid #000; padding: 6px; vertical-align: top;">${formData.tujuanKunjungan}</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: center; vertical-align: top;">${formData.rencanaTindakLanjut || '-'}</td>
            </tr>
          </tbody>
        </table>
        <table style="width: 100%; border-collapse: collapse; font-size: 10pt; margin-top: 12px;">
          <tr>
            <td style="width: 50%; vertical-align: top;">
              <div>&nbsp;</div>
              <div>Mengetahui</div>
              <div>${selectedAtsung.jabatanSingkat || 'Kepala Seksi'}</div>
              <div style="height: 36px; line-height: 36px; color: #555555; font-style: italic; font-size: 9pt;">Ditandatangani secara elektronik</div>
              <div>${selectedAtsung.nama}</div>
            </td>
            <td style="width: 50%; vertical-align: top; padding-left: 30px;">
              <div style="margin-bottom: 6px;">${formData.tempatTtdLaporan}, ${formatTanggalIndonesia(formData.tanggalTtd)}</div>
              ${pesertaTtdBlocks}
            </td>
          </tr>
        </table>
      </div>
    `;
  };

  const buildGeotaggingHtml = (pegawai) => {
    return `
      ${getKopSuratHtml()}
      <div style="font-family: Arial, sans-serif; font-size: 10pt; color: #000; line-height: 1.45;">
        <div style="text-align: center; font-weight: bold; font-size: 11pt; margin: 12px 0 16px 0;">
          SURAT KETERANGAN KEHADIRAN<br/>DAN PELAKSANAAN TUGAS PERJALANAN DINAS
        </div>
        <p style="margin-bottom: 8px;">Yang bertanda tangan di bawah ini:</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
          <tr><td style="width: 170px; padding: 2px 0;">Nama</td><td style="width: 15px;">:</td><td>${pegawai.nama}</td></tr>
          <tr><td style="padding: 2px 0;">NIP</td><td>:</td><td>${pegawai.nip}</td></tr>
          <tr><td style="padding: 2px 0;">Pangkat/Golongan</td><td>:</td><td>${pegawai.pangkat}</td></tr>
          <tr><td style="padding: 2px 0;">Unit Kerja</td><td>:</td><td>${pegawai.unitKerja}</td></tr>
        </table>
        <p style="margin-bottom: 8px;">yang melakukan perjalanan dinas berikut:</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
          <tr><td style="width: 170px; padding: 2px 0;">Nomor Surat Tugas</td><td style="width: 15px;">:</td><td>${formData.nomorSt}</td></tr>
          <tr><td style="padding: 2px 0;">Tanggal Surat Tugas</td><td>:</td><td>${formatTanggalIndonesia(formData.tanggalSt)}</td></tr>
          <tr><td style="padding: 2px 0;">Tanggal kegiatan</td><td>:</td><td>${formatTanggalIndonesia(formData.tanggalKegiatan)}</td></tr>
          <tr><td style="padding: 2px 0;">Kota Keberangkatan</td><td>:</td><td>${formData.kotaKeberangkatan}</td></tr>
          <tr><td style="padding: 2px 0;">Kota Tujuan</td><td>:</td><td>${formData.kotaTujuan}</td></tr>
          <tr><td style="padding: 2px 0;">Kota Kepulangan</td><td>:</td><td>${formData.kotaKepulangan}</td></tr>
        </table>
        <p style="text-align: justify; margin-bottom: 10px;">
          telah hadir dan melaksanakan tugas perjalanan dinas di lokasi sebagaimana tersebut di atas dan tidak dapat melakukan pemindaian posisi berdasarkan koordinat (geotagging) karena tidak sengaja tidak melaksanakan geotagging sebagaimana ketentuan yang berlaku.
        </p>
        <p style="margin-bottom: 18px;">Demikian pernyataan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 52%; vertical-align: top;">
              <div>Mengetahui,</div>
              <div>${selectedAtsung.jabatan},</div>
              <div style="height: 38px; line-height: 38px; color: #555555; font-style: italic; font-size: 9pt;">Ditandatangani secara elektronik</div>
              <div>${selectedAtsung.nama}</div>
            </td>
            <td style="width: 48%; vertical-align: top; padding-left: 24px;">
              <div>${formData.tempatTtdGeotag}, ${formatTanggalIndonesia(formData.tanggalTtd)}</div>
              <div>Pembuat Pernyataan</div>
              <div style="height: 38px; line-height: 38px; color: #555555; font-style: italic; font-size: 9pt;">Ditandatangani secara elektronik</div>
              <div>${pegawai.nama}</div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top: 22px;">
              <div>Menyetujui</div>
              <div>Pejabat Pembuat Komitmen,</div>
              <div style="height: 38px; line-height: 38px; color: #555555; font-style: italic; font-size: 9pt;">Ditandatangani secara elektronik</div>
              <div>${formData.namaPpk}</div>
            </td>
          </tr>
        </table>
      </div>
    `;
  };

  const buildKendaraanHtml = (pegawai) => {
    return `
      <div style="font-family: Arial, sans-serif; font-size: 10.5pt; color: #000; line-height: 1.5; padding-top: 10px;">
        <div style="text-align: center; font-weight: bold; font-size: 11.5pt; margin-bottom: 22px;">
          SURAT PERNYATAAN<br/>TIDAK MENGGUNAKAN KENDARAAN DINAS
        </div>
        <p style="margin-bottom: 10px;">Yang bertanda tangan di bawah ini</p>
        <table style="width: 100%; border-collapse: collapse; margin-left: 24px; margin-bottom: 14px;">
          <tr><td style="width: 145px; padding: 3px 0;">Nama</td><td style="width: 15px;">:</td><td>${pegawai.nama}</td></tr>
          <tr><td style="padding: 3px 0;">NIP</td><td>:</td><td>${pegawai.nip}</td></tr>
          <tr><td style="padding: 3px 0;">Pangkat/Gol.</td><td>:</td><td>${pegawai.pangkat}</td></tr>
          <tr><td style="padding: 3px 0;">Kantor</td><td>:</td><td>${pegawai.unitKerja}</td></tr>
        </table>
        <p style="text-align: justify; margin-bottom: 14px;">
          menerangkan bahwa dalam rangka melaksanakan perjalanan dinas ${formData.tujuanKunjungan}, sesuai dengan Surat Tugas Nomor ${formData.nomorSt}, tanggal ${formatTanggalIndonesia(formData.tanggalSt)} saya benar-benar tidak menggunakan kendaraan dinas.
        </p>
        <p style="text-align: justify; margin-bottom: 28px;">
          Demikian pernyataan ini kami buat dengan sebenar-benarnya untuk dipergunakan sebagaimana mestinya. Apabila terdapat kekeliruan dalam pertanggungjawaban SPD dan mengakibatkan kerugian negara, saya bersedia menyetorkan kerugian tersebut ke Kas Negara.
        </p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 52%; vertical-align: top;">
              <div>Mengetahui/Menyetujui</div>
              <div>Pejabat Pembuat Komitmen</div>
              <div style="height: 45px; line-height: 45px; color: #555555; font-style: italic; font-size: 9pt;">Ditandatangani secara elektronik</div>
              <div>${formData.namaPpk}</div>
            </td>
            <td style="width: 48%; vertical-align: top; padding-left: 20px;">
              <div>${formData.tempatTtdLaporan}, ${formatTanggalIndonesia(formData.tanggalTtd)}</div>
              <div>Pegawai Negeri yang melakukan</div>
              <div>Perjalanan Dinas,</div>
              <div style="height: 30px; line-height: 30px; color: #555555; font-style: italic; font-size: 9pt;">Ditandatangani secara elektronik</div>
              <div>${pegawai.nama}</div>
            </td>
          </tr>
        </table>
      </div>
    `;
  };

  const downloadWordDoc = (innerHtml, fileName) => {
    const fullHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office'
            xmlns:w='urn:schemas-microsoft-com:office:word'
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${fileName}</title>
        <style>
          @page { size: A4; margin: 1.5cm 2cm; }
          body { font-family: Arial, sans-serif; }
        </style>
      </head>
      <body>${innerHtml}</body>
      </html>
    `;
    const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCurrent = () => {
    const safeSt = formData.nomorSt.replace(/[^a-zA-Z0-9-]/g, '_');
    if (activeDoc === 'laporan') {
      downloadWordDoc(buildLaporanHtml(), `Laporan_Kegiatan_${safeSt}`);
    } else if (activeDoc === 'geotagging' && currentPegawai) {
      downloadWordDoc(
        buildGeotaggingHtml(currentPegawai),
        `Surat_Ket_Geotagging_${currentPegawai.nama.replace(/\s+/g, '_')}_${safeSt}`
      );
    } else if (activeDoc === 'kendaraan' && currentPegawai) {
      downloadWordDoc(
        buildKendaraanHtml(currentPegawai),
        `Surat_Pernyataan_Non_Randis_${currentPegawai.nama.replace(/\s+/g, '_')}_${safeSt}`
      );
    }
  };

  const handleDownloadAll = () => {
    if (selectedPegawai.length === 0) {
      alert('Pilih minimal 1 pegawai pelaksana terlebih dahulu.');
      return;
    }
    const safeSt = formData.nomorSt.replace(/[^a-zA-Z0-9-]/g, '_');
    downloadWordDoc(buildLaporanHtml(), `1_Laporan_Kegiatan_${safeSt}`);

    selectedPegawai.forEach((peg, idx) => {
      const safeName = peg.nama.replace(/\s+/g, '_');
      setTimeout(() => {
        downloadWordDoc(buildGeotaggingHtml(peg), `2_Ket_Geotagging_${safeName}_${safeSt}`);
      }, (idx * 2 + 1) * 350);
      setTimeout(() => {
        downloadWordDoc(buildKendaraanHtml(peg), `3_Pernyataan_Non_Randis_${safeName}_${safeSt}`);
      }, (idx * 2 + 2) * 350);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Top Navbar */}
      <header className="no-print bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo-kemenkeu.png"
              alt="Logo Kemenkeu"
              className="w-9 h-9 bg-white rounded p-0.5 object-contain"
            />
            <div>
              <h1 className="font-bold text-sm sm:text-base leading-tight">
                Generator Dokumen Pertanggungjawaban Perjadin
              </h1>
              <p className="text-xs text-slate-300">
                KPP Pratama Jakarta Tanah Abang Satu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition ${
                activeTab === 'form'
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              Generator Dokumen
            </button>
            <button
              onClick={() => setActiveTab('master')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition ${
                activeTab === 'master'
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              Master Pegawai & Pejabat
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'master' ? (
        <main className="max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
          {/* Backup & Restore Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-800">Database Lokal Pegawai & Pejabat</h2>
              <p className="text-xs text-slate-500">
                Tersimpan otomatis di browser. Ekspor ke JSON untuk dibagikan ke rekan satu subbagian.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportMaster}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export JSON
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                Import JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportMaster}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Master Pegawai */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Daftar Pegawai Pelaksana
              </h3>

              <form onSubmit={handleAddPegawai} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={newPegawai.nama}
                  onChange={(e) => setNewPegawai({ ...newPegawai, nama: e.target.value })}
                  className="px-3 py-1.5 text-sm border rounded-md bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="NIP (18 digit)"
                  value={newPegawai.nip}
                  onChange={(e) => setNewPegawai({ ...newPegawai, nip: e.target.value })}
                  className="px-3 py-1.5 text-sm border rounded-md bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Pangkat/Gol. (cth: Pengatur/IIc)"
                  value={newPegawai.pangkat}
                  onChange={(e) => setNewPegawai({ ...newPegawai, pangkat: e.target.value })}
                  className="px-3 py-1.5 text-sm border rounded-md bg-white"
                />
                <input
                  type="text"
                  placeholder="Jabatan (cth: Pelaksana)"
                  value={newPegawai.jabatan}
                  onChange={(e) => setNewPegawai({ ...newPegawai, jabatan: e.target.value })}
                  className="px-3 py-1.5 text-sm border rounded-md bg-white"
                />
                <input
                  type="text"
                  placeholder="Seksi/Subbagian"
                  value={newPegawai.seksi}
                  onChange={(e) => setNewPegawai({ ...newPegawai, seksi: e.target.value })}
                  className="px-3 py-1.5 text-sm border rounded-md bg-white"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded-md flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Tambah Pegawai
                </button>
              </form>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b bg-slate-50 text-slate-600">
                      <th className="p-2.5">Nama / NIP</th>
                      <th className="p-2.5">Pangkat / Jabatan</th>
                      <th className="p-2.5">Seksi</th>
                      <th className="p-2.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pegawaiList.map((p) => (
                      <tr key={p.id} className="border-b hover:bg-slate-50">
                        <td className="p-2.5">
                          <div className="font-medium text-slate-900">{p.nama}</div>
                          <div className="text-slate-500">{p.nip}</div>
                        </td>
                        <td className="p-2.5">
                          <div>{p.pangkat}</div>
                          <div className="text-slate-500">{p.jabatan}</div>
                        </td>
                        <td className="p-2.5 text-slate-600">{p.seksi}</td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => handleDeletePegawai(p.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Master Atasan Langsung */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Pejabat / Atasan Langsung
              </h3>

              <form onSubmit={handleAddPejabat} className="space-y-2.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <input
                  type="text"
                  placeholder="Nama Pejabat"
                  value={newPejabat.nama}
                  onChange={(e) => setNewPejabat({ ...newPejabat, nama: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border rounded-md bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Jabatan Lengkap (cth: Kepala Subbagian Umum...)"
                  value={newPejabat.jabatan}
                  onChange={(e) => setNewPejabat({ ...newPejabat, jabatan: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border rounded-md bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Label di Laporan (cth: Kepala Seksi)"
                  value={newPejabat.jabatanSingkat}
                  onChange={(e) => setNewPejabat({ ...newPejabat, jabatanSingkat: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border rounded-md bg-white"
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-1.5 px-3 rounded-md flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Tambah Pejabat
                </button>
              </form>

              <div className="space-y-2">
                {pejabatList.map((pj) => (
                  <div key={pj.id} className="p-3 border rounded-lg flex items-start justify-between gap-2 text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">{pj.nama}</div>
                      <div className="text-slate-500">{pj.jabatan}</div>
                    </div>
                    <button
                      onClick={() => setPejabatList((prev) => prev.filter((x) => x.id !== pj.id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="max-w-7xl w-full mx-auto px-4 py-5 grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
          {/* Left Panel: Input Form */}
          <div className="no-print lg:col-span-5 space-y-4">
            {/* Pilih Pelaksana */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  1. Pilih Pelaksana Perjadin ({selectedPegawai.length})
                </h2>
                <button
                  onClick={() => setActiveTab('master')}
                  className="text-xs text-blue-600 hover:underline"
                >
                  + Kelola Pegawai
                </button>
              </div>
              <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                {pegawaiList.map((p) => {
                  const checked = selectedIds.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleSelectPegawai(p.id)}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer text-xs transition ${
                        checked
                          ? 'bg-blue-50 border-blue-300 text-slate-900'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{p.nama}</div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {p.nip} • {p.jabatan}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detail Surat Tugas & Kegiatan */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
              <h2 className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-amber-600" />
                2. Data Surat Tugas & Kegiatan
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nomor ST / SIK</label>
                  <input
                    type="text"
                    value={formData.nomorSt}
                    onChange={(e) => setFormData({ ...formData, nomorSt: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tanggal Surat Tugas</label>
                  <input
                    type="date"
                    value={formData.tanggalSt}
                    onChange={(e) => setFormData({ ...formData, tanggalSt: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tanggal Kegiatan</label>
                  <input
                    type="date"
                    value={formData.tanggalKegiatan}
                    onChange={(e) => setFormData({ ...formData, tanggalKegiatan: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tanggal Tanda Tangan</label>
                  <input
                    type="date"
                    value={formData.tanggalTtd}
                    onChange={(e) => setFormData({ ...formData, tanggalTtd: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-medium text-slate-700 mb-1">
                  Tujuan Kunjungan / Uraian Kegiatan
                </label>
                <textarea
                  rows={3}
                  value={formData.tujuanKunjungan}
                  onChange={(e) => setFormData({ ...formData, tujuanKunjungan: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                />
              </div>

              <div className="text-xs">
                <label className="block font-medium text-slate-700 mb-1">
                  Rencana Tindak Lanjut (Laporan Kegiatan)
                </label>
                <input
                  type="text"
                  value={formData.rencanaTindakLanjut}
                  onChange={(e) => setFormData({ ...formData, rencanaTindakLanjut: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                />
              </div>
            </div>

            {/* Rute Geotagging & Penandatangan */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3 text-xs">
              <h2 className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                3. Rute Geotagging & Penandatangan
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Kota Berangkat</label>
                  <input
                    type="text"
                    value={formData.kotaKeberangkatan}
                    onChange={(e) => setFormData({ ...formData, kotaKeberangkatan: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Kota Tujuan</label>
                  <input
                    type="text"
                    value={formData.kotaTujuan}
                    onChange={(e) => setFormData({ ...formData, kotaTujuan: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Kota Pulang</label>
                  <input
                    type="text"
                    value={formData.kotaKepulangan}
                    onChange={(e) => setFormData({ ...formData, kotaKepulangan: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Atasan Langsung</label>
                  <select
                    value={formData.atsungId}
                    onChange={(e) => setFormData({ ...formData, atsungId: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                  >
                    {pejabatList.map((pj) => (
                      <option key={pj.id} value={pj.id}>
                        {pj.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Pejabat Pembuat Komitmen</label>
                  <input
                    type="text"
                    value={formData.namaPpk}
                    onChange={(e) => setFormData({ ...formData, namaPpk: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Live Preview & Export */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            {/* Toolbar */}
            <div className="no-print bg-white rounded-xl shadow-sm border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setActiveDoc('laporan')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    activeDoc === 'laporan'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  1. Laporan Kegiatan
                </button>
                <button
                  onClick={() => setActiveDoc('geotagging')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    activeDoc === 'geotagging'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  2. Ket. Geotagging
                </button>
                <button
                  onClick={() => setActiveDoc('kendaraan')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    activeDoc === 'kendaraan'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  3. Non-Kendaraan Dinas
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium flex items-center gap-1"
                  title="Cetak / Simpan sebagai PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button
                  onClick={handleDownloadCurrent}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh Word
                </button>
                <button
                  onClick={handleDownloadAll}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1"
                  title="Unduh semua dokumen sekaligus untuk seluruh pegawai terpilih"
                >
                  <FolderDown className="w-3.5 h-3.5" />
                  Unduh Semua
                </button>
              </div>
            </div>

            {/* Individual Pegawai Switcher for Doc 2 & 3 */}
            {activeDoc !== 'laporan' && selectedPegawai.length > 0 && (
              <div className="no-print bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-medium text-amber-900">
                  Pratinjau dokumen individu untuk:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPegawai.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setActivePegawaiIdx(idx)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                        activePegawaiIdx === idx
                          ? 'bg-amber-600 text-white'
                          : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-100'
                      }`}
                    >
                      {p.nama}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* A4 Paper Sheet Preview */}
            <div className="bg-slate-300/60 p-3 sm:p-6 rounded-xl overflow-x-auto flex justify-center">
              <div
                className="print-area bg-white shadow-lg w-[210mm] min-h-[297mm] p-[15mm_20mm] text-black"
                style={{ fontFamily: 'Arial, sans-serif' }}
              >
                {selectedPegawai.length === 0 ? (
                  <div className="text-center text-slate-400 py-20 text-sm">
                    Silakan pilih minimal 1 pegawai pelaksana pada panel sebelah kiri.
                  </div>
                ) : activeDoc === 'laporan' ? (
                  <div dangerouslySetInnerHTML={{ __html: buildLaporanHtml() }} />
                ) : activeDoc === 'geotagging' ? (
                  <div dangerouslySetInnerHTML={{ __html: buildGeotaggingHtml(currentPegawai) }} />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: buildKendaraanHtml(currentPegawai) }} />
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
