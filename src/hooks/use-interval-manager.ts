import { useEffect, useRef } from "react";
import { intervalManager, IntervalCallback } from "@/utils/interval-manager";

/**
 * Custom hook to manage intervals using the global interval manager
 * @param intervalType - Type of interval (e.g., 'last-seen', 'user-status')
 * @param callback - Function to call on interval
 * @param intervalMs - Interval duration in milliseconds (default: 60000)
 */
export function useIntervalManager(
  intervalType: string,
  callback: IntervalCallback,
  intervalMs: number = 60000,
) {
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // Create a stable callback that uses the ref
    const stableCallback = () => callbackRef.current();

    // Register the callback
    intervalManager.register(intervalType, stableCallback, intervalMs);

    // Cleanup: unregister the callback
    return () => {
      intervalManager.unregister(intervalType, stableCallback);
    };
  }, [intervalType, intervalMs]);
}

export default useIntervalManager;
