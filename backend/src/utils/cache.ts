const memoryCache = new Map<string, { data: string; expiry: number }>();

export const cacheGet = async (key: string): Promise<string | null> => {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) { memoryCache.delete(key); return null; }
  return entry.data;
};

export const cacheSet = async (key: string, data: string, ttlSeconds: number = 3600): Promise<void> => {
  memoryCache.set(key, { data, expiry: Date.now() + ttlSeconds * 1000 });
};

export const cacheDelete = async (key: string): Promise<void> => { memoryCache.delete(key); };

export const getDestinationKey = (slug: string) => `destination:${slug}`;
export const getTrendingDestinationsKey = () => 'trending:destinations';

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryCache) { if (now > entry.expiry) memoryCache.delete(key); }
}, 60000);
