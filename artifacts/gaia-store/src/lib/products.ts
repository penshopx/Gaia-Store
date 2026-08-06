export type Product = {
  id: number;
  category: string;
  title: string;
  desc: string;
  features?: string[];
  price: string;
  icon: string;
  type?: string;
  scalev_payment_link?: string;
};

export const productsData: Product[] = [
  // ── Existing products ────────────────────────────────────────────────────
  {
    id: 1,
    category: "Bimtek & PUB",
    title: "Paket Bimtek Online: SMAP & ISO 9001 (Syarat Grade AAA)",
    desc: "Pelatihan HYBRID (Online + Tatap Muka Terbatas) 3 hari. Materi intensif via Zoom + sesi networking offline (opsional). Sertifikat resmi. Memenuhi syarat Aspek Kesehatan Organisasi LKUT untuk Grade AAA.",
    features: [
      "Format Hybrid (Online + Offline Opsional)",
      "3 Hari Pelatihan Intensif via Zoom",
      "Sesi Networking Offline (Opsional)",
      "Sertifikat Resmi",
    ],
    price: "Rp 1.500.000/peserta",
    icon: "GraduationCap",
    type: "training",
    scalev_payment_link:
      "https://bayar.gustafta.my.id/p/paket-bimtek-smap-iso-9001-syarat-grade-aaa",
  },
  {
    id: 2,
    category: "Bimtek & PUB",
    title: "Bimtek PUB Khusus: Pendongkrak Grade B/C/D ke A",
    desc: "Modul peningkatan kinerja BUJK sesuai Permen PUPR 7/2024: keuangan, organisasi, operasi, SDM, SMAP.",
    price: "Rp 2.000.000/peserta",
    icon: "TrendingUp",
    type: "training",
    // Intentional: WhatsApp checkout only — high-touch sales
  },
  {
    id: 3,
    category: "Template",
    title: "Master Template SOP & Manual Mutu ISO 9001 Konstruksi",
    desc: "Dokumen siap pakai standar KAN & audit LPJK. Format Word/Excel editable.",
    price: "Rp 450.000",
    icon: "FileText",
    type: "digital",
    scalev_payment_link:
      "https://bayar.gustafta.my.id/p/template-sop-manual-mutu-iso-9001-konstruksi",
  },
  {
    id: 4,
    category: "Template",
    title: "Paket Template LKUT + Checklist Kepatuhan SIJKT",
    desc: "Format isian LKUT lengkap + checklist kepatuhan SBU/SMAP/pengalaman proyek.",
    price: "Rp 350.000",
    icon: "CheckSquare",
    type: "digital",
    scalev_payment_link: "https://bayar.gustafta.my.id/p/paket-template-lkut-checklist-sijkt",
  },
  {
    id: 5,
    category: "Microlearning PKB",
    title: "Akses 1 Tahun: Modul Microlearning PKB (SKK Jenjang 7-9)",
    desc: "Video + quiz untuk mengejar poin PKB perpanjangan SKK Ahli.",
    price: "Rp 299.000/tahun",
    icon: "Video",
    type: "training",
    scalev_payment_link:
      "https://bayar.gustafta.my.id/p/microlearning-pkb-pub-akses-1-bulan-skk-jenjang-7-",
  },
  {
    id: 6,
    category: "AI Tools",
    title: "LexCom AI: Bedah Kontrak & Generator Surat Sanggah",
    desc: "Deteksi pasal jebakan & buat somasi/sanggah dalam 3 menit.",
    price: "Rp 150.000/dokumen",
    icon: "Cpu",
    type: "digital",
    scalev_payment_link: "https://bayar.gustafta.my.id/p/lexcom-ai-bedah-kontrak",
  },

  // ── New products ─────────────────────────────────────────────────────────
  {
    id: 7,
    category: "Tender & Legal",
    title: "Bedah Dokumen AI (Semua Jenis Incl. Kontrak)",
    desc: "Analisa mendalam dokumen tender, kontrak, addendum, dan persyaratan lelang menggunakan AI. Temukan risiko, celah klausul, dan rekomendasi respons dalam hitungan menit.",
    price: "Rp 250.000",
    icon: "Brain",
    type: "digital",
    scalev_payment_link:
      "https://bayar.gustafta.my.id/p/bedah-dokumen-ai-semua-jenis-incl-kontrak",
  },
  {
    id: 8,
    category: "LKUT & SIJKT",
    title: "Ebook Panduan Praktis LKUT 2026",
    desc: "Panduan lengkap pengisian LKUT 2026 sesuai regulasi terbaru LPJK. Dilengkapi contoh isian, checklist per aspek, dan tips menaikkan grade secara legal.",
    price: "Rp 150.000",
    icon: "BookOpen",
    type: "digital",
    scalev_payment_link:
      "https://bayar.gustafta.my.id/p/ebook-panduan-praktis-lkut-2026",
  },
  {
    id: 9,
    category: "SKK & PKB",
    title: "Bimtek SKK — Modul + AI Tutor",
    desc: "Paket bimtek persiapan SKK: modul materi kompetensi + AI Tutor interaktif untuk latihan soal dan simulasi uji kompetensi. Cocok untuk semua jenjang.",
    price: "Rp 199.000",
    icon: "GraduationCap",
    type: "training",
    scalev_payment_link:
      "https://bayar.gustafta.my.id/p/bimtek-skk-modul-ai-tutor",
  },
  {
    id: 10,
    category: "SKK & PKB",
    title: "Exec. Summary PKB (Siap Perpanjangan SKK)",
    desc: "Dokumen executive summary PKB siap pakai untuk perpanjangan SKK Ahli. Disusun sesuai format LPJK, mencakup rekap kegiatan, poin PKB, dan narasi profesional.",
    price: "Rp 350.000",
    icon: "FileCheck",
    type: "digital",
    scalev_payment_link:
      "https://bayar.gustafta.my.id/p/exec-summary-pkb-siap-perpanjangan-skk",
  },
  {
    id: 11,
    category: "LKUT & SIJKT",
    title: "Template Laporan Keuangan BUJK",
    desc: "Template laporan keuangan BUJK siap isi sesuai standar LKUT: neraca, laba rugi, arus kas, dan catatan laporan. Format Excel editable dengan rumus otomatis.",
    price: "Rp 350.000",
    icon: "BarChart2",
    type: "digital",
    scalev_payment_link:
      "https://bayar.gustafta.my.id/p/template-laporan-keuangan-bujk",
  },
  {
    id: 12,
    category: "Klinik Konstruksi",
    title: "Klinik Konstruksi — Case A (Kepatuhan Bermasalah)",
    desc: "Kasus SBU ditolak, SKK darurat, LKUT Grade C/D, OSS bermasalah, SMAP gagal audit. Diagnosa + intervensi AI MultiClaw di Workroom.",
    features: [
      "Diagnosa Masalah Kepatuhan via AI",
      "Intervensi MultiClaw di Workroom",
      "Cocok: SBU Ditolak, OSS Bermasalah, SMAP Gagal Audit",
      "Laporan Rekomendasi Tertulis",
    ],
    price: "Rp 1.500.000",
    icon: "Stethoscope",
    type: "clinic",
    scalev_payment_link:
      "https://bayar.gustafta.my.id/p/klinik-konstruksi-case-a-kepatuhan-bermasalah",
  },
  {
    id: 13,
    category: "Klinik Konstruksi",
    title: "Klinik Konstruksi — Case B (Tender & Kinerja Proyek)",
    desc: "Kasus gugur tender, NCR, insiden K3, EVM merah, LHP bermasalah, klaim force majeure. Analisa mendalam + recovery plan.",
    features: [
      "Analisa Mendalam Gugur Tender / NCR",
      "Recovery Plan EVM & Kinerja Proyek",
      "Cocok: K3 Insiden, LHP Bermasalah, Force Majeure",
      "Sesi Konsultasi Lanjutan (1×)",
    ],
    price: "Rp 2.500.000",
    icon: "Activity",
    type: "clinic",
    scalev_payment_link:
      "https://bayar.gustafta.my.id/p/klinik-konstruksi-case-b-tender-kinerja-proyek",
  },
  {
    id: 14,
    category: "Klinik Konstruksi",
    title: "Klinik Konstruksi — Case C (Sengketa & Klaim)",
    desc: "Sengketa kontrak, klaim FIDIC, surat sanggah kompleks, somasi subkon, klaim asuransi ditolak. Senjata hukum + teknis untuk melawan.",
    features: [
      "Senjata Hukum + Teknis Sengketa Kontrak",
      "Klaim FIDIC & Surat Sanggah Kompleks",
      "Somasi Subkon & Klaim Asuransi",
      "Pendampingan AI Penuh (Workroom Priority)",
    ],
    price: "Rp 5.000.000",
    icon: "Scale",
    type: "clinic",
    scalev_payment_link:
      "https://bayar.gustafta.my.id/p/klinik-konstruksi-case-c-sengketa-klaim",
  },
  {
    id: 15,
    category: "Storage",
    title: "Storage Add-On 10 GB (3 Bulan)",
    desc: "Tambahan 10 GB Ruang Simpan + 200 AI chat/bulan untuk 3 bulan. Data aktif selama produk berlaku + grace 90 hari.",
    features: [
      "10 GB Ruang Simpan Ekstra",
      "200 AI Chat / Bulan",
      "Aktif 3 Bulan",
      "Grace Period 90 Hari",
    ],
    price: "Rp 99.000",
    icon: "HardDrive",
    type: "addon",
    scalev_payment_link:
      "https://bayar.gustafta.my.id/p/storage-add-on-10-gb-3-bulan-200-chat-bln",
  },
  {
    id: 16,
    category: "Storage",
    title: "Storage Add-On 50 GB (3 Bulan)",
    desc: "Tambahan 50 GB Ruang Simpan + 600 AI chat/bulan untuk 3 bulan. Data aktif selama produk berlaku + grace 90 hari.",
    features: [
      "50 GB Ruang Simpan Ekstra",
      "600 AI Chat / Bulan",
      "Aktif 3 Bulan",
      "Grace Period 90 Hari",
    ],
    price: "Rp 299.000",
    icon: "Database",
    type: "addon",
    scalev_payment_link:
      "https://bayar.gustafta.my.id/p/storage-add-on-50-gb-3-bulan-600-chat-bln",
  },
];
