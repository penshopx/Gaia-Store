import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";
import CheckoutModal from "@/components/CheckoutModal";

export type Product = {
  id: number;
  category: string;
  title: string;
  desc: string;
  price: string;
  icon: string;
};

const productsData: Product[] = [
  {
    id: 1,
    category: "Bimtek & PUB",
    title: "Paket Bimtek Online: SMAP & ISO 9001 (Syarat Grade AAA)",
    desc: "Pelatihan 3 hari + sertifikat. Penuhi aspek Kesehatan Organisasi LKUT.",
    price: "Rp 1.500.000/peserta",
    icon: "GraduationCap",
  },
  {
    id: 2,
    category: "Bimtek & PUB",
    title: "Bimtek PUB Khusus: Pendongkrak Grade B/C/D ke A",
    desc: "Modul peningkatan kinerja BUJK sesuai Permen PUPR 7/2024: keuangan, organisasi, operasi, SDM, SMAP.",
    price: "Rp 2.000.000/peserta",
    icon: "TrendingUp",
  },
  {
    id: 3,
    category: "Template",
    title: "Master Template SOP & Manual Mutu ISO 9001 Konstruksi",
    desc: "Dokumen siap pakai standar KAN & audit LPJK. Format Word/Excel editable.",
    price: "Rp 450.000",
    icon: "FileText",
  },
  {
    id: 4,
    category: "Template",
    title: "Paket Template LKUT + Checklist Kepatuhan SIJKT",
    desc: "Format isian LKUT lengkap + checklist kepatuhan SBU/SMAP/pengalaman proyek.",
    price: "Rp 350.000",
    icon: "CheckSquare",
  },
  {
    id: 5,
    category: "Microlearning PKB",
    title: "Akses 1 Tahun: Modul Microlearning PKB (SKK Jenjang 7-9)",
    desc: "Video + quiz untuk mengejar poin PKB perpanjangan SKK Ahli.",
    price: "Rp 299.000/tahun",
    icon: "Video",
  },
  {
    id: 6,
    category: "AI Tools",
    title: "LexCom AI: Bedah Kontrak & Generator Surat Sanggah",
    desc: "Deteksi pasal jebakan & buat somasi/sanggah dalam 3 menit.",
    price: "Rp 150.000/dokumen",
    icon: "Cpu",
  },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = productsData.filter((product) => {
    const matchesCategory =
      activeCategory === "Semua" ||
      (activeCategory === "Template SOP & ISO" && product.category === "Template") ||
      product.category === activeCategory;
      
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) || 
      product.desc.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        <Hero 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <ProductGrid 
          products={filteredProducts} 
          onBuy={(product) => setSelectedProduct(product)} 
        />
        
        <TrustBadges />
      </main>

      <Footer />

      <CheckoutModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
}
