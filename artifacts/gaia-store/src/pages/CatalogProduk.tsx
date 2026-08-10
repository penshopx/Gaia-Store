/**
 * /produk — Gustafta digital product catalog.
 * Reads live from Gustafta via GAIA backend proxy.
 * Existing 42 construction products (/) are NOT affected.
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Search, Loader2, AlertCircle, Package, ExternalLink, RefreshCw } from "lucide-react";
import { gustaftaApi, type GaiaProduct } from "@/lib/gustafta-api";

const CATEGORY_LABELS: Record<string, string> = {
  "AI Specialist": "AI Specialist",
  "AI Workspace": "AI Workspace",
  "Document AI": "Document AI",
  "Digital Tools": "Digital Tools",
  "Mini Apps": "Mini Apps",
  "Generator": "Generator",
  "Ebook": "Ebook",
  "Module": "Module",
  "Template": "Template",
  "Checklist": "Checklist",
  "Business Kit": "Business Kit",
  "E-Course": "E-Course",
};

function formatPrice(price?: number | string, currency?: string): string {
  if (price == null) return "Hubungi kami";
  const cur = currency ?? "IDR";
  if (typeof price === "number") {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(price);
  }
  return String(price);
}

function ProductCard({ product }: { product: GaiaProduct }) {
  const type = product.product_type ?? product.category ?? "Other";
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-primary/40 transition-colors group">
      <div className="flex items-start justify-between gap-2">
        <span className="inline-block text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5">
          {type}
        </span>
        <Package size={16} className="text-muted-foreground/50 shrink-0 mt-0.5" />
      </div>

      <div className="space-y-1.5 flex-1">
        <h3 className="font-bold text-white text-sm leading-snug group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {product.description}
          </p>
        )}
      </div>

      {/* Included in solution note */}
      {product.solution && (
        <p className="text-xs text-muted-foreground/70 italic">
          Termasuk dalam paket solusi
        </p>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-border/50">
        <span className="text-primary font-bold text-sm">
          {formatPrice(product.price, product.currency)}
        </span>
        <Link
          href={`/produk/${product.id}`}
          className="text-xs font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-1"
        >
          Detail <ExternalLink size={11} />
        </Link>
      </div>
    </div>
  );
}

export default function CatalogProduk() {
  const [products, setProducts] = useState<GaiaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("Semua");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await gustaftaApi.products();
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Catalog tidak tersedia");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Derive unique product types from data
  const types = ["Semua", ...Array.from(new Set(products.map((p) => p.product_type ?? p.category ?? "Other")))];

  const filtered = products.filter((p) => {
    const matchType = activeType === "Semua" || (p.product_type ?? p.category ?? "Other") === activeType;
    const matchQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || (p.description ?? "").toLowerCase().includes(query.toLowerCase());
    return matchType && matchQuery;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft size={15} />
            Beranda
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-bold text-white">Produk Digital Gustafta</h1>
          {!loading && !error && (
            <span className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5">
              {filtered.length} produk
            </span>
          )}
          <button onClick={load} className="ml-auto text-muted-foreground hover:text-white transition-colors" title="Refresh">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
          />
        </div>

        {/* Type filter tabs */}
        {!loading && !error && types.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  activeType === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-white"
                }`}
              >
                {CATEGORY_LABELS[t] ?? t}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-24 text-muted-foreground">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Memuat katalog Gustafta...</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="max-w-md mx-auto text-center py-24 space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-900/20 border border-red-800/30 flex items-center justify-center mx-auto">
              <AlertCircle size={22} className="text-red-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Catalog tidak tersedia</p>
              <p className="text-muted-foreground text-xs mt-1">{error}</p>
            </div>
            <button
              onClick={load}
              className="text-sm font-medium px-4 py-2 rounded-md border border-border hover:bg-muted text-white transition-colors"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Products grid */}
        {!loading && !error && (
          filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground text-sm">
              Tidak ada produk yang cocok.
            </div>
          )
        )}

        {/* DP Store cross-sell */}
        <div className="border border-border rounded-xl p-6 bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">Butuh bantuan profesional?</p>
            <p className="text-xs text-muted-foreground mt-0.5">Jasa dokumen, biro jasa, dan konsultansi manusia tersedia di DP Store.</p>
          </div>
          <a
            href="https://dokumenproyek.com"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 text-sm font-medium px-4 py-2 rounded-md border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
          >
            Ke DP Store →
          </a>
        </div>
      </div>
    </div>
  );
}
