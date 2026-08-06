import { Router, type IRouter } from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const router: IRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  return createClient(url, key);
}

router.post(
  "/konfirmasi-pesanan",
  upload.single("bukti_bayar"),
  async (req, res): Promise<void> => {
    const { nama_perusahaan, nama_pic, email, whatsapp, produk, catatan } = req.body as Record<string, string>;

    if (!nama_perusahaan || !nama_pic || !email || !whatsapp || !produk) {
      res.status(400).json({ error: "Field wajib: nama_perusahaan, nama_pic, email, whatsapp, produk" });
      return;
    }

    try {
      const supabase = getSupabase();

      // 1. Upload proof file to Supabase Storage
      let bukti_url: string | null = null;
      let bukti_filename: string | null = null;
      if (req.file) {
        const safeName = req.file.originalname.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
        bukti_filename = `${Date.now()}-${safeName}`;
        const filename = bukti_filename;

        const { error: uploadError } = await supabase.storage
          .from("proofs")
          .upload(filename, req.file.buffer, { contentType: req.file.mimetype, upsert: false });

        if (uploadError) {
          req.log.error({ err: uploadError }, "Supabase storage upload failed");
          res.status(500).json({ error: "Gagal mengunggah bukti pembayaran" });
          return;
        }

        const { data: publicData } = supabase.storage.from("proofs").getPublicUrl(filename);
        bukti_url = publicData.publicUrl;
      }

      // 2. Insert order into Supabase table
      const { data: order, error: insertError } = await supabase
        .from("orders")
        .insert({
          nama_perusahaan,
          nama_pic,
          email,
          whatsapp,
          produk,
          catatan: catatan || null,
          bukti_filename,
          bukti_url,
          status: "baru",
        })
        .select()
        .single();

      if (insertError) {
        req.log.error({ err: insertError }, "Supabase insert failed");
        res.status(500).json({ error: "Gagal menyimpan pesanan ke database" });
        return;
      }

      // 3. Send notification email via Resend
      const adminEmail = process.env.ADMIN_EMAIL;
      const resendKey = process.env.RESEND_API_KEY;
      if (adminEmail && resendKey) {
        try {
          const resend = new Resend(resendKey);
          await resend.emails.send({
            from: "DokumenProyek <orders@dokumenproyek.com>",
            to: adminEmail,
            subject: `[Gaia Store] Pesanan Baru: ${produk}`,
            html: `
              <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1e293b">
                <h2 style="color:#0F172A;border-bottom:2px solid #F59E0B;padding-bottom:8px">
                  Pesanan Baru Masuk — Gaia Store
                </h2>
                <table style="width:100%;border-collapse:collapse;margin-top:16px">
                  <tr><td style="padding:6px 0;color:#64748b;width:140px">Produk</td><td style="padding:6px 0;font-weight:600">${produk}</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b">Perusahaan</td><td style="padding:6px 0">${nama_perusahaan}</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b">PIC</td><td style="padding:6px 0">${nama_pic}</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b">Email</td><td style="padding:6px 0">${email}</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b">WhatsApp</td><td style="padding:6px 0">${whatsapp}</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b">Catatan</td><td style="padding:6px 0">${catatan || "-"}</td></tr>
                  ${bukti_url ? `<tr><td style="padding:6px 0;color:#64748b">Bukti Bayar</td><td style="padding:6px 0"><a href="${bukti_url}" style="color:#F59E0B">Lihat file</a></td></tr>` : ""}
                </table>
                <p style="margin-top:24px;font-size:12px;color:#94a3b8">
                  Dikirim otomatis oleh Gaia Store · DokumenProyek.com
                </p>
              </div>
            `,
          });
        } catch (emailErr) {
          req.log.warn({ err: emailErr }, "Resend email failed (non-fatal)");
        }
      }

      res.status(200).json({ success: true, order_id: order?.id ?? null });
    } catch (err) {
      req.log.error({ err }, "Konfirmasi pesanan handler failed");
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  },
);

export default router;
