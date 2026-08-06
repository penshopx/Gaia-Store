export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border py-8 px-4 flex flex-col items-center justify-center text-center">
      <div className="container mx-auto flex flex-col items-center gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          &copy; 2026 DokumenProyek.com
        </p>
        <p className="text-xs text-muted-foreground/70 flex items-center gap-1.5">
          Powered by <span className="font-semibold text-muted-foreground">Gustafta AI Engine</span>
        </p>
      </div>
    </footer>
  );
}
