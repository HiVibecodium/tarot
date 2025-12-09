import { renderHook, act, waitFor } from '@testing-library/react';
import { useApiCache, invalidateCache, clearCache, getCacheStats } from '../useApiCache';

describe('useApiCache', () => {
  beforeEach(() => {
    clearCache();
    jest.clearAllMocks();
  });

  it('should fetch data on mount', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ data: 'test' });

    const { result } = renderHook(() =>
      useApiCache('test-key', mockFetch)
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({ data: 'test' });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should return cached data on subsequent calls', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ data: 'cached' });

    // First render
    const { result: result1 } = renderHook(() =>
      useApiCache('cache-key', mockFetch)
    );

    await waitFor(() => {
      expect(result1.current.data).toEqual({ data: 'cached' });
    });

    // Second render with same key
    const { result: result2 } = renderHook(() =>
      useApiCache('cache-key', mockFetch)
    );

    // Should return cached data immediately
    expect(result2.current.data).toEqual({ data: 'cached' });
    // Fetch should only be called once
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch errors', async () => {
    const mockError = new Error('Fetch failed');
    const mockFetch = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useApiCache('error-key', mockFetch)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toBeNull();
  });

  it('should refetch when refetch is called', async () => {
    const mockFetch = jest.fn()
      .mockResolvedValueOnce({ data: 'first' })
      .mockResolvedValueOnce({ data: 'second' });

    const { result } = renderHook(() =>
      useApiCache('refetch-key', mockFetch)
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({ data: 'first' });
    });

    // Call refetch
    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.data).toEqual({ data: 'second' });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should not fetch when enabled is false', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ data: 'test' });

    const { result } = renderHook(() =>
      useApiCache('disabled-key', mockFetch, { enabled: false })
    );

    // Wait a bit to ensure no fetch happens
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should call onSuccess callback', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ data: 'success' });
    const onSuccess = jest.fn();

    renderHook(() =>
      useApiCache('success-key', mockFetch, { onSuccess })
    );

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({ data: 'success' });
    });
  });

  it('should call onError callback', async () => {
    const mockError = new Error('Failed');
    const mockFetch = jest.fn().mockRejectedValue(mockError);
    const onError = jest.fn();

    renderHook(() =>
      useApiCache('error-callback-key', mockFetch, { onError })
    );

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(mockError);
    });
  });

  it('should invalidate cache for specific key', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ data: 'test' });

    const { result } = renderHook(() =>
      useApiCache('invalidate-key', mockFetch)
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({ data: 'test' });
    });

    // Invalidate cache
    act(() => {
      result.current.invalidate();
    });

    // Refetch should happen
    await act(async () => {
      await result.current.refetch();
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('Cache utility functions', () => {
  beforeEach(() => {
    clearCache();
  });

  it('invalidateCache should remove specific key', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ data: 'test' });

    renderHook(() => useApiCache('key1', mockFetch));

    await waitFor(() => {
      expect(getCacheStats().size).toBe(1);
    });

    invalidateCache('key1');

    expect(getCacheStats().size).toBe(0);
  });

  it('invalidateCache should support regex pattern', async () => {
    const mockFetch1 = jest.fn().mockResolvedValue({ data: '1' });
    const mockFetch2 = jest.fn().mockResolvedValue({ data: '2' });
    const mockFetch3 = jest.fn().mockResolvedValue({ data: '3' });

    renderHook(() => useApiCache('user-1', mockFetch1));
    renderHook(() => useApiCache('user-2', mockFetch2));
    renderHook(() => useApiCache('other-3', mockFetch3));

    await waitFor(() => {
      expect(getCacheStats().size).toBe(3);
    });

    // Invalidate all user-* keys
    invalidateCache(/^user-/);

    expect(getCacheStats().size).toBe(1);
    expect(getCacheStats().keys).toContain('other-3');
  });

  it('clearCache should remove all entries', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ data: 'test' });

    renderHook(() => useApiCache('key1', mockFetch));
    renderHook(() => useApiCache('key2', mockFetch));

    await waitFor(() => {
      expect(getCacheStats().size).toBe(2);
    });

    clearCache();

    expect(getCacheStats().size).toBe(0);
  });

  it('getCacheStats should return correct stats', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ data: 'test' });

    renderHook(() => useApiCache('stats-key', mockFetch));

    await waitFor(() => {
      const stats = getCacheStats();
      expect(stats.size).toBe(1);
      expect(stats.keys).toContain('stats-key');
    });
  });
});
