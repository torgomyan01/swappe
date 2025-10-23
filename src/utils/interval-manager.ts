/**
 * Global interval manager to prevent multiple intervals from running simultaneously
 * and reduce unnecessary API calls
 */

type IntervalCallback = () => void;

class IntervalManager {
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private callbacks: Map<string, Set<IntervalCallback>> = new Map();

  /**
   * Register a callback for a specific interval type
   * @param intervalType - Type of interval (e.g., 'last-seen', 'user-status')
   * @param callback - Function to call on interval
   * @param intervalMs - Interval duration in milliseconds
   */
  register(
    intervalType: string,
    callback: IntervalCallback,
    intervalMs: number = 60000,
  ) {
    // Add callback to the set for this interval type
    if (!this.callbacks.has(intervalType)) {
      this.callbacks.set(intervalType, new Set());
    }
    this.callbacks.get(intervalType)!.add(callback);

    // If interval doesn't exist, create it
    if (!this.intervals.has(intervalType)) {
      const intervalId = setInterval(() => {
        const callbacks = this.callbacks.get(intervalType);
        if (callbacks) {
          callbacks.forEach((cb) => cb());
        }
      }, intervalMs);

      this.intervals.set(intervalType, intervalId);
    }
  }

  /**
   * Unregister a callback for a specific interval type
   * @param intervalType - Type of interval
   * @param callback - Function to remove
   */
  unregister(intervalType: string, callback: IntervalCallback) {
    const callbacks = this.callbacks.get(intervalType);
    if (callbacks) {
      callbacks.delete(callback);

      // If no more callbacks, clear the interval
      if (callbacks.size === 0) {
        const intervalId = this.intervals.get(intervalType);
        if (intervalId) {
          clearInterval(intervalId);
          this.intervals.delete(intervalType);
        }
        this.callbacks.delete(intervalType);
      }
    }
  }

  /**
   * Clear all intervals
   */
  clearAll() {
    this.intervals.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    this.intervals.clear();
    this.callbacks.clear();
  }

  /**
   * Get the number of active intervals
   */
  getActiveIntervalsCount(): number {
    return this.intervals.size;
  }

  /**
   * Get the number of callbacks for a specific interval type
   */
  getCallbacksCount(intervalType: string): number {
    return this.callbacks.get(intervalType)?.size || 0;
  }
}

// Export singleton instance
export const intervalManager = new IntervalManager();

// Export types for TypeScript
export type { IntervalCallback };
