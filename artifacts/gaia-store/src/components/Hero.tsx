import { Search } from "lucide-react";

interface HeroProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CATEGORIES = [
  "Semua",
  "Bimtek & PUB",
  "Template SOP & ISO",
  "Microlearning PKB",
  "AI Tools"
];

export default function Hero({ activeCategory, setActiveCategory, searchQuery, setSearchQuery }: HeroProps) {
  return (
    <section className="w-full bg-background pt-16 pb-12 md:pt-24 md:pb-16 px-4 flex flex-col items-center border-b border-border">
      <div className="container max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Supermarket Digital & Edukasi <br className="hidden md:block" />
          <span className="text-primary">Konstruksi Terlengkap</span>
        </h1>
        
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Dongkrak Grade LKUT, amankan poin PKB, dan menangkan tender dengan template, bimtek, dan AI tools standar LPJK & Permen PUPR 7/2024.
        </p>

        <div className="w-full max-w-2xl mx-auto mt-8 relative">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Cari template, bimtek, AI tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3.5 bg-card border border-border rounded-xl text-white placeholder-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm outline-none"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide px-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-transparent text-foreground border-border hover:border-muted-foreground/50 hover:bg-muted/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
