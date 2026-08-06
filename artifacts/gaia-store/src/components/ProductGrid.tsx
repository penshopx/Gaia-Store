import type { Product } from "@/lib/products";
import {
  GraduationCap, TrendingUp, FileText, CheckSquare, Video, Cpu,
  ShoppingCart, CheckCircle2, Search, Brain, BookOpen, FileCheck,
  BarChart2, Stethoscope, Activity, Scale, HardDrive, Database,
} from "lucide-react";

interface ProductGridProps {
  products: Product[];
  onBuy: (product: Product) => void;
}

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  TrendingUp,
  FileText,
  CheckSquare,
  Video,
  Cpu,
  Brain,
  BookOpen,
  FileCheck,
  BarChart2,
  Stethoscope,
  Activity,
  Scale,
  HardDrive,
  Database,
};

export default function ProductGrid({ products, onBuy }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <section className="py-20 px-4 container mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Tidak ada produk ditemukan</h3>
        <p className="text-muted-foreground">Coba ubah kata kunci pencarian atau kategori.</p>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 container mx-auto max-w-6xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const Icon = iconMap[product.icon] || FileText;
          const isClinic = product.category === "Klinik Konstruksi";

          return (
            <div
              key={product.id}
              className="flex flex-col bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 group"
            >
              {/* Thumbnail */}
              <div className="h-40 w-full bg-gradient-to-br from-background to-muted/50 flex items-center justify-center border-b border-border relative">
                <Icon className="h-14 w-14 text-muted-foreground/50 group-hover:text-primary/70 transition-colors" />
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* Case-Based badge for clinic products */}
                {isClinic && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wide uppercase bg-primary/15 text-primary border border-primary/30 rounded px-2 py-0.5">
                    Case-Based
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-muted text-muted-foreground">
                    {product.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-tight mb-2 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>

                <p className={`text-sm text-muted-foreground leading-relaxed ${product.features?.length ? "mb-3" : "mb-6 flex-1"}`}>
                  {product.desc}
                </p>

                {product.features && product.features.length > 0 && (
                  <ul className="mb-6 flex-1 space-y-1.5">
                    {product.features.slice(0, 4).map((feat) => (
                      <li key={feat} className="flex items-start gap-1.5">
                        <CheckCircle2 size={13} className="text-primary shrink-0 mt-0.5" />
                        <span className="text-xs text-primary/90 leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto pt-4 border-t border-border flex flex-col gap-4">
                  <div className="text-lg font-extrabold text-primary">
                    {product.price}
                  </div>

                  <button
                    onClick={() => onBuy(product)}
                    className="w-full py-2.5 px-4 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingCart size={16} />
                    Beli Sekarang
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
