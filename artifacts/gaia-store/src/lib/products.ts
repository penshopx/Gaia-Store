export type Product = {
  id: number;
  category: string;
  title: string;
  desc: string;
  price: string;
  icon: string;
  scalev_payment_link?: string;
};

export const productsData: Product[] = [
  {
    id: 1,
    category: "Bimtek & PUB",
    title: "Paket Bimtek Online: SMAP & ISO 9001 (Syarat Grade AAA)",
    desc: "Pelatihan 3 hari + sertifikat. Penuhi aspek Kesehatan Organisasi LKUT.",
    price: "Rp 1.500.000/peserta",
    icon: "GraduationCap",
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
    // No payment link yet — WhatsApp fallback
  },
  {
    id: 3,
    category: "Template",
    title: "Master Template SOP & Manual Mutu ISO 9001 Konstruksi",
    desc: "Dokumen siap pakai standar KAN & audit LPJK. Format Word/Excel editable.",
    price: "Rp 450.000",
    icon: "FileText",
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
    // No payment link yet — WhatsApp fallback
  },
  {
    id: 5,
    category: "Microlearning PKB",
    title: "Akses 1 Tahun: Modul Microlearning PKB (SKK Jenjang 7-9)",
    desc: "Video + quiz untuk mengejar poin PKB perpanjangan SKK Ahli.",
    price: "Rp 299.000/tahun",
    icon: "Video",
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
    // No payment link yet — WhatsApp fallback
  },
];
