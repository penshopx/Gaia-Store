/**
 * Catalog proxy routes — GAIA reads Gustafta, never writes.
 * All GET /catalog/* endpoints proxy to Gustafta Catalog API with caching.
 * POST /catalog/sync and GET /catalog/status are admin-accessible.
 */

import { Router, type IRouter, type Request, type Response } from "express";
import { gustaftaFetch, clearCache, getCacheStatus } from "../lib/gustafta-client";

const router: IRouter = Router();

function validatePasscode(req: Request, res: Response): boolean {
  const provided = req.headers["x-admin-passcode"];
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected || provided !== expected) {
    res.status(401).json({ error: "Kode akses tidak valid" });
    return false;
  }
  return true;
}

/** Wrap a Gustafta fetch with consistent error handling */
async function proxyFetch<T>(
  res: Response,
  path: string,
): Promise<void> {
  try {
    const data = await gustaftaFetch<T>(path);
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan";
    const isNotConfigured = message.includes("belum dikonfigurasi");
    res.status(isNotConfigured ? 503 : 502).json({
      error: isNotConfigured
        ? "Catalog API belum dikonfigurasi. Hubungi administrator."
        : "Catalog sementara tidak tersedia. Coba lagi nanti.",
      detail: message,
    });
  }
}

// ── Status (public) ─────────────────────────────────────────────────────────

/** GET /api/catalog/status — cache & API health */
router.get("/catalog/status", (_req, res) => {
  res.json(getCacheStatus());
});

// ── Manual sync (admin) ─────────────────────────────────────────────────────

/** POST /api/catalog/sync — flush cache, force re-fetch on next request */
router.post("/catalog/sync", async (req: Request, res: Response): Promise<void> => {
  if (!validatePasscode(req, res)) return;
  clearCache();
  // Eagerly warm up the three main lists
  try {
    await Promise.allSettled([
      gustaftaFetch("/products"),
      gustaftaFetch("/solutions"),
      gustaftaFetch("/packages"),
      gustaftaFetch("/sectors"),
      gustaftaFetch("/tiers"),
    ]);
  } catch {
    // warm-up failures are non-fatal
  }
  res.json({ success: true, status: getCacheStatus() });
});

// ── Product endpoints ────────────────────────────────────────────────────────

router.get("/catalog/products", async (_req, res) =>
  proxyFetch(res, "/products"),
);

router.get("/catalog/products/:id", async (req, res) =>
  proxyFetch(res, `/products/${req.params.id}`),
);

// ── Solution endpoints ───────────────────────────────────────────────────────

router.get("/catalog/solutions", async (_req, res) =>
  proxyFetch(res, "/solutions"),
);

router.get("/catalog/solutions/:id", async (req, res) =>
  proxyFetch(res, `/solutions/${req.params.id}`),
);

// ── Sector & Tier endpoints ──────────────────────────────────────────────────

router.get("/catalog/sectors", async (_req, res) =>
  proxyFetch(res, "/sectors"),
);

router.get("/catalog/tiers", async (_req, res) =>
  proxyFetch(res, "/tiers"),
);

// ── Package endpoints ────────────────────────────────────────────────────────

router.get("/catalog/packages", async (_req, res) =>
  proxyFetch(res, "/packages"),
);

router.get("/catalog/packages/:id", async (req, res) =>
  proxyFetch(res, `/packages/${req.params.id}`),
);

router.get("/catalog/packages/:id/products", async (req, res) =>
  proxyFetch(res, `/packages/${req.params.id}/products`),
);

router.get("/catalog/packages/:id/version", async (req, res) =>
  proxyFetch(res, `/packages/${req.params.id}/version`),
);

export default router;
