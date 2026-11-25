import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Users,
  Printer,
  Download,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Upload,
  Save,
  Info,
  Building2,
  Calendar,
  MapPin,
  FileCheck,
  Car,
  Sparkles,
  Copy,
  CheckCircle2,
  ChevronDown,
  Rocket
} from 'lucide-react';

// ============================================================================
// DATA MASTER DEFAULT (PRE-POPULATED SESUAI TEMPLATE KPP TANAH ABANG SATU)
// ============================================================================
const DEFAULT_EMPLOYEES = [
  {
    id: 'emp-1',
    nama: 'Faradina Nur Fitriansyah',
    nip: '200005122019121005',
    pangkat: 'Pengatur/IIc',
    jabatan: 'Bendaharawan',
    seksi: 'Subbagian Umum dan Kepatuhan Internal',
    unitKerja: 'KPP Pratama Jakarta Tanah Abang Satu'
  },
  {
    id: 'emp-2',
    nama: 'Enjang Milanti Okky Kusuma Astuti',
    nip: '199510092016122004',
    pangkat: 'Pengatur/IIc',
    jabatan: 'Pelaksana',
    seksi: 'Subbagian Umum dan Kepatuhan Internal',
    unitKerja: 'KPP Pratama Jakarta Tanah Abang Satu'
  },
  {
    id: 'emp-3',
    nama: 'Bagas Hermawan',
    nip: '200005122019121005',
    pangkat: 'Pengatur/IIc',
    jabatan: 'Pelaksana',
    seksi: 'Subbagian Umum dan Kepatuhan Internal',
    unitKerja: 'KPP Pratama Jakarta Tanah Abang Satu'
  }
];

const DEFAULT_OFFICIALS = [
  {
    id: 'off-1',
    nama: 'Herwin Endar Mulia Siregar',
    nip: '198504122006021001',
    jabatan: 'Kepala Subbagian Umum dan Kepatuhan Internal',
    peran: 'ATSUNG' // Atasan Langsung / Kepala Seksi
  },
  {
    id: 'off-2',
    nama: 'Mauludin Gojali',
    nip: '198208172004121002',
    jabatan: 'Pejabat Pembuat Komitmen',
    peran: 'PPK'
  }
];

const DEFAULT_FORM_DATA = {
  nomorST: 'ST-297/KPP.0610/2026',
  tanggalST: '2026-05-21',
  tanggalKegiatan: '2026-05-25',
  tujuanKunjungan:
    'Sosialisasi Pelaporan Data Capaian Output 2026 di KPPN Jakarta II Jl. Wahidin II No.3, Pasar Baru, Kecamatan Sawah Besar, Kota Jakarta Pusat',
  rencanaTindakLanjut: '-',
  kotaKeberangkatan: 'Bendungan Hilir, Jakarta Pusat',
  kotaTujuan: 'Kecamatan Sawah Besar, Jakarta Pusat',
  kotaKepulangan: 'Bendungan Hilir, Jakarta Pusat',
  tanggalTTD: '2026-07-22',
  tempatTTDLaporan: 'Jakarta',
  tempatTTDGeotag: 'Jakarta Pusat',
  selectedParticipantIds: ['emp-1', 'emp-2', 'emp-3'],
  atsungId: 'off-1',
  ppkId: 'off-2'
};

// ============================================================================
// HELPER FUNCTIONS: FORMAT TANGGAL INDONESIA & SVG LOGO KEMENKEU
// ============================================================================
const BULAN_INDO = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

function formatTanggalIndo(isoDate) {
  if (!isoDate) return '....................................';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(day) || monthIndex < 0 || monthIndex > 11) return isoDate;
  return `${day} ${BULAN_INDO[monthIndex]} ${year}`;
}

