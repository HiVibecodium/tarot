import { renderHook, act } from '@testing-library/react';
import { useDebounce, useDebouncedCallback, useThrottle } from '../useDebounce';

// Mock timers
jest.useFakeTimers();

describe('useDebounce', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated' });

    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now value should be updated
    expect(result.current).toBe('updated');
  });

  it('should reset timer on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );

    // Rapid changes
    rerender({ value: 'b' });
    act(() => { jest.advanceTimersByTime(100); });

    rerender({ value: 'c' });
    act(() => { jest.advanceTimersByTime(100); });

    rerender({ value: 'd' });
    act(() => { jest.advanceTimersByTime(100); });

    // Still showing initial value
    expect(result.current).toBe('a');

    // Wait for full delay
    act(() => { jest.advanceTimersByTime(300); });

    // Should show final value
    expect(result.current).toBe('d');
  });

  it('should use custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });

    // 300ms - not enough
    act(() => { jest.advanceTimersByTime(300); });
    expect(result.current).toBe('initial');

    // 200ms more - total 500ms
    act(() => { jest.advanceTimersByTime(200); });
    expect(result.current).toBe('updated');
  });
});

describe('useDebouncedCallback', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should debounce callback execution', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    // Call multiple times
    act(() => {
      result.current('arg1');
      result.current('arg2');
      result.current('arg3');
    });

    // Callback should not be called yet
    expect(callback).not.toHaveBeenCalled();

    // Fast forward
    act(() => { jest.advanceTimersByTime(300); });

    // Should be called once with last args
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('arg3');
  });

  it('should pass all arguments to callback', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    act(() => {
      result.current('a', 'b', 'c');
    });

    act(() => { jest.advanceTimersByTime(300); });

    expect(callback).toHaveBeenCalledWith('a', 'b', 'c');
  });

  it('should cleanup timer on unmount', () => {
    const callback = jest.fn();
    const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 300));

    act(() => {
      result.current();
    });

    // Unmount before timer fires
    unmount();

    // Fast forward
    act(() => { jest.advanceTimersByTime(300); });

    // Callback should not be called
    expect(callback).not.toHaveBeenCalled();
  });
});

describe('useThrottle', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useThrottle('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should throttle value updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 300),
      { initialProps: { value: 'a' } }
    );

    // First update should go through immediately (throttle limit passed)
    rerender({ value: 'b' });

    // Fast forward past throttle limit
    act(() => { jest.advanceTimersByTime(300); });

    expect(result.current).toBe('b');
  });

  it('should limit updates within throttle period', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 300),
      { initialProps: { value: 'initial' } }
    );

    // Multiple rapid updates
    rerender({ value: 'update1' });
    act(() => { jest.advanceTimersByTime(50); });

    rerender({ value: 'update2' });
    act(() => { jest.advanceTimersByTime(50); });

    rerender({ value: 'update3' });

    // Wait for throttle period
    act(() => { jest.advanceTimersByTime(300); });

    // Should have final value
    expect(result.current).toBe('update3');
  });
});
