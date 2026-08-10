import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight text-white">DokumenProyek</span>
            <span className="hidden sm:inline-flex items-center rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/30">
              Gaia Store
            </span>
          </a>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Produk Konstruksi</Link>
          <Link href="/produk" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Produk Digital</Link>
          <Link href="/solusi" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Solusi</Link>
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-4">
          <a 
            href="https://dokumenproyek.com" 
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-muted-foreground hover:text-white transition-colors"
          >
            ← Kembali ke Hub
          </a>
          <button className="text-sm font-medium px-4 py-2 rounded-md border border-border bg-background hover:bg-muted hover:text-white transition-colors">
            Masuk
          </button>
          <a 
            href="https://lkut.dokumenproyek.com" 
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            Cek Grade LKUT
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-muted-foreground hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 flex flex-col gap-4 shadow-xl">
          <nav className="flex flex-col gap-3">
            <Link href="/" className="text-sm font-medium text-foreground p-2 rounded hover:bg-muted">Produk Konstruksi</Link>
            <Link href="/produk" className="text-sm font-medium text-foreground p-2 rounded hover:bg-muted">Produk Digital</Link>
            <Link href="/solusi" className="text-sm font-medium text-foreground p-2 rounded hover:bg-muted">Solusi</Link>
          </nav>
          <div className="h-px bg-border w-full" />
          <div className="flex flex-col gap-3 pt-1">
            <a 
              href="https://lkut.dokumenproyek.com" 
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-center"
            >
              Cek Grade LKUT
            </a>
            <button className="text-sm font-medium px-4 py-2.5 rounded-md border border-border bg-transparent text-center">
              Masuk
            </button>
            <a 
              href="https://dokumenproyek.com" 
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-muted-foreground text-center pt-2"
            >
              ← Kembali ke Hub
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
