/**
 * /solusi — 7-step Solution Discovery Flow.
 * Customer picks: kebutuhan → sektor → tier → durasi → lihat paket → detail → checkout.
 * All data from Gustafta via GAIA backend proxy.
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowLeft, ArrowRight, ChevronRight, Loader2, AlertCircle,
  CheckCircle2, RotateCcw, Package,
} from "lucide-react";
import {
  gustaftaApi,
  type GaiaSolution, type GaiaSector, type GaiaTier, type GaiaPackage,
} from "@/lib/gustafta-api";

// ── Step definitions ────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Kebutuhan" },
  { id: 2, label: "Sektor" },
  { id: 3, label: "Tier" },
  { id: 4, label: "Durasi" },
  { id: 5, label: "Paket" },
  { id: 6, label: "Detail" },
  { id: 7, label: "Checkout" },
];

function formatPrice(price?: number | string, currency?: string): string {
  if (price == null) return "Hubungi kami";
  const cur = currency ?? "IDR";
  if (typeof price === "number") {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(price);
  }
  return String(price);
}

// ── Sub-components ──────────────────────────────────────────────────────────

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center gap-1 shrink-0">
          <div className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            s.id < current ? "text-primary" : s.id === current ? "text-white" : "text-muted-foreground"
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
              s.id < current
                ? "bg-primary border-primary text-primary-foreground"
                : s.id === current
                ? "border-primary text-primary"
                : "border-border text-muted-foreground"
            }`}>
              {s.id < current ? <CheckCircle2 size={12} /> : s.id}
            </span>
            <span className="hidden sm:block">{s.label}</span>
          </div>
          {i < STEPS.length - 1 && <ChevronRight size={12} className="text-border shrink-0" />}
        </div>
      ))}
    </div>
  );
}

function SelectionCard({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        selected
          ? "border-primary bg-primary/10 ring-1 ring-primary"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={`font-semibold text-sm ${selected ? "text-primary" : "text-white"}`}>{label}</p>
          {description && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>}
        </div>
        {selected && <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />}
      </div>
    </button>
  );
}

function NavButtons({
  step, maxStep, onBack, onNext, nextDisabled, nextLabel,
}: {
  step: number; maxStep: number; onBack: () => void; onNext: () => void;
  nextDisabled?: boolean; nextLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      <button
        onClick={onBack}
        disabled={step === 1}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors disabled:opacity-30"
      >
        <ArrowLeft size={14} /> Kembali
      </button>
      {step < maxStep && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="flex items-center gap-1.5 text-sm font-bold bg-primary hover:bg-primary/90 disabled:opacity-40 text-primary-foreground px-4 py-2 rounded-md transition-colors"
        >
          {nextLabel ?? "Lanjut"} <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}

// ── DURATION options (shown when API doesn't provide them) ──────────────────

const DEFAULT_DURATIONS = ["1 Bulan", "3 Bulan", "6 Bulan", "12 Bulan"];

// ── Main component ──────────────────────────────────────────────────────────

export default function Solusi() {
  const [step, setStep] = useState(1);

  // Data from API
  const [solutions, setSolutions] = useState<GaiaSolution[]>([]);
  const [sectors, setSectors] = useState<GaiaSector[]>([]);
  const [tiers, setTiers] = useState<GaiaTier[]>([]);
  const [packages, setPackages] = useState<GaiaPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selections
  const [selectedSolution, setSelectedSolution] = useState<GaiaSolution | null>(null);
  const [selectedSector, setSelectedSector] = useState<GaiaSector | null>(null);
  const [selectedTier, setSelectedTier] = useState<GaiaTier | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<GaiaPackage | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [sol, sec, tr, pkg] = await Promise.all([
          gustaftaApi.solutions(),
          gustaftaApi.sectors(),
          gustaftaApi.tiers(),
          gustaftaApi.packages(),
        ]);
        setSolutions(sol);
        setSectors(sec);
        setTiers(tr);
        setPackages(pkg);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Catalog tidak tersedia");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const reset = () => {
    setStep(1);
    setSelectedSolution(null);
    setSelectedSector(null);
    setSelectedTier(null);
    setSelectedDuration(null);
    setSelectedPackage(null);
  };

  // Filter packages matching all selections
  const matchingPackages = packages.filter((p) => {
    const matchSol = !selectedSolution ||
      String(p.solution ?? "").toLowerCase() === String(selectedSolution.name ?? "").toLowerCase() ||
      String(p.solution_id ?? "") === String(selectedSolution.id ?? "");
    const matchSec = !selectedSector ||
      String(p.sector ?? "").toLowerCase() === String(selectedSector.name ?? "").toLowerCase() ||
      String(p.sector_id ?? "") === String(selectedSector.id ?? "");
    const matchTier = !selectedTier ||
      String(p.tier ?? "").toLowerCase() === String(selectedTier.name ?? "").toLowerCase() ||
      String(p.tier_id ?? "") === String(selectedTier.id ?? "");
    const matchDur = !selectedDuration ||
      String(p.duration ?? "").toLowerCase().includes(selectedDuration.split(" ")[0].toLowerCase());
    return matchSol && matchSec && matchTier && matchDur;
  });

  // Extract unique durations from packages
  const availableDurations = Array.from(
    new Set(packages.filter((p) => {
      const matchSol = !selectedSolution ||
        String(p.solution ?? "").toLowerCase() === String(selectedSolution.name ?? "").toLowerCase();
      const matchSec = !selectedSector ||
        String(p.sector ?? "").toLowerCase() === String(selectedSector.name ?? "").toLowerCase();
      const matchTier = !selectedTier ||
        String(p.tier ?? "").toLowerCase() === String(selectedTier.name ?? "").toLowerCase();
      return matchSol && matchSec && matchTier;
    }).map((p) => String(p.duration ?? "")).filter(Boolean))
  );

  const durationOptions = availableDurations.length > 0 ? availableDurations : DEFAULT_DURATIONS;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Memuat solusi...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-sm text-center space-y-4">
          <AlertCircle size={40} className="text-red-400 mx-auto" />
          <p className="text-white font-semibold text-sm">Catalog tidak tersedia</p>
          <p className="text-muted-foreground text-xs">{error}</p>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
            <ArrowLeft size={13} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft size={15} /> Beranda
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-bold text-white">Temukan Solusi Anda</h1>
          <button onClick={reset} className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors">
            <RotateCcw size={12} /> Mulai ulang
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Step bar */}
        <StepBar current={step} />

        {/* ── Step 1: Pilih Kebutuhan ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Apa kebutuhan utama Anda?</h2>
              <p className="text-sm text-muted-foreground mt-1">Pilih area yang ingin Anda selesaikan.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {solutions.map((s) => (
                <SelectionCard
                  key={s.id}
                  label={s.name}
                  description={s.description as string | undefined}
                  selected={selectedSolution?.id === s.id}
                  onClick={() => setSelectedSolution(s)}
                />
              ))}
            </div>
            {solutions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Tidak ada solusi tersedia saat ini.
              </p>
            )}
            <NavButtons
              step={step} maxStep={7}
              onBack={() => setStep((s) => s - 1)}
              onNext={() => setStep(2)}
              nextDisabled={!selectedSolution}
            />
          </div>
        )}

        {/* ── Step 2: Pilih Sektor ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Sektor usaha Anda?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Solusi: <span className="text-primary font-semibold">{selectedSolution?.name}</span>
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sectors.map((s) => (
                <SelectionCard
                  key={s.id}
                  label={s.name}
                  selected={selectedSector?.id === s.id}
                  onClick={() => setSelectedSector(s)}
                />
              ))}
            </div>
            <NavButtons
              step={step} maxStep={7}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
              nextDisabled={!selectedSector}
            />
          </div>
        )}

        {/* ── Step 3: Pilih Tier ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Pilih tingkat layanan</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedSolution?.name} · {selectedSector?.name}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tiers.map((t) => (
                <SelectionCard
                  key={t.id}
                  label={t.name}
                  description={t.description as string | undefined}
                  selected={selectedTier?.id === t.id}
                  onClick={() => setSelectedTier(t)}
                />
              ))}
            </div>
            <NavButtons
              step={step} maxStep={7}
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
              nextDisabled={!selectedTier}
            />
          </div>
        )}

        {/* ── Step 4: Pilih Durasi ── */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Berapa lama Anda membutuhkan?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedSolution?.name} · {selectedSector?.name} · {selectedTier?.name}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {durationOptions.map((d) => (
                <SelectionCard
                  key={d}
                  label={d}
                  selected={selectedDuration === d}
                  onClick={() => setSelectedDuration(d)}
                />
              ))}
            </div>
            <NavButtons
              step={step} maxStep={7}
              onBack={() => setStep(3)}
              onNext={() => setStep(5)}
              nextDisabled={!selectedDuration}
            />
          </div>
        )}

        {/* ── Step 5: Lihat Paket ── */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Paket yang sesuai untuk Anda</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedSolution?.name} · {selectedSector?.name} · {selectedTier?.name} · {selectedDuration}
              </p>
            </div>

            {matchingPackages.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Package size={32} className="text-muted-foreground mx-auto" />
                <p className="text-sm text-white font-semibold">Paket belum tersedia</p>
                <p className="text-xs text-muted-foreground">
                  Kombinasi ini belum ada dalam katalog. Coba ubah pilihan Anda atau hubungi kami.
                </p>
                <button
                  onClick={reset}
                  className="text-sm text-primary hover:underline"
                >
                  Mulai ulang pilihan
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {matchingPackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => { setSelectedPackage(pkg); setStep(6); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedPackage?.id === pkg.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-white">{pkg.name}</p>
                        {pkg.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {pkg.description}
                          </p>
                        )}
                        <p className="text-primary font-bold text-sm">
                          {formatPrice(pkg.price, pkg.currency)}
                        </p>
                      </div>
                      <ArrowRight size={16} className="text-primary shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            <NavButtons step={step} maxStep={7} onBack={() => setStep(4)} onNext={() => setStep(6)} nextDisabled={!selectedPackage} />
          </div>
        )}

        {/* ── Step 6: Detail Paket ── */}
        {step === 6 && selectedPackage && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">{selectedPackage.name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedPackage.solution && (
                  <span className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5">
                    {String(selectedPackage.solution)}
                  </span>
                )}
                {selectedPackage.sector && (
                  <span className="text-xs bg-muted text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
                    {String(selectedPackage.sector)}
                  </span>
                )}
                {selectedPackage.tier && (
                  <span className="text-xs bg-muted text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
                    {String(selectedPackage.tier)}
                  </span>
                )}
                {selectedPackage.duration && (
                  <span className="text-xs bg-muted text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
                    {String(selectedPackage.duration)}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
              <p className="text-xs text-muted-foreground">Harga</p>
              <p className="text-2xl font-bold text-primary mt-0.5">
                {formatPrice(selectedPackage.price, selectedPackage.currency)}
              </p>
              {(selectedPackage.package_id || selectedPackage.id) && (selectedPackage.package_version ?? selectedPackage.version) && (
                <p className="text-xs text-muted-foreground mt-1">
                  ID: {String(selectedPackage.package_id ?? selectedPackage.id)} · v{String(selectedPackage.package_version ?? selectedPackage.version)}
                </p>
              )}
            </div>

            {/* Description */}
            {selectedPackage.description && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Deskripsi</p>
                <p className="text-sm text-white leading-relaxed">{String(selectedPackage.description)}</p>
              </div>
            )}

            {/* Problem solved */}
            {selectedPackage.problem_solved && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Masalah yang Diselesaikan</p>
                <p className="text-sm text-white leading-relaxed">{String(selectedPackage.problem_solved)}</p>
              </div>
            )}

            {/* Who is it for */}
            {selectedPackage.who_is_it_for && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Untuk Siapa</p>
                <p className="text-sm text-white leading-relaxed">{String(selectedPackage.who_is_it_for)}</p>
              </div>
            )}

            {/* Benefits */}
            {Array.isArray(selectedPackage.benefits) && selectedPackage.benefits.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Yang Anda Dapatkan</p>
                <ul className="space-y-1.5">
                  {(selectedPackage.benefits as string[]).map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white">
                      <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQ */}
            {Array.isArray(selectedPackage.faq) && selectedPackage.faq.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">FAQ</p>
                {(selectedPackage.faq as Array<{ q: string; a: string }>).map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-sm font-semibold text-white">{item.q}</p>
                    <p className="text-sm text-muted-foreground">{item.a}</p>
                  </div>
                ))}
              </div>
            )}

            <NavButtons step={step} maxStep={7} onBack={() => setStep(5)} onNext={() => setStep(7)} nextLabel="Lanjut ke Checkout" />
          </div>
        )}

        {/* ── Step 7: Checkout ── */}
        {step === 7 && selectedPackage && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Konfirmasi & Checkout</h2>
              <p className="text-sm text-muted-foreground mt-1">Periksa kembali pilihan Anda sebelum melanjutkan.</p>
            </div>

            {/* Summary */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ringkasan Paket</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paket</span>
                  <span className="text-white font-semibold text-right max-w-[60%]">{selectedPackage.name}</span>
                </div>
                {selectedPackage.solution && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Solusi</span>
                    <span className="text-white">{String(selectedPackage.solution)}</span>
                  </div>
                )}
                {selectedPackage.sector && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sektor</span>
                    <span className="text-white">{String(selectedPackage.sector)}</span>
                  </div>
                )}
                {selectedPackage.tier && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tier</span>
                    <span className="text-white">{String(selectedPackage.tier)}</span>
                  </div>
                )}
                {selectedPackage.duration && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durasi</span>
                    <span className="text-white">{String(selectedPackage.duration)}</span>
                  </div>
                )}
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-primary font-bold text-base">{formatPrice(selectedPackage.price, selectedPackage.currency)}</span>
                </div>
              </div>

              {/* Package version — stored at checkout per spec */}
              {(selectedPackage.package_id ?? selectedPackage.id) && (
                <p className="text-xs text-muted-foreground border-t border-border pt-2">
                  Ref: {String(selectedPackage.package_id ?? selectedPackage.id)}
                  {(selectedPackage.package_version ?? selectedPackage.version)
                    ? ` · v${String(selectedPackage.package_version ?? selectedPackage.version)}`
                    : ""}
                </p>
              )}
            </div>

            {/* CTA */}
            <div className="space-y-3">
              <Link
                href="/konfirmasi-pembayaran"
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-5 py-3.5 transition-colors text-sm"
              >
                Lanjutkan ke Konfirmasi Pembayaran
                <ArrowRight size={16} />
              </Link>

              <a
                href={`https://wa.me/6282299417818?text=${encodeURIComponent(
                  `Halo, saya tertarik dengan paket:\n*${selectedPackage.name}*\nSolusi: ${String(selectedPackage.solution ?? "-")}\nSektor: ${String(selectedPackage.sector ?? "-")}\nTier: ${String(selectedPackage.tier ?? "-")}\nDurasi: ${String(selectedPackage.duration ?? selectedDuration ?? "-")}\nHarga: ${formatPrice(selectedPackage.price, selectedPackage.currency)}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-border hover:bg-muted text-white font-semibold rounded-xl px-5 py-3 transition-colors text-sm"
              >
                Tanya via WhatsApp
              </a>

              {/* DP Store CTA */}
              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">
                  Butuh konsultansi manusia?{" "}
                  <a href="https://dokumenproyek.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    Kunjungi DP Store →
                  </a>
                </p>
              </div>
            </div>

            <NavButtons step={step} maxStep={7} onBack={() => setStep(6)} onNext={() => {}} />
          </div>
        )}
      </div>
    </div>
  );
}
