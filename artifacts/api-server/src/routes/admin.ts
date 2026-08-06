import { Router, type IRouter } from "express";
import { createClient } from "@supabase/supabase-js";

const router: IRouter = Router();

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  return createClient(url, key);
}

function validatePasscode(req: Parameters<Parameters<typeof router.use>[0]>[0], res: Parameters<Parameters<typeof router.use>[0]>[1]): boolean {
  const provided = req.headers["x-admin-passcode"];
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected || provided !== expected) {
    res.status(401).json({ error: "Kode akses tidak valid" });
    return false;
  }
  return true;
}

const VALID_STATUSES = ["baru", "diproses", "selesai", "dibatalkan"] as const;

// GET /api/admin/pesanan — list all orders newest-first
router.get("/admin/pesanan", async (req, res): Promise<void> => {
  if (!validatePasscode(req, res)) return;

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    req.log.error({ err: error }, "Failed to fetch orders");
    res.status(500).json({ error: "Gagal memuat data pesanan" });
    return;
  }

  res.json(data ?? []);
});

// PATCH /api/admin/pesanan/:id — update order status
router.patch("/admin/pesanan/:id", async (req, res): Promise<void> => {
  if (!validatePasscode(req, res)) return;

  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { status } = req.body as { status?: string };

  if (!status || !(VALID_STATUSES as readonly string[]).includes(status)) {
    res.status(400).json({ error: `Status harus salah satu dari: ${VALID_STATUSES.join(", ")}` });
    return;
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", rawId);

  if (error) {
    req.log.error({ err: error }, "Failed to update order status");
    res.status(500).json({ error: "Gagal memperbarui status pesanan" });
    return;
  }

  res.json({ success: true });
});

export default router;