// Komponen Logo Resmi Kementerian Keuangan (Nagara Dana Rakca) Vector SVG
const KemenkeuLogoSVG = ({ size = 76 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 190"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    {/* Bingkai Segilima Ganda */}
    <polygon
      points="100,6 192,72 157,182 43,182 8,72"
      fill="#FFFFFF"
      stroke="#000000"
      strokeWidth="3.5"
    />
    <polygon
      points="100,14 184,75 151,175 49,175 16,75"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
    />
    {/* Sayap Kiri (9 Helai) */}
    <g stroke="#000000" strokeWidth="1.8" fill="#FFFFFF">
      <path d="M68,132 C42,126 26,105 24,78 C36,86 48,98 64,116 Z" />
      <path d="M66,124 C40,115 26,93 27,66 C39,76 50,90 64,110 Z" />
      <path d="M65,115 C41,103 30,80 33,55 C44,67 54,83 65,104 Z" />
      <path d="M66,106 C45,91 37,68 42,45 C51,59 59,76 66,98 Z" />
      <path d="M68,97 C51,80 46,57 53,36 C60,51 65,69 69,91 Z" />
      {/* Bulu dalam sayap kiri */}
      <path d="M72,135 C55,134 45,123 46,110 C55,114 64,122 72,135 Z" />
      <path d="M71,125 C56,122 48,111 50,99 C58,104 65,113 71,125 Z" />
    </g>
    {/* Sayap Kanan (9 Helai) */}
    <g stroke="#000000" strokeWidth="1.8" fill="#FFFFFF">
      <path d="M132,132 C158,126 174,105 176,78 C164,86 152,98 136,116 Z" />
      <path d="M134,124 C160,115 174,93 173,66 C161,76 150,90 136,110 Z" />
      <path d="M135,115 C159,103 170,80 167,55 C156,67 146,83 135,104 Z" />
      <path d="M134,106 C155,91 163,68 158,45 C149,59 141,76 134,98 Z" />
      <path d="M132,97 C149,80 154,57 147,36 C140,51 135,69 131,91 Z" />
      {/* Bulu dalam sayap kanan */}
      <path d="M128,135 C145,134 155,123 154,110 C145,114 136,122 128,135 Z" />
      <path d="M129,125 C144,122 152,111 150,99 C142,104 135,113 129,125 Z" />
    </g>
    {/* Tugu / Gada di Tengah */}
    <g stroke="#000000" strokeWidth="1.8" fill="#FFFFFF">
      <path d="M88,58 C88,48 112,48 112,58 L108,142 L92,142 Z" />
      <line x1="88" y1="62" x2="112" y2="62" />
      <line x1="89" y1="70" x2="111" y2="70" />
      <line x1="89" y1="78" x2="111" y2="78" />
      <line x1="90" y1="86" x2="110" y2="86" />
      <line x1="90" y1="94" x2="110" y2="94" />
      <line x1="90" y1="102" x2="110" y2="102" />
      <line x1="91" y1="110" x2="109" y2="110" />
      <line x1="91" y1="118" x2="109" y2="118" />
      <line x1="91" y1="126" x2="109" y2="126" />
      <line x1="92" y1="134" x2="108" y2="134" />
    </g>
    {/* Tangkai Padi (Kiri) */}
    <g stroke="#000000" strokeWidth="1.5" fill="#FFFFFF">
      <path d="M84,136 C74,110 72,78 76,44" fill="none" />
      {[46, 56, 66, 76, 86, 96, 106, 116].map((y, i) => (
        <React.Fragment key={i}>
          <ellipse cx={73 - i * 0.4} cy={y} rx="3.2" ry="5.5" transform={`rotate(-28 ${73} ${y})`} />
          <ellipse cx={79 - i * 0.2} cy={y + 3} rx="3.2" ry="5.5" transform={`rotate(28 ${79} ${y + 3})`} />
        </React.Fragment>
      ))}
    </g>
    {/* Tangkai Kapas (Kanan) */}
    <g stroke="#000000" strokeWidth="1.5" fill="#FFFFFF">
      <path d="M116,136 C126,110 128,78 124,44" fill="none" />
      {[48, 63, 78, 93, 108, 122].map((y, i) => (
        <g key={i}>
          <circle cx={124 + (i % 2) * 2} cy={y} r="5.5" />
          <path d={`M${119 + (i % 2) * 2},${y + 3} Q${124 + (i % 2) * 2},${y + 8} ${129 + (i % 2) * 2},${y + 3}`} fill="none" />
        </g>
      ))}
    </g>
    {/* Pita Semboyan NAGARA DANA RAKCA */}
    <path
      d="M52,146 Q100,140 148,146 L144,162 Q100,156 56,162 Z"
      fill="#FFFFFF"
      stroke="#000000"
      strokeWidth="1.8"
    />
    <text
      x="100"
      y="156"
      textAnchor="middle"
      fontSize="8.2"
      fontWeight="bold"
      fontFamily="Arial, sans-serif"
      fill="#000000"
      letterSpacing="0.6"
    >
      NAGARA DANA RAKÇA
    </text>
  </svg>
);

// Komponen Kop Surat Resmi Kemenkeu DJP KPP Pratama Jakarta Tanah Abang Satu
const KopSuratKemenkeu = () => (
  <div className="border-b-[3px] border-black pb-2 mb-4">
    <div className="flex items-center gap-3">
      <KemenkeuLogoSVG size={76} />
      <div className="flex-1 text-center leading-tight text-black font-sans">
        <div className="text-[11pt] font-bold tracking-wide">
          KEMENTERIAN KEUANGAN REPUBLIK INDONESIA
        </div>
        <div className="text-[10pt] font-bold">
          DIREKTORAT JENDERAL PAJAK
        </div>
        <div className="text-[9.5pt] font-bold">
          KANTOR WILAYAH DIREKTORAT JENDERAL PAJAK JAKARTA PUSAT
        </div>
        <div className="text-[10pt] font-bold">
          KANTOR PELAYANAN PAJAK PRATAMA JAKARTA TANAH ABANG SATU
        </div>
        <div className="text-[7.5pt] mt-0.5 leading-snug">
          JALAN PENJERNIHAN I NO.36, JAKARTA PUSAT 10210
          <br />
          TELEPON (021) 5735206, 5735207, 5734726, 5734727, FAKSIMILE (021) 5734738; LAMAN www.pajak.go.id
          <br />
          LAYANAN INFORMASI DAN PENGADUAN KRING PAJAK (021) 1500200;
          <br />
          SUREL pengaduan@pajak.go.id; informasi@pajak.go.id
        </div>
      </div>
    </div>
    <div className="border-t border-black mt-1" />
  </div>
);

// ============================================================================
// KOMPONEN UTAMA APLIKASI
// ============================================================================
export default function App() {
  // State Navigasi Utama
  const [activeMainTab, setActiveMainTab] = useState('generator'); // 'generator' | 'master'
  const [activeDocTab, setActiveDocTab] = useState('laporan'); // 'laporan' | 'geotag' | 'kendaraan'
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // State Master Data (Persist ke localStorage)
  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem('kpp_ta1_employees');
      return saved ? JSON.parse(saved) : DEFAULT_EMPLOYEES;
    } catch {
      return DEFAULT_EMPLOYEES;
    }
  });

  const [officials, setOfficials] = useState(() => {
    try {
      const saved = localStorage.getItem('kpp_ta1_officials');
      return saved ? JSON.parse(saved) : DEFAULT_OFFICIALS;
    } catch {
      return DEFAULT_OFFICIALS;
    }
  });

  // State Form Input Perjadin
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  // State Pegawai Aktif untuk Pratinjau Dokumen Individual (Geotagging & Kendaraan Dinas)
  const [selectedIndividualId, setSelectedIndividualId] = useState('emp-3'); // Default Bagas Hermawan sesuai contoh

  // State Form Tambah/Edit Master Pegawai & Pejabat
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    nama: '',
    nip: '',
    pangkat: 'Pengatur/IIc',
    jabatan: 'Pelaksana',
    seksi: 'Subbagian Umum dan Kepatuhan Internal',
    unitKerja: 'KPP Pratama Jakarta Tanah Abang Satu'
  });

  const [newOfficial, setNewOfficial] = useState({
    nama: '',
    nip: '',
    jabatan: '',
    peran: 'ATSUNG'
  });

  // Quick Manual Add di Tab Generator
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);

  // Simpan perubahan Master Data ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kpp_ta1_employees', JSON.stringify(employees));
    } catch (e) {
      console.error('Gagal menyimpan pegawai ke localStorage', e);
    }
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem('kpp_ta1_officials', JSON.stringify(officials));
    } catch (e) {
      console.error('Gagal menyimpan pejabat ke localStorage', e);
    }
  }, [officials]);

  // Helper Notifikasi Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Daftar peserta terpilih (sesuai urutan array selectedParticipantIds)
  const selectedParticipants = useMemo(() => {
    return formData.selectedParticipantIds
      .map((id) => employees.find((emp) => emp.id === id))
      .filter(Boolean);
  }, [formData.selectedParticipantIds, employees]);

  // Sinkronisasi dropdown individu jika daftar peserta berubah
  useEffect(() => {
    if (
      selectedParticipants.length > 0 &&
      !selectedParticipants.some((p) => p.id === selectedIndividualId)
    ) {
      setSelectedIndividualId(selectedParticipants[0].id);
    }
  }, [selectedParticipants, selectedIndividualId]);

  const activeIndividual = useMemo(() => {
    return (
      selectedParticipants.find((p) => p.id === selectedIndividualId) ||
      selectedParticipants[0] ||
      employees[0] || {
        nama: '........................................',
        nip: '........................................',
        pangkat: '........................................',
        jabatan: '........................................',
        seksi: '........................................',
        unitKerja: 'KPP Pratama Jakarta Tanah Abang Satu'
      }
    );
  }, [selectedParticipants, selectedIndividualId, employees]);

  const selectedAtsung = useMemo(() => {
    return (
      officials.find((o) => o.id === formData.atsungId) ||
      officials.find((o) => o.peran === 'ATSUNG') || {
        nama: 'Herwin Endar Mulia Siregar',
        jabatan: 'Kepala Subbagian Umum dan Kepatuhan Internal'
      }
    );
  }, [officials, formData.atsungId]);

  const selectedPPK = useMemo(() => {
    return (
      officials.find((o) => o.id === formData.ppkId) ||
      officials.find((o) => o.peran === 'PPK') || {
        nama: 'Mauludin Gojali',
        jabatan: 'Pejabat Pembuat Komitmen'
      }
    );
  }, [officials, formData.ppkId]);

  // Handler Toggle & Urutan Peserta
  const toggleParticipant = (empId) => {
    setFormData((prev) => {
      const exists = prev.selectedParticipantIds.includes(empId);
      const updated = exists
        ? prev.selectedParticipantIds.filter((id) => id !== empId)
        : [...prev.selectedParticipantIds, empId];
      return { ...prev, selectedParticipantIds: updated };
    });
  };

  const moveParticipant = (index, direction) => {
    setFormData((prev) => {
      const list = [...prev.selectedParticipantIds];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      [list[index], list[targetIndex]] = [list[targetIndex], list[index]];
      return { ...prev, selectedParticipantIds: list };
    });
  };

  // ============================================================================
  // EXPORT KE WORD (.DOC / .DOCX COMPATIBLE HTML-WORD FORMAT)
  // ============================================================================
  const buildKopSuratHTML = () => `
    <table style="width:100%; border-collapse:collapse; border-bottom: 3px solid #000; margin-bottom: 12px;">
      <tr>
        <td style="width:85px; text-align:center; vertical-align:middle; padding-bottom:6px;">
          <svg width="72" height="72" viewBox="0 0 200 190" xmlns="http://www.w3.org/2000/svg">
            <polygon points="100,6 192,72 157,182 43,182 8,72" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
            <polygon points="100,14 184,75 151,175 49,175 16,75" fill="none" stroke="#000000" stroke-width="2"/>
            <path d="M88,58 C88,48 112,48 112,58 L108,142 L92,142 Z" fill="#FFF" stroke="#000" stroke-width="2"/>
            <path d="M52,146 Q100,140 148,146 L144,162 Q100,156 56,162 Z" fill="#FFF" stroke="#000" stroke-width="2"/>
            <text x="100" y="156" text-anchor="middle" font-size="8" font-weight="bold" font-family="Arial">NAGARA DANA RAKCA</text>
          </svg>
        </td>
        <td style="text-align:center; font-family: Arial, sans-serif; line-height:1.25; padding-bottom:6px;">
          <div style="font-size:11pt; font-weight:bold;">KEMENTERIAN KEUANGAN REPUBLIK INDONESIA</div>
          <div style="font-size:10pt; font-weight:bold;">DIREKTORAT JENDERAL PAJAK</div>
          <div style="font-size:9.5pt; font-weight:bold;">KANTOR WILAYAH DIREKTORAT JENDERAL PAJAK JAKARTA PUSAT</div>
          <div style="font-size:10pt; font-weight:bold;">KANTOR PELAYANAN PAJAK PRATAMA JAKARTA TANAH ABANG SATU</div>
          <div style="font-size:7.5pt; margin-top:2px;">
            JALAN PENJERNIHAN I NO.36, JAKARTA PUSAT 10210<br/>
            TELEPON (021) 5735206, 5735207, 5734726, 5734727, FAKSIMILE (021) 5734738; LAMAN www.pajak.go.id<br/>
            LAYANAN INFORMASI DAN PENGADUAN KRING PAJAK (021) 1500200;<br/>
            SUREL pengaduan@pajak.go.id; informasi@pajak.go.id
          </div>
        </td>
      </tr>
    </table>
  `;

  const generateWordHTML = (docType, targetPerson = activeIndividual) => {
    const tglST = formatTanggalIndo(formData.tanggalST);
    const tglKeg = formatTanggalIndo(formData.tanggalKegiatan);
    const tglTTD = formatTanggalIndo(formData.tanggalTTD);

    let bodyContent = '';

    if (docType === 'laporan') {
      const pesertaRows = selectedParticipants
        .map(
          (p) => `
          <table style="width:100%; border-collapse:collapse; margin-bottom:8px; font-family:Arial, sans-serif; font-size:10.5pt;">
            <tr><td style="width:160px; padding:1px 0;">Nama/NIP</td><td style="width:15px;">:</td><td>${p.nama}/${p.nip}</td></tr>
            <tr><td style="padding:1px 0;">Pangkat/Gol.</td><td>:</td><td>${p.pangkat}</td></tr>
            <tr><td style="padding:1px 0;">Jabatan</td><td>:</td><td>${p.jabatan}</td></tr>
            <tr><td style="padding:1px 0;">Seksi</td><td>:</td><td>${p.seksi}</td></tr>
          </table>
        `
        )
        .join('');

      const pesertaTTDRows = selectedParticipants
        .map(
          (p, idx) => `
          <div style="margin-bottom: 18px;">
            <div>Peserta ${idx + 1}</div>
            <div style="height:28px;"></div>
            <div style="font-size:9pt; color:#333;">Ditandatangani secara elektronik</div>
            <div style="font-weight:normal;">${p.nama}</div>
          </div>
        `
        )
        .join('');

      bodyContent = `
        ${buildKopSuratHTML()}
        <div style="text-align:center; font-weight:bold; font-size:11.5pt; margin:14px 0 12px 0; font-family:Arial, sans-serif;">
          LAPORAN HASIL KEGIATAN
        </div>
        <div style="font-weight:bold; font-size:10.5pt; margin-bottom:6px; font-family:Arial, sans-serif;">
          Identitas Pelaksana Kegiatan
        </div>
        ${pesertaRows}
        <div style="font-weight:bold; font-size:10.5pt; margin:14px 0 6px 0; font-family:Arial, sans-serif;">
          Deskripsi Kegiatan
        </div>
        <table style="width:100%; border-collapse:collapse; font-family:Arial, sans-serif; font-size:10pt; margin-bottom:20px;" border="1">
          <thead>
            <tr style="background-color:#f2f2f2; font-weight:bold; text-align:center;">
              <th style="border:1px solid #000; padding:6px; width:35px;">No.</th>
              <th style="border:1px solid #000; padding:6px; width:155px;">Nomor ST/SIK/Surat Penugasan</th>
              <th style="border:1px solid #000; padding:6px; width:105px;">Tanggal Kunjungan</th>
              <th style="border:1px solid #000; padding:6px;">Tujuan Kunjungan</th>
              <th style="border:1px solid #000; padding:6px; width:110px;">Rencana Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border:1px solid #000; padding:6px; text-align:center; vertical-align:top;">1.</td>
              <td style="border:1px solid #000; padding:6px; vertical-align:top;">${formData.nomorST}</td>
              <td style="border:1px solid #000; padding:6px; text-align:center; vertical-align:top;">${tglKeg}</td>
              <td style="border:1px solid #000; padding:6px; vertical-align:top;">${formData.tujuanKunjungan}</td>
              <td style="border:1px solid #000; padding:6px; text-align:center; vertical-align:top;">${formData.rencanaTindakLanjut || '-'}</td>
            </tr>
          </tbody>
        </table>
        <table style="width:100%; border-collapse:collapse; font-family:Arial, sans-serif; font-size:10.5pt; margin-top:16px;">
          <tr>
            <td style="width:55%; vertical-align:top;">
              <div>&nbsp;</div>
              <div>Mengetahui</div>
              <div>Kepala Seksi</div>
              <div style="height:28px;"></div>
              <div style="font-size:9pt; color:#333;">Ditandatangani secara elektronik</div>
              <div>${selectedAtsung.nama}</div>
            </td>
            <td style="width:45%; vertical-align:top;">
              <div>${formData.tempatTTDLaporan}, ${tglTTD}</div>
              ${pesertaTTDRows}
            </td>
          </tr>
        </table>
      `;
    } else if (docType === 'geotag') {
      bodyContent = `
        ${buildKopSuratHTML()}
        <div style="text-align:center; font-weight:bold; font-size:11.5pt; margin:16px 0 18px 0; font-family:Arial, sans-serif; line-height:1.35;">
          SURAT KETERANGAN KEHADIRAN<br/>
          DAN PELAKSANAAN TUGAS PERJALANAN DINAS
        </div>
        <p style="font-family:Arial, sans-serif; font-size:10.5pt; margin-bottom:8px;">
          Yang bertanda tangan di bawah ini:
        </p>
        <table style="width:100%; border-collapse:collapse; font-family:Arial, sans-serif; font-size:10.5pt; margin-bottom:14px;">
          <tr><td style="width:180px; padding:2px 0;">Nama</td><td style="width:15px;">:</td><td>${targetPerson.nama}</td></tr>
          <tr><td style="padding:2px 0;">NIP</td><td>:</td><td>${targetPerson.nip}</td></tr>
          <tr><td style="padding:2px 0;">Pangkat/Golongan</td><td>:</td><td>${targetPerson.pangkat}</td></tr>
          <tr><td style="padding:2px 0;">Unit Kerja</td><td>:</td><td>${targetPerson.unitKerja || 'KPP Pratama Jakarta Tanah Abang Satu'}</td></tr>
        </table>
        <p style="font-family:Arial, sans-serif; font-size:10.5pt; margin-bottom:8px;">
          yang melakukan perjalanan dinas berikut:
        </p>
        <table style="width:100%; border-collapse:collapse; font-family:Arial, sans-serif; font-size:10.5pt; margin-bottom:16px;">
          <tr><td style="width:180px; padding:2px 0;">Nomor Surat Tugas</td><td style="width:15px;">:</td><td>${formData.nomorST}</td></tr>
          <tr><td style="padding:2px 0;">Tanggal Surat Tugas</td><td>:</td><td>${tglST}</td></tr>
          <tr><td style="padding:2px 0;">Tanggal kegiatan</td><td>:</td><td>${tglKeg}</td></tr>
          <tr><td style="padding:2px 0;">Kota Keberangkatan</td><td>:</td><td>${formData.kotaKeberangkatan}</td></tr>
          <tr><td style="padding:2px 0;">Kota Tujuan</td><td>:</td><td>${formData.kotaTujuan}</td></tr>
          <tr><td style="padding:2px 0;">Kota Kepulangan</td><td>:</td><td>${formData.kotaKepulangan}</td></tr>
        </table>
        <p style="font-family:Arial, sans-serif; font-size:10.5pt; text-align:justify; line-height:1.5; margin-bottom:12px;">
          telah hadir dan melaksanakan tugas perjalanan dinas di lokasi sebagaimana tersebut di atas dan tidak dapat melakukan pemindaian posisi berdasarkan koordinat (geotagging) karena tidak sengaja tidak melaksanakan geotagging sebagaimana ketentuan yang berlaku.
        </p>
        <p style="font-family:Arial, sans-serif; font-size:10.5pt; margin-bottom:24px;">
          Demikian pernyataan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.
        </p>
        <table style="width:100%; border-collapse:collapse; font-family:Arial, sans-serif; font-size:10.5pt;">
          <tr>
            <td style="width:55%; vertical-align:top;">
              <div>Mengetahui,</div>
              <div>${selectedAtsung.jabatan},</div>
              <div style="height:34px;"></div>
              <div style="font-size:9pt; color:#333;">Ditandatangani secara elektronik</div>
              <div>${selectedAtsung.nama}</div>
            </td>
            <td style="width:45%; vertical-align:top;">
              <div>${formData.tempatTTDGeotag}, ${tglTTD}</div>
              <div>Pembuat Pernyataan</div>
              <div style="height:34px;"></div>
              <div style="font-size:9pt; color:#333;">Ditandatangani secara elektronik</div>
              <div>${targetPerson.nama}</div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:24px; padding-left:140px;">
              <div>Menyetujui</div>
              <div>Pejabat Pembuat Komitmen,</div>
              <div style="height:34px;"></div>
              <div style="font-size:9pt; color:#333;">Ditandatangani secara elektronik</div>
              <div>${selectedPPK.nama}</div>
            </td>
          </tr>
        </table>
      `;
    } else if (docType === 'kendaraan') {
      bodyContent = `
        <div style="text-align:center; font-weight:bold; font-size:12pt; margin:20px 0 24px 0; font-family:Arial, sans-serif; line-height:1.4;">
          SURAT PERNYATAAN<br/>
          TIDAK MENGGUNAKAN KENDARAAN DINAS
        </div>
        <p style="font-family:Arial, sans-serif; font-size:11pt; margin-bottom:10px;">
          Yang bertanda tangan di bawah ini
        </p>
        <table style="width:100%; border-collapse:collapse; font-family:Arial, sans-serif; font-size:11pt; margin-bottom:16px; margin-left:16px;">
          <tr><td style="width:160px; padding:3px 0;">Nama</td><td style="width:15px;">:</td><td>${targetPerson.nama}</td></tr>
          <tr><td style="padding:3px 0;">NIP</td><td>:</td><td>${targetPerson.nip}</td></tr>
          <tr><td style="padding:3px 0;">Pangkat/Gol.</td><td>:</td><td>${targetPerson.pangkat}</td></tr>
          <tr><td style="padding:3px 0;">Kantor</td><td>:</td><td>${targetPerson.unitKerja || 'KPP Pratama Jakarta Tanah Abang Satu'}</td></tr>
        </table>
        <p style="font-family:Arial, sans-serif; font-size:11pt; text-align:justify; line-height:1.6; margin-bottom:14px;">
          menerangkan bahwa dalam rangka melaksanakan perjalanan dinas ${formData.tujuanKunjungan}, sesuai dengan Surat Tugas Nomor ${formData.nomorST}, tanggal ${tglST} saya benar-benar tidak menggunakan kendaraan dinas.
        </p>
        <p style="font-family:Arial, sans-serif; font-size:11pt; text-align:justify; line-height:1.6; margin-bottom:32px;">
          Demikian pernyataan ini kami buat dengan sebenar-benarnya untuk dipergunakan sebagaimana mestinya. Apabila terdapat kekeliruan dalam pertanggungjawaban SPD dan mengakibatkan kerugian negara, saya bersedia menyetorkan kerugian tersebut ke Kas Negara.
        </p>
        <table style="width:100%; border-collapse:collapse; font-family:Arial, sans-serif; font-size:10.5pt;">
          <tr>
            <td style="width:52%; vertical-align:top;">
              <div>Mengetahui/Menyetujui</div>
              <div>Pejabat Pembuat Komitmen</div>
              <div style="height:42px;"></div>
              <div style="font-size:9pt; color:#333;">Ditandatangani secara elektronik</div>
              <div>${selectedPPK.nama}</div>
            </td>
            <td style="width:48%; vertical-align:top;">
              <div>${formData.tempatTTDLaporan}, ${tglTTD}</div>
              <div>Pegawai Negeri yang melakukan</div>
              <div>Perjalanan Dinas,</div>
              <div style="height:28px;"></div>
              <div style="font-size:9pt; color:#333;">Ditandatangani secara elektronik</div>
              <div>${targetPerson.nama}</div>
            </td>
          </tr>
        </table>
      `;
    }

    return `
      <html xmlns:o='urn:schemas-microsoft-com:office:office'
            xmlns:w='urn:schemas-microsoft-com:office:word'
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Dokumen Perjadin KPP Tanah Abang Satu</title>
        <style>
          @page { size: A4; margin: 1.8cm 2cm 1.8cm 2cm; }
          body { font-family: Arial, sans-serif; color: #000000; }
        </style>
      </head>
      <body>
        ${bodyContent}
      </body>
      </html>
    `;
  };

  const downloadWordFile = (docType, targetPerson = activeIndividual) => {
    const htmlContent = generateWordHTML(docType, targetPerson);
    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword;charset=utf-8'
    });
    const safeST = (formData.nomorST || 'ST').replace(/[^a-zA-Z0-9-_]/g, '_');
    const safeName = (targetPerson?.nama || 'Pegawai').replace(/\s+/g, '_');

    let filename = `${safeST}_Dokumen.doc`;
    if (docType === 'laporan') {
      filename = `Laporan_Hasil_Kegiatan_${safeST}.doc`;
    } else if (docType === 'geotag') {
      filename = `Surat_Ket_Tidak_Geotagging_${safeName}_${safeST}.doc`;
    } else if (docType === 'kendaraan') {
      filename = `Surat_Pernyataan_Tanpa_Kendaraan_Dinas_${safeName}_${safeST}.doc`;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Berhasil mengunduh: ${filename}`);
  };

  const downloadAllDocumentsBatch = () => {
    if (selectedParticipants.length === 0) {
      showToast('Pilih minimal 1 pegawai pelaksana terlebih dahulu.');
      return;
    }
    // Unduh Laporan Hasil Kegiatan (1 file gabungan)
    downloadWordFile('laporan');
    // Unduh Surat Geotagging & Kendaraan Dinas per masing-masing peserta dengan jeda ringan agar browser tidak memblokir multiple downloads
    selectedParticipants.forEach((person, idx) => {
      setTimeout(() => {
        downloadWordFile('geotag', person);
      }, (idx + 1) * 450);
      setTimeout(() => {
        downloadWordFile('kendaraan', person);
      }, (idx + 1) * 450 + 220);
    });
    showToast(
      `Mengunduh paket lengkap (${1 + selectedParticipants.length * 2} file Word)...`
    );
  };

  const handlePrintActiveDocument = () => {
    window.print();
  };

  // ============================================================================
  // HANDLER MASTER DATA PEGAWAI & PEJABAT (CRUD + JSON EXPORT/IMPORT)
  // ============================================================================
  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmployee.nama.trim() || !newEmployee.nip.trim()) return;
    const created = {
      ...newEmployee,
      id: `emp-${Date.now()}`
    };
    setEmployees((prev) => [...prev, created]);
    setNewEmployee({
      nama: '',
      nip: '',
      pangkat: 'Pengatur/IIc',
      jabatan: 'Pelaksana',
      seksi: 'Subbagian Umum dan Kepatuhan Internal',
      unitKerja: 'KPP Pratama Jakarta Tanah Abang Satu'
    });
    showToast(`Pegawai "${created.nama}" berhasil ditambahkan.`);
  };

  const handleQuickAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmployee.nama.trim() || !newEmployee.nip.trim()) return;
    const created = {
      ...newEmployee,
      id: `emp-${Date.now()}`
    };
    setEmployees((prev) => [...prev, created]);
    setFormData((prev) => ({
      ...prev,
      selectedParticipantIds: [...prev.selectedParticipantIds, created.id]
    }));
    setNewEmployee({
      nama: '',
      nip: '',
      pangkat: 'Pengatur/IIc',
      jabatan: 'Pelaksana',
      seksi: 'Subbagian Umum dan Kepatuhan Internal',
      unitKerja: 'KPP Pratama Jakarta Tanah Abang Satu'
    });
    setShowQuickAddModal(false);
    showToast(`"${created.nama}" ditambahkan ke Master & dipilih sebagai peserta.`);
  };

  const handleSaveEditEmployee = () => {
    if (!editingEmployee || !editingEmployee.nama.trim()) return;
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === editingEmployee.id ? editingEmployee : emp))
    );
    setEditingEmployee(null);
    showToast('Data pegawai berhasil diperbarui.');
  };

  const handleDeleteEmployee = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    setFormData((prev) => ({
      ...prev,
      selectedParticipantIds: prev.selectedParticipantIds.filter((pid) => pid !== id)
    }));
    showToast('Data pegawai dihapus.');
  };

  const handleAddOfficial = (e) => {
    e.preventDefault();
    if (!newOfficial.nama.trim() || !newOfficial.jabatan.trim()) return;
    const created = {
      ...newOfficial,
      id: `off-${Date.now()}`
    };
    setOfficials((prev) => [...prev, created]);
    setNewOfficial({
      nama: '',
      nip: '',
      jabatan: '',
      peran: 'ATSUNG'
    });
    showToast(`Pejabat "${created.nama}" berhasil ditambahkan.`);
  };

  const handleDeleteOfficial = (id) => {
    setOfficials((prev) => prev.filter((o) => o.id !== id));
    showToast('Data pejabat dihapus.');
  };

  const handleExportMasterJSON = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      unit: 'KPP Pratama Jakarta Tanah Abang Satu',
      employees,
      officials
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Master_Data_Perjadin_KPP_TA1_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('File Master Data JSON berhasil diekspor.');
  };

  const handleImportMasterJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed.employees)) setEmployees(parsed.employees);
        if (Array.isArray(parsed.officials)) setOfficials(parsed.officials);
        showToast('Master Data JSON berhasil diimpor!');
      } catch {
        showToast('Format file JSON tidak valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDefaultMaster = () => {
    setEmployees(DEFAULT_EMPLOYEES);
    setOfficials(DEFAULT_OFFICIALS);
    setFormData(DEFAULT_FORM_DATA);
    showToast('Data dikembalikan ke pengaturan awal KPP Tanah Abang Satu.');
  };

  // ============================================================================
  // RENDER UI
  // ============================================================================
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* CSS Khusus Print agar mencetak HANYA kertas dokumen A4 dengan presisi */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-a4-sheet, #printable-a4-sheet * {
            visibility: visible !important;
          }
          #printable-a4-sheet {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 15mm 18mm !important;
            box-shadow: none !important;
            border: none !important;
            background: #FFFFFF !important;
            color: #000000 !important;
            z-index: 99999 !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0F2A4A] text-white border border-[#D4AF37] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER INSTITUSI KEMENKEU / DJP */}
      <header className="bg-[#0F2A4A] text-white shadow-lg border-b-4 border-[#D4AF37] sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg shadow-inner">
              <KemenkeuLogoSVG size={36} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                  Direktorat Jenderal Pajak • Kemenkeu RI
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight leading-tight">
                Generator Dokumen Perjalanan Dinas
              </h1>
              <p className="text-xs text-slate-300">
                KPP Pratama Jakarta Tanah Abang Satu
              </p>
            </div>
          </div>

          {/* NAVIGASI TAB UTAMA & TOMBOL DEPLOY VERCEL */}
          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex bg-[#091b30] p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveMainTab('generator')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeMainTab === 'generator'
                    ? 'bg-[#D4AF37] text-[#0F2A4A] font-bold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Buat Dokumen</span>
              </button>
              <button
                onClick={() => setActiveMainTab('master')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeMainTab === 'master'
                    ? 'bg-[#D4AF37] text-[#0F2A4A] font-bold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Master Data Pegawai & Pejabat</span>
              </button>
            </nav>

            <button
              onClick={() => setShowDeployModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-medium transition-colors"
              title="Panduan Deploy Next.js ke Vercel"
            >
              <Rocket className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Deploy Vercel</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================
          TAB 1: GENERATOR DOKUMEN (FORM INPUT + LIVE PREVIEW A4)
      ======================================================================== */}
      {activeMainTab === 'generator' && (
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* KOLOM KIRI: FORMULIR INPUT DATA PERJADIN (5 KOLOM PADA DESKTOP) */}
          <div className="xl:col-span-5 space-y-5">
            {/* BAGIAN A: DATA SURAT TUGAS & KEGIATAN */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-[#0F2A4A] px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <h2 className="font-semibold text-sm">
                    A. Data Surat Tugas & Kegiatan
                  </h2>
                </div>
                <span className="text-[11px] bg-white/10 text-[#D4AF37] px-2.5 py-0.5 rounded-full font-medium">
                  Otomatis ke 3 Dokumen
                </span>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor ST / SIK / Surat Penugasan
                  </label>
                  <input
                    type="text"
                    value={formData.nomorST}
                    onChange={(e) =>
                      setFormData({ ...formData, nomorST: e.target.value })
                    }
                    placeholder="Contoh: ST-297/KPP.0610/2026"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2A4A] focus:border-[#0F2A4A] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Surat Tugas
                    </label>
                    <input
                      type="date"
                      value={formData.tanggalST}
                      onChange={(e) =>
                        setFormData({ ...formData, tanggalST: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2A4A] outline-none"
                    />
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Output: {formatTanggalIndo(formData.tanggalST)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Pelaksanaan / Kunjungan
                    </label>
                    <input
                      type="date"
                      value={formData.tanggalKegiatan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tanggalKegiatan: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2A4A] outline-none"
                    />
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Output: {formatTanggalIndo(formData.tanggalKegiatan)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tujuan Kunjungan / Uraian Perjalanan Dinas & Lokasi
                  </label>
                  <textarea
                    rows={3}
                    value={formData.tujuanKunjungan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tujuanKunjungan: e.target.value
                      })
                    }
                    placeholder="Uraian kegiatan dan alamat tujuan..."
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2A4A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rencana Tindak Lanjut (Untuk Tabel Laporan Kegiatan)
                  </label>
                  <input
                    type="text"
                    value={formData.rencanaTindakLanjut}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rencanaTindakLanjut: e.target.value
                      })
                    }
                    placeholder="-"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2A4A] outline-none"
                  />
                </div>

                {/* Lokasi Khusus Surat Geotagging */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F2A4A]">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Rute Lokasi (Surat Keterangan Geotagging)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Kota Keberangkatan
                      </label>
                      <input
                        type="text"
                        value={formData.kotaKeberangkatan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            kotaKeberangkatan: e.target.value
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Kota Tujuan
                      </label>
                      <input
                        type="text"
                        value={formData.kotaTujuan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            kotaTujuan: e.target.value
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Kota Kepulangan
                      </label>
                      <input
                        type="text"
                        value={formData.kotaKepulangan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            kotaKepulangan: e.target.value
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Tanggal & Tempat Penandatanganan */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal TTD
                    </label>
                    <input
                      type="date"
                      value={formData.tanggalTTD}
                      onChange={(e) =>
                        setFormData({ ...formData, tanggalTTD: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tempat TTD (Laporan/SPD)
                    </label>
                    <input
                      type="text"
                      value={formData.tempatTTDLaporan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tempatTTDLaporan: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tempat TTD (Geotag)
                    </label>
                    <input
                      type="text"
                      value={formData.tempatTTDGeotag}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tempatTTDGeotag: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* BAGIAN B: PILIH PELAKSANA KEGIATAN (MULTI-SELECT + REORDER) */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-[#0F2A4A] px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  <h2 className="font-semibold text-sm">
                    B. Pelaksana Kegiatan ({selectedParticipants.length} Dipilih)
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(true)}
                  className="flex items-center gap-1 text-xs bg-[#D4AF37] text-[#0F2A4A] font-bold px-2.5 py-1 rounded-lg hover:brightness-105 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Manual</span>
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Daftar Checkbox Master Pegawai */}
                <div>
                  <p className="text-xs text-slate-500 mb-2">
                    Centang pegawai yang melaksanakan tugas (dapat lebih dari 1):
                  </p>
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {employees.map((emp) => {
                      const isChecked = formData.selectedParticipantIds.includes(
                        emp.id
                      );
                      return (
                        <label
                          key={emp.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-blue-50/70 border-[#0F2A4A] shadow-xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleParticipant(emp.id)}
                              className="w-4 h-4 accent-[#0F2A4A] rounded"
                            />
                            <div>
                              <div className="text-xs font-bold text-slate-800">
                                {emp.nama}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                NIP {emp.nip} • {emp.jabatan} ({emp.pangkat})
                              </div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Urutan Peserta pada Laporan Kegiatan */}
                {selectedParticipants.length > 0 && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-bold text-slate-600 mb-2">
                      Urutan Peserta di Laporan Kegiatan:
                    </div>
                    <div className="space-y-1.5">
                      {selectedParticipants.map((p, idx) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                        >
                          <span className="font-medium text-slate-800">
                            <strong className="text-[#0F2A4A]">
                              Peserta {idx + 1}:
                            </strong>{' '}
                            {p.nama}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveParticipant(idx, -1)}
                              className="p-1 rounded hover:bg-slate-100 disabled:opacity-30"
                              title="Geser Naik"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === selectedParticipants.length - 1}
                              onClick={() => moveParticipant(idx, 1)}
                              className="p-1 rounded hover:bg-slate-100 disabled:opacity-30"
                              title="Geser Turun"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* BAGIAN C: PEJABAT PENANDATANGAN */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-[#0F2A4A] px-5 py-3.5 flex items-center gap-2 text-white">
                <Building2 className="w-4 h-4 text-[#D4AF37]" />
                <h2 className="font-semibold text-sm">
                  C. Pejabat Penandatangan
                </h2>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kepala Seksi / Atasan Langsung
                  </label>
                  <select
                    value={formData.atsungId}
                    onChange={(e) =>
                      setFormData({ ...formData, atsungId: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#0F2A4A] outline-none"
                  >
                    {officials
                      .filter((o) => o.peran === 'ATSUNG')
                      .map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.nama} ({o.jabatan})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pejabat Pembuat Komitmen (PPK)
                  </label>
                  <select
                    value={formData.ppkId}
                    onChange={(e) =>
                      setFormData({ ...formData, ppkId: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#0F2A4A] outline-none"
                  >
                    {officials
                      .filter((o) => o.peran === 'PPK')
                      .map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.nama} ({o.jabatan})
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </section>
          </div>

          {/* KOLOM KANAN: LIVE PREVIEW KERTAS A4 & TOMBOL UNDUH (7 KOLOM PADA DESKTOP) */}
          <div className="xl:col-span-7 space-y-4">
            {/* TOOLBAR AKSI DOKUMEN */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3.5 space-y-3">
              {/* Sub-Tab 3 Jenis Dokumen */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setActiveDocTab('laporan')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    activeDocTab === 'laporan'
                      ? 'bg-[#0F2A4A] text-white border-[#0F2A4A] shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4 text-[#D4AF37]" />
                  <span>1. Laporan Hasil Kegiatan</span>
                </button>

                <button
                  onClick={() => setActiveDocTab('geotag')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    activeDocTab === 'geotag'
                      ? 'bg-[#0F2A4A] text-white border-[#0F2A4A] shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <FileCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>2. Ket. Tidak Geotagging</span>
                </button>

                <button
                  onClick={() => setActiveDocTab('kendaraan')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    activeDocTab === 'kendaraan'
                      ? 'bg-[#0F2A4A] text-white border-[#0F2A4A] shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Car className="w-4 h-4 text-[#D4AF37]" />
                  <span>3. Tanpa Kendaraan Dinas</span>
                </button>
              </div>

              {/* Pemilih Individu (Muncul jika Dokumen 2 atau 3 aktif & peserta > 1) + Tombol Export */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {(activeDocTab === 'geotag' ||
                    activeDocTab === 'kendaraan') && (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                      <span className="text-xs font-semibold text-amber-900">
                        Pegawai:
                      </span>
                      <select
                        value={activeIndividual?.id || ''}
                        onChange={(e) =>
                          setSelectedIndividualId(e.target.value)
                        }
                        className="text-xs font-bold text-[#0F2A4A] bg-transparent outline-none cursor-pointer"
                      >
                        {selectedParticipants.map((p, idx) => (
                          <option key={p.id} value={p.id}>
                            Peserta {idx + 1}: {p.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {activeDocTab === 'laporan' && (
                    <span className="text-xs text-slate-500">
                      Menampilkan gabungan{' '}
                      <strong>{selectedParticipants.length} peserta</strong>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => downloadWordFile(activeDocTab)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh .DOC (Ini)</span>
                  </button>

                  <button
                    onClick={downloadAllDocumentsBatch}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F2A4A] hover:bg-[#173d6b] text-[#D4AF37] border border-[#D4AF37] text-xs font-bold shadow-sm transition"
                    title="Unduh Laporan Kegiatan + Seluruh Surat Pegawai Sekaligus"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      Unduh Semua ({1 + selectedParticipants.length * 2} File)
                    </span>
                  </button>

                  <button
                    onClick={handlePrintActiveDocument}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak / PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CONTAINER PRATINJAU KERTAS A4 */}
            <div className="bg-slate-300/70 p-3 sm:p-6 rounded-2xl border border-slate-300 overflow-x-auto flex justify-center">
              <div
                id="printable-a4-sheet"
                className="bg-white text-black w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-[16mm] shadow-2xl border border-slate-200 font-sans text-[10.5pt] leading-normal"
              >
                {/* ============================================================
                    TEMPLATE 1: LAPORAN HASIL KEGIATAN
                ============================================================ */}
                {activeDocTab === 'laporan' && (
                  <div>
                    <KopSuratKemenkeu />

                    <h2 className="text-center font-bold text-[11.5pt] tracking-wide my-4">
                      LAPORAN HASIL KEGIATAN
                    </h2>

                    <div className="font-bold text-[10.5pt] mb-2">
                      Identitas Pelaksana Kegiatan
                    </div>

                    {selectedParticipants.length === 0 ? (
                      <div className="p-4 border border-dashed border-red-400 text-red-600 text-xs mb-4">
                        Belum ada pegawai dipilih. Silakan centang minimal 1
                        pegawai di panel sebelah kiri.
                      </div>
                    ) : (
                      <div className="space-y-3 mb-4">
                        {selectedParticipants.map((p) => (
                          <table
                            key={p.id}
                            className="w-full text-[10.5pt] border-collapse"
                          >
                            <tbody>
                              <tr>
                                <td className="w-40 py-0.5 align-top">
                                  Nama/NIP
                                </td>
                                <td className="w-4 py-0.5 align-top">:</td>
                                <td className="py-0.5">
                                  {p.nama}/{p.nip}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-0.5 align-top">
                                  Pangkat/Gol.
                                </td>
                                <td className="py-0.5 align-top">:</td>
                                <td className="py-0.5">{p.pangkat}</td>
                              </tr>
                              <tr>
                                <td className="py-0.5 align-top">Jabatan</td>
                                <td className="py-0.5 align-top">:</td>
                                <td className="py-0.5">{p.jabatan}</td>
                              </tr>
                              <tr>
                                <td className="py-0.5 align-top">Seksi</td>
                                <td className="py-0.5 align-top">:</td>
                                <td className="py-0.5">{p.seksi}</td>
                              </tr>
                            </tbody>
                          </table>
                        ))}
                      </div>
                    )}

                    <div className="font-bold text-[10.5pt] mb-2 mt-4">
                      Deskripsi Kegiatan
                    </div>

                    <table className="w-full border-collapse border border-black text-[9.5pt] mb-6">
                      <thead>
                        <tr className="bg-slate-100 font-bold text-center">
                          <th className="border border-black p-1.5 w-10">
                            No.
                          </th>
                          <th className="border border-black p-1.5 w-40">
                            Nomor ST/SIK/Surat Penugasan
                          </th>
                          <th className="border border-black p-1.5 w-28">
                            Tanggal Kunjungan
                          </th>
                          <th className="border border-black p-1.5">
                            Tujuan Kunjungan
                          </th>
                          <th className="border border-black p-1.5 w-28">
                            Rencana Tindak Lanjut
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-black p-2 text-center align-top">
                            1.
                          </td>
                          <td className="border border-black p-2 align-top break-words">
                            {formData.nomorST}
                          </td>
                          <td className="border border-black p-2 text-center align-top">
                            {formatTanggalIndo(formData.tanggalKegiatan)}
                          </td>
                          <td className="border border-black p-2 align-top">
                            {formData.tujuanKunjungan}
                          </td>
                          <td className="border border-black p-2 text-center align-top">
                            {formData.rencanaTindakLanjut || '-'}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* BLOK TANDA TANGAN LAPORAN */}
                    <div className="grid grid-cols-12 gap-4 mt-6 text-[10.5pt]">
                      {/* Kiri: Mengetahui Kepala Seksi */}
                      <div className="col-span-6">
                        <div className="h-5" />
                        <div>Mengetahui</div>
                        <div>Kepala Seksi</div>
                        <div className="h-10" />
                        <div className="text-[8.5pt] text-neutral-700">
                          Ditandatangani secara elektronik
                        </div>
                        <div>{selectedAtsung.nama}</div>
                      </div>

                      {/* Kanan: Daftar Peserta */}
                      <div className="col-span-6">
                        <div>
                          {formData.tempatTTDLaporan},{' '}
                          {formatTanggalIndo(formData.tanggalTTD)}
                        </div>
                        <div className="space-y-4 mt-1">
                          {selectedParticipants.map((p, idx) => (
                            <div key={p.id}>
                              <div>Peserta {idx + 1}</div>
                              <div className="h-9" />
                              <div className="text-[8.5pt] text-neutral-700">
                                Ditandatangani secara elektronik
                              </div>
                              <div>{p.nama}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ============================================================
                    TEMPLATE 2: SURAT KETERANGAN TIDAK MELAKUKAN GEOTAGGING
                ============================================================ */}
                {activeDocTab === 'geotag' && (
                  <div>
                    <KopSuratKemenkeu />

                    <h2 className="text-center font-bold text-[11.5pt] leading-snug my-5">
                      SURAT KETERANGAN KEHADIRAN
                      <br />
                      DAN PELAKSANAAN TUGAS PERJALANAN DINAS
                    </h2>

                    <p className="mb-2">Yang bertanda tangan di bawah ini:</p>

                    <table className="w-full text-[10.5pt] border-collapse mb-4">
                      <tbody>
                        <tr>
                          <td className="w-44 py-0.5">Nama</td>
                          <td className="w-4 py-0.5">:</td>
                          <td className="py-0.5">{activeIndividual.nama}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5">NIP</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5">{activeIndividual.nip}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5">Pangkat/Golongan</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5">{activeIndividual.pangkat}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5">Unit Kerja</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5">
                            {activeIndividual.unitKerja ||
                              'KPP Pratama Jakarta Tanah Abang Satu'}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <p className="mb-2">
                      yang melakukan perjalanan dinas berikut:
                    </p>

                    <table className="w-full text-[10.5pt] border-collapse mb-5">
                      <tbody>
                        <tr>
                          <td className="w-44 py-0.5">Nomor Surat Tugas</td>
                          <td className="w-4 py-0.5">:</td>
                          <td className="py-0.5">{formData.nomorST}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5">Tanggal Surat Tugas</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5">
                            {formatTanggalIndo(formData.tanggalST)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-0.5">Tanggal kegiatan</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5">
                            {formatTanggalIndo(formData.tanggalKegiatan)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-0.5">Kota Keberangkatan</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5">
                            {formData.kotaKeberangkatan}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-0.5">Kota Tujuan</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5">{formData.kotaTujuan}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5">Kota Kepulangan</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5">{formData.kotaKepulangan}</td>
                        </tr>
                      </tbody>
                    </table>

                    <p className="text-justify leading-relaxed mb-3">
                      telah hadir dan melaksanakan tugas perjalanan dinas di
                      lokasi sebagaimana tersebut di atas dan tidak dapat
                      melakukan pemindaian posisi berdasarkan koordinat
                      (geotagging) karena tidak sengaja tidak melaksanakan
                      geotagging sebagaimana ketentuan yang berlaku.
                    </p>

                    <p className="mb-7">
                      Demikian pernyataan ini dibuat untuk dapat dipergunakan
                      sebagaimana mestinya.
                    </p>

                    {/* BLOK TANDA TANGAN GEOTAGGING */}
                    <div className="grid grid-cols-12 gap-4 text-[10.5pt]">
                      <div className="col-span-7">
                        <div>Mengetahui,</div>
                        <div>{selectedAtsung.jabatan},</div>
                        <div className="h-11" />
                        <div className="text-[8.5pt] text-neutral-700">
                          Ditandatangani secara elektronik
                        </div>
                        <div>{selectedAtsung.nama}</div>
                      </div>

                      <div className="col-span-5">
                        <div>
                          {formData.tempatTTDGeotag},{' '}
                          {formatTanggalIndo(formData.tanggalTTD)}
                        </div>
                        <div>Pembuat Pernyataan</div>
                        <div className="h-11" />
                        <div className="text-[8.5pt] text-neutral-700">
                          Ditandatangani secara elektronik
                        </div>
                        <div>{activeIndividual.nama}</div>
                      </div>
                    </div>

                    {/* PPK DI TENGAH BAWAH */}
                    <div className="mt-8 pl-28 text-[10.5pt]">
                      <div>Menyetujui</div>
                      <div>Pejabat Pembuat Komitmen,</div>
                      <div className="h-11" />
                      <div className="text-[8.5pt] text-neutral-700">
                        Ditandatangani secara elektronik
                      </div>
                      <div>{selectedPPK.nama}</div>
                    </div>
                  </div>
                )}

                {/* ============================================================
                    TEMPLATE 3: SURAT PERNYATAAN TIDAK MENGGUNAKAN KENDARAAN DINAS
                ============================================================ */}
                {activeDocTab === 'kendaraan' && (
                  <div className="pt-4">
                    <h2 className="text-center font-bold text-[12pt] leading-snug mb-8">
                      SURAT PERNYATAAN
                      <br />
                      TIDAK MENGGUNAKAN KENDARAAN DINAS
                    </h2>

                    <p className="mb-3 text-[11pt]">
                      Yang bertanda tangan di bawah ini
                    </p>

                    <table className="w-full text-[11pt] border-collapse mb-5 ml-4">
                      <tbody>
                        <tr>
                          <td className="w-40 py-1">Nama</td>
                          <td className="w-4 py-1">:</td>
                          <td className="py-1">{activeIndividual.nama}</td>
                        </tr>
                        <tr>
                          <td className="py-1">NIP</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{activeIndividual.nip}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Pangkat/Gol.</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{activeIndividual.pangkat}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Kantor</td>
                          <td className="py-1">:</td>
                          <td className="py-1">
                            {activeIndividual.unitKerja ||
                              'KPP Pratama Jakarta Tanah Abang Satu'}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <p className="text-justify leading-relaxed text-[11pt] mb-4">
                      menerangkan bahwa dalam rangka melaksanakan perjalanan
                      dinas {formData.tujuanKunjungan}, sesuai dengan Surat
                      Tugas Nomor {formData.nomorST}, tanggal{' '}
                      {formatTanggalIndo(formData.tanggalST)} saya benar-benar
                      tidak menggunakan kendaraan dinas.
                    </p>

                    <p className="text-justify leading-relaxed text-[11pt] mb-10">
                      Demikian pernyataan ini kami buat dengan
                      sebenar-benarnya untuk dipergunakan sebagaimana mestinya.
                      Apabila terdapat kekeliruan dalam pertanggungjawaban SPD
                      dan mengakibatkan kerugian negara, saya bersedia
                      menyetorkan kerugian tersebut ke Kas Negara.
                    </p>

                    {/* BLOK TANDA TANGAN KENDARAAN DINAS */}
                    <div className="grid grid-cols-12 gap-4 text-[10.5pt]">
                      <div className="col-span-6">
                        <div>Mengetahui/Menyetujui</div>
                        <div>Pejabat Pembuat Komitmen</div>
                        <div className="h-14" />
                        <div className="text-[8.5pt] text-neutral-700">
                          Ditandatangani secara elektronik
                        </div>
                        <div>{selectedPPK.nama}</div>
                      </div>

                      <div className="col-span-6">
                        <div>
                          {formData.tempatTTDLaporan},{' '}
                          {formatTanggalIndo(formData.tanggalTTD)}
                        </div>
                        <div>Pegawai Negeri yang melakukan</div>
                        <div>Perjalanan Dinas,</div>
                        <div className="h-9" />
                        <div className="text-[8.5pt] text-neutral-700">
                          Ditandatangani secara elektronik
                        </div>
                        <div>{activeIndividual.nama}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================
          TAB 2: MASTER DATA PEGAWAI & PEJABAT (LOCALSTORAGE + JSON EXPORT/IMPORT)
      ======================================================================== */}
      {activeMainTab === 'master' && (
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* BAR AKSI BACKUP / RESTORE JSON */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#0F2A4A]">
                Database Lokal Pegawai & Pejabat Penandatangan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Data tersimpan otomatis di browser Anda. Ekspor ke file JSON
                untuk dibagikan ke rekan satu subbagian/seksi.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportMasterJSON}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F2A4A] text-white text-xs font-semibold hover:bg-[#183d69] transition"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Export JSON</span>
              </button>

              <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-[#0F2A4A]" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportMasterJSON}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleResetDefaultMaster}
                className="px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 transition"
              >
                Reset Default
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* KELOLA DAFTAR PEGAWAI (7 KOLOM) */}
            <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-[#0F2A4A] px-5 py-3.5 text-white flex items-center justify-between">
                <span className="font-semibold text-sm">
                  Daftar Pegawai ({employees.length})
                </span>
              </div>

              <div className="p-5 space-y-5">
                {/* Form Tambah Pegawai Baru */}
                <form
                  onSubmit={handleAddEmployee}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"
                >
                  <div className="text-xs font-bold text-[#0F2A4A]">
                    + Tambah Pegawai Baru
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap (tanpa/dengan gelar)"
                      value={newEmployee.nama}
                      onChange={(e) =>
                        setNewEmployee({ ...newEmployee, nama: e.target.value })
                      }
                      className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="NIP (18 digit)"
                      value={newEmployee.nip}
                      onChange={(e) =>
                        setNewEmployee({ ...newEmployee, nip: e.target.value })
                      }
                      className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Pangkat/Gol. (Contoh: Pengatur/IIc)"
                      value={newEmployee.pangkat}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          pangkat: e.target.value
                        })
                      }
                      className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Jabatan (Contoh: Pelaksana)"
                      value={newEmployee.jabatan}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          jabatan: e.target.value
                        })
                      }
                      className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Seksi / Subbagian"
                      value={newEmployee.seksi}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          seksi: e.target.value
                        })
                      }
                      className="sm:col-span-2 px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F2A4A] text-white text-xs font-bold hover:bg-[#173d6b] transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Simpan Pegawai</span>
                  </button>
                </form>

                {/* Tabel Daftar Pegawai */}
                <div className="space-y-2.5">
                  {employees.map((emp) => (
                    <div
                      key={emp.id}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white"
                    >
                      {editingEmployee?.id === emp.id ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={editingEmployee.nama}
                              onChange={(e) =>
                                setEditingEmployee({
                                  ...editingEmployee,
                                  nama: e.target.value
                                })
                              }
                              className="px-2.5 py-1.5 text-xs border rounded-lg"
                            />
                            <input
                              type="text"
                              value={editingEmployee.nip}
                              onChange={(e) =>
                                setEditingEmployee({
                                  ...editingEmployee,
                                  nip: e.target.value
                                })
                              }
                              className="px-2.5 py-1.5 text-xs border rounded-lg"
                            />
                            <input
                              type="text"
                              value={editingEmployee.pangkat}
                              onChange={(e) =>
                                setEditingEmployee({
                                  ...editingEmployee,
                                  pangkat: e.target.value
                                })
                              }
                              className="px-2.5 py-1.5 text-xs border rounded-lg"
                            />
                            <input
                              type="text"
                              value={editingEmployee.jabatan}
                              onChange={(e) =>
                                setEditingEmployee({
                                  ...editingEmployee,
                                  jabatan: e.target.value
                                })
                              }
                              className="px-2.5 py-1.5 text-xs border rounded-lg"
                            />
                            <input
                              type="text"
                              value={editingEmployee.seksi}
                              onChange={(e) =>
                                setEditingEmployee({
                                  ...editingEmployee,
                                  seksi: e.target.value
                                })
                              }
                              className="sm:col-span-2 px-2.5 py-1.5 text-xs border rounded-lg"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEditEmployee}
                              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                            >
                              <Check className="w-3.5 h-3.5" /> Simpan
                            </button>
                            <button
                              onClick={() => setEditingEmployee(null)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                            >
                              <X className="w-3.5 h-3.5" /> Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-bold text-slate-900">
                              {emp.nama}
                            </div>
                            <div className="text-xs text-slate-600 mt-0.5">
                              NIP: {emp.nip} • {emp.pangkat}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {emp.jabatan} — {emp.seksi}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingEmployee(emp)}
                              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(emp.id)}
                              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* KELOLA DAFTAR PEJABAT PENANDATANGAN (5 KOLOM) */}
            <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-fit">
              <div className="bg-[#0F2A4A] px-5 py-3.5 text-white">
                <span className="font-semibold text-sm">
                  Pejabat Penandatangan (Atsung & PPK)
                </span>
              </div>

              <div className="p-5 space-y-5">
                <form
                  onSubmit={handleAddOfficial}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"
                >
                  <div className="text-xs font-bold text-[#0F2A4A]">
                    + Tambah Pejabat
                  </div>
                  <select
                    value={newOfficial.peran}
                    onChange={(e) =>
                      setNewOfficial({ ...newOfficial, peran: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-semibold"
                  >
                    <option value="ATSUNG">
                      Kepala Seksi / Atasan Langsung
                    </option>
                    <option value="PPK">Pejabat Pembuat Komitmen (PPK)</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Nama Pejabat"
                    value={newOfficial.nama}
                    onChange={(e) =>
                      setNewOfficial({ ...newOfficial, nama: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Jabatan Lengkap (Contoh: Kepala Seksi Pelayanan)"
                    value={newOfficial.jabatan}
                    onChange={(e) =>
                      setNewOfficial({
                        ...newOfficial,
                        jabatan: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F2A4A] text-white text-xs font-bold hover:bg-[#173d6b] transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Simpan Pejabat</span>
                  </button>
                </form>

                <div className="space-y-2.5">
                  {officials.map((off) => (
                    <div
                      key={off.id}
                      className="p-3.5 rounded-xl border border-slate-200 flex items-start justify-between gap-2"
                    >
                      <div>
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${
                            off.peran === 'PPK'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {off.peran === 'PPK'
                            ? 'PPK'
                            : 'Kepala Seksi / Atsung'}
                        </span>
                        <div className="text-sm font-bold text-slate-900">
                          {off.nama}
                        </div>
                        <div className="text-xs text-slate-600">
                          {off.jabatan}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteOfficial(off.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================
          MODAL TAMBAH PEGAWAI MANUAL CEPAT (DARI TAB GENERATOR)
      ======================================================================== */}
      {showQuickAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0F2A4A] px-5 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                Tambah Pelaksana Manual Cepat
              </h3>
              <button
                onClick={() => setShowQuickAddModal(false)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleQuickAddEmployee} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={newEmployee.nama}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">NIP</label>
                <input
                  type="text"
                  required
                  value={newEmployee.nip}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, nip: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Pangkat/Gol.
                  </label>
                  <input
                    type="text"
                    value={newEmployee.pangkat}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        pangkat: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 text-sm border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Jabatan
                  </label>
                  <input
                    type="text"
                    value={newEmployee.jabatan}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        jabatan: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 text-sm border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Seksi / Subbagian
                </label>
                <input
                  type="text"
                  value={newEmployee.seksi}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, seksi: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0F2A4A] text-white hover:bg-[#173d6b]"
                >
                  Simpan & Pilih
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================
          MODAL PANDUAN DEPLOY NEXT.JS KE VERCEL
      ======================================================================== */}
      {showDeployModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0F2A4A] px-5 py-4 text-white flex items-center justify-between border-b-2 border-[#D4AF37]">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-bold text-sm">
                  Panduan Deploy ke Next.js & Vercel
                </h3>
              </div>
              <button
                onClick={() => setShowDeployModal(false)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700 leading-relaxed max-h-[80vh] overflow-y-auto">
              <p>
                Aplikasi ini dirancang <strong>100% Client-Side</strong>{' '}
                sehingga tidak membutuhkan server backend atau database
                berbayar saat di-deploy ke Vercel.
              </p>

              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-[11px] space-y-1.5">
                <div className="text-[#D4AF37]">
                  # 1. Buat proyek Next.js baru (App Router + Tailwind)
                </div>
                <div>npx create-next-app@latest perjadin-kpp-ta1</div>
                <div>cd perjadin-kpp-ta1</div>
                <div>npm install lucide-react</div>
                <div className="text-[#D4AF37] pt-1">
                  # 2. Pindahkan kode komponen ini ke src/app/page.tsx
                </div>
                <div>
                  # Tambahkan &apos;use client&apos;; di baris paling atas
                  page.tsx
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-[#0F2A4A]">
                  Langkah Deploy ke Vercel (Gratis):
                </div>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>
                    Push folder proyek <code>perjadin-kpp-ta1</code> ke akun{' '}
                    <strong>GitHub</strong> Anda.
                  </li>
                  <li>
                    Buka <strong>vercel.com</strong>, login dengan GitHub, lalu
                    klik <strong>Add New → Project</strong>.
                  </li>
                  <li>
                    Pilih repository tersebut dan klik <strong>Deploy</strong>.
                    Dalam ~45 detik aplikasi siap diakses melalui tautan{' '}
                    <code>.vercel.app</code> oleh seluruh pegawai KPP Pratama
                    Jakarta Tanah Abang Satu.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}