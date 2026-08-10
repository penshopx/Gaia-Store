/**
 * Gustafta Catalog API client with in-memory cache.
 * Gustafta is SOURCE OF TRUTH — GAIA only reads, never writes.
 */

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, CacheEntry<any>>();
let lastSyncAt: Date | null = null;
let syncErrorCount = 0;
let totalProducts = 0;
let totalSolutions = 0;
let totalPackages = 0;

export function getBaseUrl(): string | null {
  return process.env.GUSTAFTA_CATALOG_BASE_URL?.replace(/\/$/, "") ?? null;
}

function isFresh(entry: CacheEntry<unknown>): boolean {
  return Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}

export function clearCache(): void {
  cache.clear();
}

export function getCacheStatus() {
  return {
    configured: !!getBaseUrl(),
    baseUrl: getBaseUrl() ? "[set]" : null,
    lastSyncAt: lastSyncAt?.toISOString() ?? null,
    cacheEntries: cache.size,
    syncErrorCount,
    totalProducts,
    totalSolutions,
    totalPackages,
  };
}

export async function gustaftaFetch<T>(path: string): Promise<T> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error("GUSTAFTA_CATALOG_BASE_URL belum dikonfigurasi");
  }

  // Return fresh cache
  const cached = cache.get(path);
  if (cached && isFresh(cached)) {
    return cached.data as T;
  }

  const url = `${baseUrl}${path}`;
  let data: T;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(12_000),
    });

    if (!res.ok) {
      throw new Error(`Gustafta API ${res.status}: ${path}`);
    }

    const raw = await res.json();

    // Gustafta wraps list responses: { success, data: [...], meta: {...} }
    // Unwrap so callers always receive the payload directly.
    data = (raw && typeof raw === "object" && "data" in raw ? raw.data : raw) as T;

    cache.set(path, { data, fetchedAt: Date.now() });
    lastSyncAt = new Date();
    syncErrorCount = 0;

    // Track counts for admin status display
    if (path === "/products" && Array.isArray(data)) totalProducts = (data as unknown[]).length;
    if (path === "/solutions" && Array.isArray(data)) totalSolutions = (data as unknown[]).length;
    if (path === "/packages" && Array.isArray(data)) totalPackages = (data as unknown[]).length;

    return data;
  } catch (err) {
    syncErrorCount++;
    // Serve stale cache rather than crashing when API is down
    if (cached) {
      return cached.data as T;
    }
    throw err;
  }
}
