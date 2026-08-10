/**
 * /paket/:id — Package detail page.
 * Stores package_id + package_version per checkout spec.
 */

import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import {
  ArrowLeft, Loader2, AlertCircle, CheckCircle2,
  ArrowRight, Package,
} from "lucide-react";
import { gustaftaApi, type GaiaPackage, type GaiaProduct } from "@/lib/gustafta-api";

function formatPrice(price?: number | string, currency?: string): string {
  if (price == null) return "Hubungi kami";
  const cur = currency ?? "IDR";
  if (typeof price === "number") {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(price);
  }
  return String(price);
}

export default function PaketDetail() {
  const { id } = useParams<{ id: string }>();

  const [pkg, setPkg] = useState<GaiaPackage | null>(null);
  const [includedProducts, setIncludedProducts] = useState<GaiaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [pkgData, products] = await Promise.allSettled([
          gustaftaApi.package(id),
          gustaftaApi.packageProducts(id),
        ]);
        if (pkgData.status === "fulfilled") setPkg(pkgData.value);
        else throw pkgData.reason;
        if (products.status === "fulfilled") setIncludedProducts(products.value);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Paket tidak ditemukan");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Memuat paket...</span>
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-sm text-center space-y-4">
          <AlertCircle size={40} className="text-red-400 mx-auto" />
          <p className="text-white font-semibold text-sm">Paket tidak tersedia</p>
          <p className="text-muted-foreground text-xs">{error ?? "Paket tidak ditemukan."}</p>
          <Link href="/solusi" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
            <ArrowLeft size={13} /> Kembali ke Solusi
          </Link>
        </div>
      </div>
    );
  }

  const packageRef = String(pkg.package_id ?? pkg.id ?? id);
  const packageVersion = pkg.package_version ?? pkg.version;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/solusi" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft size={15} /> Solusi
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-bold text-white truncate">{pkg.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-8">

        {/* Hero */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {pkg.solution && (
              <span className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 font-semibold">
                {String(pkg.solution)}
              </span>
            )}
            {pkg.sector && (
              <span className="text-xs bg-muted text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
                {String(pkg.sector)}
              </span>
            )}
            {pkg.tier && (
              <span className="text-xs bg-muted text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
                {String(pkg.tier)}
              </span>
            )}
            {pkg.duration && (
              <span className="text-xs bg-muted text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
                {String(pkg.duration)}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white leading-snug">{pkg.name}</h1>
          {pkg.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">{String(pkg.description)}</p>
          )}
        </div>

        {/* Price */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Harga Paket</p>
            <p className="text-3xl font-bold text-primary">{formatPrice(pkg.price, pkg.currency)}</p>
            {packageVersion && (
              <p className="text-xs text-muted-foreground mt-1">
                {packageRef} · versi {String(packageVersion)}
              </p>
            )}
          </div>
          <Link
            href="/konfirmasi-pembayaran"
            className="shrink-0 flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-4 py-2.5 text-sm transition-colors"
          >
            Beli <ArrowRight size={14} />
          </Link>
        </div>

        {/* Problem solved */}
        {pkg.problem_solved && (
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-white">Masalah yang Diselesaikan</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{String(pkg.problem_solved)}</p>
          </div>
        )}

        {/* Who is it for */}
        {pkg.who_is_it_for && (
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-white">Untuk Siapa</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{String(pkg.who_is_it_for)}</p>
          </div>
        )}

        {/* Benefits */}
        {Array.isArray(pkg.benefits) && pkg.benefits.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white">Yang Anda Dapatkan</h2>
            <ul className="space-y-2">
              {(pkg.benefits as string[]).map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white">
                  <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Included products */}
        {includedProducts.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Package size={14} className="text-primary" />
              Termasuk dalam Paket
            </h2>
            <div className="space-y-2">
              {includedProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-white">{p.name}</p>
                    {p.product_type && (
                      <p className="text-xs text-muted-foreground">{p.product_type}</p>
                    )}
                  </div>
                  <Link href={`/produk/${p.id}`} className="text-xs text-primary hover:underline shrink-0">
                    Detail
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground italic">
              Produk ini juga tersedia secara individual.
            </p>
          </div>
        )}

        {/* FAQ */}
        {Array.isArray(pkg.faq) && pkg.faq.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white">FAQ</h2>
            {(pkg.faq as Array<{ q: string; a: string }>).map((item, i) => (
              <div key={i} className="border-b border-border pb-4 last:border-0 last:pb-0 space-y-1">
                <p className="text-sm font-semibold text-white">{item.q}</p>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        )}

        {/* CTA block */}
        <div className="space-y-3 pt-2">
          <Link
            href="/konfirmasi-pembayaran"
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-5 py-3.5 transition-colors text-sm"
          >
            Lanjutkan ke Pembayaran <ArrowRight size={16} />
          </Link>
          <a
            href={`https://wa.me/6282299417818?text=${encodeURIComponent(`Halo, saya tertarik dengan paket ${pkg.name} (${packageRef}).`)}`}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 border border-border hover:bg-muted text-white font-semibold rounded-xl px-5 py-3 transition-colors text-sm"
          >
            Tanya via WhatsApp
          </a>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Butuh jasa manusia?{" "}
              <a href="https://dokumenproyek.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                DP Store →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
