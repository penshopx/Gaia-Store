/**
 * Frontend client — calls GAIA's own backend catalog proxy.
 * Never calls Gustafta directly from the browser.
 */

// Uses relative URL — Vite proxies /api to the backend, matching existing AdminPesanan pattern
const API_BASE = "/api/catalog";

async function catalogFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `Catalog error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface GaiaProduct {
  id: string | number;
  name: string;
  description?: string;
  product_type?: string;
  category?: string;
  price?: number | string;
  currency?: string;
  use_case?: string;
  benefit?: string;
  what_you_get?: string;
  delivery_method?: string;
  available?: boolean;
  [key: string]: unknown;
}

export interface GaiaSolution {
  id: string | number;
  name: string;
  family?: string;
  description?: string;
  [key: string]: unknown;
}

export interface GaiaSector {
  id: string | number;
  name: string;
  [key: string]: unknown;
}

export interface GaiaTier {
  id: string | number;
  name: string;
  [key: string]: unknown;
}

export interface GaiaOrderCta {
  type: string;          // "wa_order"
  label: string;         // "Pesan Paket"
  wa_number?: string;
  url: string;           // pre-filled WhatsApp URL from Gustafta
  message?: string;
  note?: string;
}

export interface GaiaPackage {
  id: string | number;
  package_id?: string;
  name: string;
  solution?: string;
  sector?: string;
  tier?: string;
  duration?: string | number;
  price?: number | string;
  currency?: string;
  description?: string;
  problem_solved?: string;
  who_is_it_for?: string;
  benefits?: string[];
  faq?: Array<{ q: string; a: string }>;
  version?: number;
  package_version?: number;
  order_cta?: GaiaOrderCta;  // F1: CTA supplied by Gustafta — use this for "Pesan Paket"
  [key: string]: unknown;
}

export interface CatalogStatus {
  configured: boolean;
  baseUrl: string | null;
  lastSyncAt: string | null;
  cacheEntries: number;
  syncErrorCount: number;
  totalProducts: number;
  totalSolutions: number;
  totalPackages: number;
}

// ── API calls ────────────────────────────────────────────────────────────────

export const gustaftaApi = {
  products: () => catalogFetch<GaiaProduct[]>("/products"),
  product: (id: string | number) => catalogFetch<GaiaProduct>(`/products/${id}`),

  solutions: () => catalogFetch<GaiaSolution[]>("/solutions"),
  solution: (id: string | number) => catalogFetch<GaiaSolution>(`/solutions/${id}`),

  sectors: () => catalogFetch<GaiaSector[]>("/sectors"),
  tiers: () => catalogFetch<GaiaTier[]>("/tiers"),

  packages: () => catalogFetch<GaiaPackage[]>("/packages"),
  package: (id: string | number) => catalogFetch<GaiaPackage>(`/packages/${id}`),
  packageProducts: (id: string | number) => catalogFetch<GaiaProduct[]>(`/packages/${id}/products`),
  packageVersion: (id: string | number) => catalogFetch<{ version: number }>(`/packages/${id}/version`),

  status: () => catalogFetch<CatalogStatus>("/status"),

  sync: (passcode: string) =>
    fetch("/api/catalog/sync", {
      method: "POST",
      headers: { "x-admin-passcode": passcode },
    }).then((r) => r.json()),
};
