/**
 * /admin-katalog — Catalog sync dashboard.
 * Admin can view Gustafta API status, sync cache, and see counts.
 * Cannot edit product/package composition — that lives in Gustafta.
 */

import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import {
  ArrowLeft, Shield, Loader2, AlertCircle, RefreshCw,
  CheckCircle2, Package, Layers, Database, Clock,
} from "lucide-react";
import { gustaftaApi, type CatalogStatus } from "@/lib/gustafta-api";

export default function AdminKatalog() {
  const [passcode, setPasscode] = useState("");
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem("gaia_admin_authed"));
  const [authError, setAuthError] = useState("");

  const [status, setStatus] = useState<CatalogStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMsg, setSyncMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const savedPasscode = authed ? (sessionStorage.getItem("gaia_admin_passcode") ?? "") : "";

  const fetchStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const s = await gustaftaApi.status();
      setStatus(s);
    } catch {
      setStatus(null);
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchStatus();
  }, [authed, fetchStatus]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    sessionStorage.setItem("gaia_admin_authed", "1");
    sessionStorage.setItem("gaia_admin_passcode", passcode);
    setAuthed(true);
  };

  const handleSync = async () => {
    setSyncLoading(true);
    setSyncMsg(null);
    try {
      const res = await gustaftaApi.sync(savedPasscode);
      if (res.success) {
        setSyncMsg({ ok: true, text: "Sync berhasil. Cache dikosongkan dan data diperbarui." });
        await fetchStatus();
      } else {
        setSyncMsg({ ok: false, text: res.error ?? "Sync gagal." });
      }
    } catch {
      setSyncMsg({ ok: false, text: "Tidak dapat terhubung ke server." });
    } finally {
      setSyncLoading(false);
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "Belum pernah";
    return new Date(iso).toLocaleString("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  };

  /* ── Login gate ── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-sm w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Shield size={26} className="text-primary" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-white">Admin Katalog</h1>
            <p className="text-muted-foreground text-sm">Masukkan kode akses untuk melanjutkan.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="Kode akses admin"
              required
              autoFocus
            />
            {authError && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={14} /> {authError}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-md px-4 py-2.5 text-sm transition-colors"
            >
              Masuk
            </button>
          </form>
          <Link href="/" className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft size={14} /> Kembali ke Toko
          </Link>
        </div>
      </div>
    );
  }

  /* ── Admin panel ── */
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin-pesanan" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft size={15} /> Pesanan
          </Link>
          <h1 className="text-lg font-bold text-white">Admin Katalog</h1>
          <span className="text-xs bg-blue-900/30 text-blue-300 border border-blue-700/40 rounded-full px-2 py-0.5">
            Gustafta API
          </span>
        </div>
        <button
          onClick={fetchStatus}
          disabled={statusLoading}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={statusLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">

        {/* API Status */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Database size={15} className="text-primary" />
            Status API Gustafta
          </h2>

          {statusLoading && !status ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
              <Loader2 size={15} className="animate-spin" /> Memuat status...
            </div>
          ) : status ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Configured */}
              <div className="bg-background rounded-lg p-3 border border-border/50 flex items-center gap-3">
                {status.configured
                  ? <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                  : <AlertCircle size={16} className="text-red-400 shrink-0" />}
                <div>
                  <p className="text-xs font-semibold text-white">API URL</p>
                  <p className={`text-xs ${status.configured ? "text-green-400" : "text-red-400"}`}>
                    {status.configured ? "Dikonfigurasi" : "Belum dikonfigurasi — set GUSTAFTA_CATALOG_BASE_URL"}
                  </p>
                </div>
              </div>

              {/* Last sync */}
              <div className="bg-background rounded-lg p-3 border border-border/50 flex items-center gap-3">
                <Clock size={16} className="text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Sync Terakhir</p>
                  <p className="text-xs text-muted-foreground">{formatDate(status.lastSyncAt)}</p>
                </div>
              </div>

              {/* Counts */}
              <div className="bg-background rounded-lg p-3 border border-border/50 flex items-center gap-3">
                <Package size={16} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Jumlah Data</p>
                  <p className="text-xs text-muted-foreground">
                    {status.totalProducts} produk · {status.totalSolutions} solusi · {status.totalPackages} paket
                  </p>
                </div>
              </div>

              {/* Cache */}
              <div className="bg-background rounded-lg p-3 border border-border/50 flex items-center gap-3">
                <Layers size={16} className="text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Cache</p>
                  <p className="text-xs text-muted-foreground">
                    {status.cacheEntries} entri · {status.syncErrorCount} error terakhir
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Gagal memuat status.</p>
          )}
        </div>

        {/* Manual Sync */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <RefreshCw size={15} className="text-primary" />
            Sync Katalog Gustafta
          </h2>
          <p className="text-xs text-muted-foreground">
            Mengosongkan cache dan mengambil ulang data terbaru dari Gustafta API.
            Cache otomatis kedaluwarsa setiap 5 menit.
          </p>

          {syncMsg && (
            <div className={`flex items-center gap-2 text-sm rounded-md px-3 py-2 border ${
              syncMsg.ok
                ? "bg-green-900/20 border-green-800/30 text-green-400"
                : "bg-red-900/20 border-red-800/30 text-red-400"
            }`}>
              {syncMsg.ok ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {syncMsg.text}
            </div>
          )}

          <button
            onClick={handleSync}
            disabled={syncLoading || !status?.configured}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-bold rounded-md px-4 py-2.5 text-sm transition-colors"
          >
            {syncLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            {syncLoading ? "Sedang sync..." : "Sync Sekarang"}
          </button>

          {!status?.configured && (
            <p className="text-xs text-yellow-500/80 flex items-center gap-1">
              <AlertCircle size={12} />
              Set environment variable <code className="font-mono bg-muted px-1 rounded">GUSTAFTA_CATALOG_BASE_URL</code> untuk mengaktifkan sync.
            </p>
          )}
        </div>

        {/* Read-only notice */}
        <div className="bg-blue-950/20 border border-blue-800/20 rounded-xl p-4">
          <p className="text-xs text-blue-300/80">
            <strong className="text-blue-300">Catatan:</strong> Admin GAIA tidak dapat mengubah komposisi produk atau paket.
            Semua konfigurasi katalog dikelola di Gustafta sebagai source of truth.
            GAIA hanya menampilkan dan menjual.
          </p>
        </div>

        {/* Nav shortcuts */}
        <div className="flex flex-wrap gap-3">
          <Link href="/produk" className="text-sm text-primary hover:underline">→ Lihat Katalog Produk</Link>
          <Link href="/solusi" className="text-sm text-primary hover:underline">→ Lihat Solusi</Link>
          <Link href="/admin-pesanan" className="text-sm text-primary hover:underline">→ Admin Pesanan</Link>
        </div>
      </div>
    </div>
  );
}
