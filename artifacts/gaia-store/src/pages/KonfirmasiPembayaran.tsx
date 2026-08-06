import { useState, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, Upload, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

function useQueryParam(key: string): string {
  const params = new URLSearchParams(window.location.search);
  return params.get(key) ?? "";
}

type FormState = "idle" | "submitting" | "success" | "error";

export default function KonfirmasiPembayaran() {
  const produkDefault = useQueryParam("produk");
  const perusahaanDefault = useQueryParam("perusahaan");
  const picDefault = useQueryParam("pic");
  const waDefault = useQueryParam("wa");

  const [form, setForm] = useState({
    nama_perusahaan: perusahaanDefault,
    nama_pic: picDefault,
    email: "",
    whatsapp: waDefault,
    produk: produkDefault,
    deskripsi_kasus: "",
    catatan: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama_perusahaan || !form.nama_pic || !form.email || !form.whatsapp || !form.produk) {
      setErrorMsg("Mohon lengkapi semua field yang wajib diisi.");
      return;
    }

    setFormState("submitting");
    setErrorMsg("");

    try {
      const data = new FormData();
      data.append("nama_perusahaan", form.nama_perusahaan);
      data.append("nama_pic", form.nama_pic);
      data.append("email", form.email);
      data.append("whatsapp", form.whatsapp);
      data.append("produk", form.produk);
      data.append("deskripsi_kasus", form.deskripsi_kasus);
      data.append("catatan", form.catatan);
      if (file) data.append("bukti_bayar", file);

      const res = await fetch("/api/konfirmasi-pesanan", { method: "POST", body: data });
      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error ?? "Terjadi kesalahan. Silakan coba lagi.");
        setFormState("error");
        return;
      }

      setFormState("success");
    } catch {
      setErrorMsg("Gagal terhubung ke server. Silakan coba lagi.");
      setFormState("error");
    }
  };

  if (formState === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-900/40 border border-green-600/50 flex items-center justify-center">
              <CheckCircle2 size={40} className="text-green-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Konfirmasi Diterima!</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Pesanan Anda telah kami terima. Tim kami akan memverifikasi pembayaran dan menghubungi Anda dalam 1×24 jam kerja.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md px-6 py-2.5 text-sm transition-colors"
          >
            Kembali ke Toko
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav strip */}
      <div className="border-b border-border px-6 py-4 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
          <ArrowLeft size={15} />
          Kembali ke Toko
        </Link>
      </div>

      <div className="max-w-xl mx-auto px-6 py-10">
        <div className="mb-8 space-y-1.5">
          <h1 className="text-2xl font-bold text-white">Konfirmasi Pembayaran</h1>
          <p className="text-muted-foreground text-sm">
            Isi form berikut untuk mengamankan pesanan Anda setelah pembayaran selesai.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Produk */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white block">
              Produk yang Dipesan <span className="text-red-400">*</span>
            </label>
            <input
              name="produk"
              type="text"
              required
              value={form.produk}
              onChange={handleChange}
              className="w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="Nama produk"
            />
          </div>

          {/* Nama Perusahaan */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white block">
              Nama Perusahaan <span className="text-red-400">*</span>
            </label>
            <input
              name="nama_perusahaan"
              type="text"
              required
              value={form.nama_perusahaan}
              onChange={handleChange}
              className="w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="PT. Konstruksi Maju"
            />
          </div>

          {/* Nama PIC */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white block">
              Nama PIC <span className="text-red-400">*</span>
            </label>
            <input
              name="nama_pic"
              type="text"
              required
              value={form.nama_pic}
              onChange={handleChange}
              className="w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="Budi Santoso"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white block">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="budi@perusahaan.co.id"
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white block">
              No WhatsApp <span className="text-red-400">*</span>
            </label>
            <input
              name="whatsapp"
              type="tel"
              required
              value={form.whatsapp}
              onChange={handleChange}
              className="w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="08xx-xxxx-xxxx"
            />
          </div>

          {/* Deskripsi Kasus */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white block">
              Deskripsi Kasus{" "}
              <span className="text-muted-foreground font-normal">(opsional — untuk produk Klinik Konstruksi)</span>
            </label>
            <textarea
              name="deskripsi_kasus"
              rows={4}
              value={form.deskripsi_kasus}
              onChange={handleChange}
              className="w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
              placeholder="Jelaskan situasi/kasus yang ingin dikonsultasikan: latar belakang, masalah utama, dan hasil yang diharapkan..."
            />
          </div>

          {/* Catatan */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white block">Catatan (opsional)</label>
            <textarea
              name="catatan"
              rows={3}
              value={form.catatan}
              onChange={handleChange}
              className="w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
              placeholder="Informasi tambahan untuk tim kami..."
            />
          </div>

          {/* Upload Bukti Bayar */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white block">Upload Bukti Pembayaran</label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? (
                <div className="space-y-1">
                  <CheckCircle2 size={24} className="text-green-400 mx-auto" />
                  <p className="text-sm text-white font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload size={24} className="text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Klik untuk upload bukti transfer / screenshot
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, PDF — maks. 10MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Error message */}
          {(formState === "error" || errorMsg) && (
            <div className="flex items-start gap-2.5 bg-red-950/40 border border-red-700/50 rounded-lg p-3.5 text-sm text-red-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={formState === "submitting"}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground font-bold rounded-md px-4 py-3 text-sm transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
          >
            {formState === "submitting" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Mengirim...
              </>
            ) : (
              "Kirim Konfirmasi Pesanan"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
