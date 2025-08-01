import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheOptions {
  ttl?: number;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
  isLoading?: boolean;
  error?: string;
}

class ReactCache {
  private cache = new Map<string, CacheEntry<any>>();
  private subscribers = new Map<string, Set<() => void>>();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    });
    this.notifySubscribers(key);
  }

  get<T>(key: string): CacheEntry<T> | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() < entry.expiry) {
      return entry;
    }
    if (entry) {
      this.cache.delete(key);
    }
    return null;
  }

  setLoading(key: string, isLoading: boolean): void {
    const entry = this.cache.get(key);
    if (entry) {
      entry.isLoading = isLoading;
      this.notifySubscribers(key);
    }
  }

  setError(key: string, error: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      entry.error = error;
      this.notifySubscribers(key);
    }
  }

  delete(key: string): void {
    this.cache.delete(key);
    this.notifySubscribers(key);
  }

  clear(): void {
    this.cache.clear();
    this.subscribers.forEach(subscribers => {
      subscribers.forEach(callback => callback());
    });
  }

  subscribe(key: string, callback: () => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key)!.add(callback);

    return () => {
      const subscribers = this.subscribers.get(key);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.subscribers.delete(key);
        }
      }
    };
  }

  private notifySubscribers(key: string): void {
    const subscribers = this.subscribers.get(key);
    if (subscribers) {
      subscribers.forEach(callback => callback());
    }
  }

  isStale(key: string, staleTime: number = 30 * 1000): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;
    return Date.now() - entry.timestamp > staleTime;
  }
}

const reactCache = new ReactCache();

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
} {
  const {
    ttl = 5 * 60 * 1000,
    staleTime = 30 * 1000,
    refetchOnWindowFocus = true,
    refetchOnReconnect = true
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (force = false) => {
    const cached = reactCache.get<T>(key);
    
    // Return cached data if it's fresh
    if (cached && !force && !reactCache.isStale(key, staleTime)) {
      setData(cached.data);
      setError(null);
      return;
    }

    // Set loading state
    setIsLoading(true);
    setError(null);
    reactCache.setLoading(key, true);

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      const result = await fetcher();
      
      // Check if request was cancelled
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      // Cache the result
      reactCache.set(key, result, ttl);
      
      setData(result);
      setError(null);
    } catch (err) {
      if (!abortControllerRef.current.signal.aborted) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        reactCache.setError(key, errorMessage);
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setIsLoading(false);
        reactCache.setLoading(key, false);
      }
    }
  }, [key, fetcher, ttl, staleTime]);

  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  const clearCache = useCallback(() => {
    reactCache.delete(key);
    setData(null);
    setError(null);
  }, [key]);

  // Subscribe to cache changes
  useEffect(() => {
    const unsubscribe = reactCache.subscribe(key, () => {
      const cached = reactCache.get<T>(key);
      if (cached) {
        setData(cached.data);
        setError(cached.error || null);
        setIsLoading(cached.isLoading || false);
      }
    });

    return unsubscribe;
  }, [key]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (reactCache.isStale(key, staleTime)) {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [key, staleTime, refetchOnWindowFocus, fetchData]);

  // Refetch on reconnect
  useEffect(() => {
    if (!refetchOnReconnect) return;

    const handleOnline = () => {
      if (reactCache.isStale(key, staleTime)) {
        fetchData();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [key, staleTime, refetchOnReconnect, fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch,
    clearCache
  };
}

// Prefetch hook for critical data
export function usePrefetch<T>(
  keys: string[],
  fetchers: (() => Promise<T>)[],
  options: CacheOptions = {}
) {
  const prefetch = useCallback(async () => {
    await Promise.allSettled(
      keys.map((key, index) => {
        const fetcher = fetchers[index];
        return reactCache.get(key) ? Promise.resolve() : fetcher();
      })
    );
  }, [keys, fetchers]);

  useEffect(() => {
    prefetch();
  }, [prefetch]);

  return { prefetch };
}

// Cache management utilities
export const cacheUtils = {
  clear: () => reactCache.clear(),
  clearPattern: (pattern: string) => {
    // Implementation for clearing by pattern
    const keys = Array.from(reactCache['cache'].keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        reactCache.delete(key);
      }
    });
  },
  getStats: () => {
    const entries = Array.from(reactCache['cache'].entries());
    const now = Date.now();
    const valid = entries.filter(([_, entry]) => now < entry.expiry);
    const expired = entries.filter(([_, entry]) => now >= entry.expiry);
    
    return {
      total: entries.length,
      valid: valid.length,
      expired: expired.length
    };
  }
}; 