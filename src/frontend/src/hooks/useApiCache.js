import { useState, useEffect, useCallback, useRef } from 'react';

// In-memory cache store
const cacheStore = new Map();

// Cache configuration
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100;

/**
 * useApiCache - Hook for caching API responses
 *
 * Features:
 * - In-memory caching with TTL
 * - Automatic stale-while-revalidate
 * - Request deduplication
 * - Cache invalidation
 */
export function useApiCache(key, fetchFn, options = {}) {
  const {
    ttl = DEFAULT_TTL,
    staleWhileRevalidate = true,
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pendingRef = useRef(null);

  // Get cached data
  const getCached = useCallback(() => {
    const cached = cacheStore.get(key);
    if (!cached) return null;

    const isExpired = Date.now() > cached.expiresAt;

    if (isExpired && !staleWhileRevalidate) {
      cacheStore.delete(key);
      return null;
    }

    return {
      data: cached.data,
      isStale: isExpired,
    };
  }, [key, staleWhileRevalidate]);

  // Set cache
  const setCache = useCallback((data) => {
    // Enforce max cache size
    if (cacheStore.size >= MAX_CACHE_SIZE) {
      const firstKey = cacheStore.keys().next().value;
      cacheStore.delete(firstKey);
    }

    cacheStore.set(key, {
      data,
      expiresAt: Date.now() + ttl,
      createdAt: Date.now(),
    });
  }, [key, ttl]);

  // Fetch data
  const fetchData = useCallback(async (force = false) => {
    if (!enabled) return;

    // Check cache first
    if (!force) {
      const cached = getCached();
      if (cached && !cached.isStale) {
        setData(cached.data);
        return cached.data;
      }

      // Return stale data immediately while revalidating
      if (cached?.isStale && staleWhileRevalidate) {
        setData(cached.data);
      }
    }

    // Deduplicate concurrent requests
    if (pendingRef.current) {
      return pendingRef.current;
    }

    setLoading(true);
    setError(null);

    try {
      pendingRef.current = fetchFn();
      const result = await pendingRef.current;

      setCache(result);
      setData(result);
      onSuccess?.(result);

      return result;
    } catch (err) {
      setError(err);
      onError?.(err);
      // Don't re-throw - error is stored in state for consumers
      return null;
    } finally {
      setLoading(false);
      pendingRef.current = null;
    }
  }, [enabled, getCached, staleWhileRevalidate, fetchFn, setCache, onSuccess, onError]);

  // Invalidate cache
  const invalidate = useCallback(() => {
    cacheStore.delete(key);
  }, [key]);

  // Refetch
  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, key]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    refetch,
    invalidate,
    isStale: getCached()?.isStale ?? false,
  };
}

/**
 * Manually invalidate cache by key pattern
 */
export function invalidateCache(keyPattern) {
  if (typeof keyPattern === 'string') {
    cacheStore.delete(keyPattern);
  } else if (keyPattern instanceof RegExp) {
    for (const key of cacheStore.keys()) {
      if (keyPattern.test(key)) {
        cacheStore.delete(key);
      }
    }
  }
}

/**
 * Clear all cache
 */
export function clearCache() {
  cacheStore.clear();
}

/**
 * Get cache stats
 */
export function getCacheStats() {
  return {
    size: cacheStore.size,
    keys: Array.from(cacheStore.keys()),
  };
}

export default useApiCache;
