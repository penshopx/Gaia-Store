import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";
import CheckoutModal from "@/components/CheckoutModal";
import { productsData, type Product } from "@/lib/products";

export type { Product };

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = productsData.filter((product) => {
    const matchesCategory =
      activeCategory === "Semua" ||
      (activeCategory === "Template SOP & ISO" && product.category === "Template") ||
      product.category === activeCategory;

    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
