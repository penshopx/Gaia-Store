import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ArrowLeft, MessageCircle, ExternalLink, Loader2, AlertCircle, RefreshCw, Shield } from "lucide-react";

type OrderStatus = "baru" | "diproses" | "selesai" | "dibatalkan";

interface Order {
  id: string | number;
  created_at: string;
  nama_perusahaan: string;
  nama_pic: string;
  email: string;
  whatsapp: string;
  produk: string;
  catatan?: string;
  bukti_filename?: string;
  bukti_url?: string;
  status: OrderStatus;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  baru: "Baru",
  diproses: "Diproses",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  baru: "bg-blue-900/40 text-blue-300 border-blue-700/50",
  diproses: "bg-yellow-900/40 text-yellow-300 border-yellow-700/50",
  selesai: "bg-green-900/40 text-green-300 border-green-700/50",
  dibatalkan: "bg-red-900/40 text-red-300 border-red-700/50",
};

export default function AdminPesanan() {
  const [passcode, setPasscode] = useState("");
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem("gaia_admin_authed"));
  const [authError, setAuthError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  const savedPasscode = authed ? sessionStorage.getItem("gaia_admin_passcode") ?? "" : "";

  const fetchOrders = useCallback(async (pc: string) => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch("/api/admin/pesanan", {
        headers: { "x-admin-passcode": pc },
      });
      if (res.status === 401) {
        sessionStorage.removeItem("gaia_admin_authed");
        sessionStorage.removeItem("gaia_admin_passcode");
        setAuthed(false);
        setAuthError("Kode akses tidak valid. Silakan coba lagi.");
        return;
      }
      if (!res.ok) {
        setFetchError("Gagal memuat data pesanan.");
        return;
      }
      const data = await res.json();
      setOrders(data);
    } catch {
      setFetchError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed && savedPasscode) {
      fetchOrders(savedPasscode);
    }
  }, [authed, savedPasscode, fetchOrders]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    sessionStorage.setItem("gaia_admin_authed", "1");
    sessionStorage.setItem("gaia_admin_passcode", passcode);
    setAuthed(true);
    fetchOrders(passcode);
  };

  const handleStatusChange = async (orderId: string | number, newStatus: OrderStatus) => {
    const pc = sessionStorage.getItem("gaia_admin_passcode") ?? "";
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/pesanan/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-passcode": pc },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) return;
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
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
            <h1 className="text-xl font-bold text-white">Admin Pesanan</h1>
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
                <AlertCircle size={14} />
                {authError}
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
            <ArrowLeft size={14} />
            Kembali ke Toko
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
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft size={15} />
            Toko
          </Link>
          <h1 className="text-lg font-bold text-white">Admin Pesanan</h1>
          <span className="text-xs font-medium bg-primary/10 text-primary border border-primary/30 rounded-full px-2 py-0.5">
            {orders.length} pesanan
          </span>
        </div>
        <button
          onClick={() => fetchOrders(sessionStorage.getItem("gaia_admin_passcode") ?? "")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="p-6">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Memuat pesanan...</span>
          </div>
        )}

        {fetchError && (
          <div className="flex items-center gap-2.5 bg-red-950/40 border border-red-700/50 rounded-lg p-4 text-sm text-red-300">
            <AlertCircle size={16} className="shrink-0" />
            {fetchError}
          </div>
        )}

        {!loading && !fetchError && orders.length === 0 && (
          <div className="text-center py-20 text-muted-foreground text-sm">
            Belum ada pesanan masuk.
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-card border border-border rounded-xl p-5 space-y-4"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-white text-sm leading-snug">{order.produk}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                  </div>
                  <span className={`text-xs font-semibold border rounded-full px-2.5 py-0.5 ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs block">Perusahaan</span>
                    <span className="text-white font-medium">{order.nama_perusahaan}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block">PIC</span>
                    <span className="text-white font-medium">{order.nama_pic}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block">Email</span>
                    <span className="text-white">{order.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block">WhatsApp</span>
                    <span className="text-white">{order.whatsapp}</span>
                  </div>
                  {order.catatan && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground text-xs block">Catatan</span>
                      <span className="text-white">{order.catatan}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-border">
                  {/* Status dropdown */}
                  <div className="relative">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="appearance-none bg-background border border-border rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer disabled:opacity-50 pr-7"
                    >
                      {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                    {updatingId === order.id && (
                      <Loader2 size={12} className="animate-spin absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    )}
                  </div>

                  {/* Chat WA */}
                  <a
                    href={`https://wa.me/${order.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Halo ${order.nama_pic}, pesanan Anda untuk "${order.produk}" sedang kami proses.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-green-700 hover:bg-green-600 text-white text-xs font-semibold rounded-md px-3 py-1.5 transition-colors"
                  >
                    <MessageCircle size={13} />
                    Chat WA
                  </a>

                  {/* Bukti bayar */}
                  {order.bukti_url && (
                    <a
                      href={order.bukti_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 border border-border text-muted-foreground hover:text-white text-xs rounded-md px-3 py-1.5 transition-colors"
                    >
                      <ExternalLink size={13} />
                      Bukti Bayar
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
