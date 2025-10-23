import { useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";

interface UseUltraFastActivityTrackerOptions {
  updateInterval?: number; // milliseconds
  debounceTime?: number; // milliseconds
  enableMouseTracking?: boolean;
  enableKeyboardTracking?: boolean;
  enableScrollTracking?: boolean;
  enableFocusTracking?: boolean;
}

const DEFAULT_OPTIONS: UseUltraFastActivityTrackerOptions = {
  updateInterval: 3000, // 3 seconds - ultra-fast for instant updates
  debounceTime: 500, // 0.5 seconds debounce
  enableMouseTracking: true,
  enableKeyboardTracking: true,
  enableScrollTracking: true,
  enableFocusTracking: true,
};

export function useUltraFastActivityTracker(
  options: UseUltraFastActivityTrackerOptions = {},
) {
  const { data: session } = useSession();
  const optionsRef = useRef({ ...DEFAULT_OPTIONS, ...options });
  const lastUpdateRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ULTRA-FAST activity update function
  const updateActivityUltraFast = useCallback(async () => {
    // Type assertion for session user
    const user = session?.user as any;
    if (!user?.id) return;

    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    // Only update if enough time has passed
    if (timeSinceLastUpdate < (optionsRef.current.updateInterval || 3000)) {
      return;
    }

    try {
      console.log(`⚡ ULTRA-FAST: Updating activity for user ${user.id}`);

      const response = await fetch("/api/auth/update-last-seen-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        lastUpdateRef.current = now;
        console.log(`✅ ULTRA-FAST: Activity updated for user ${user.id}`);
      } else {
        console.error(
          `❌ ULTRA-FAST: Failed to update activity for user ${user.id}`,
        );
      }
    } catch (error) {
      console.error(
        `❌ ULTRA-FAST: Error updating activity for user ${user.id}:`,
        error,
      );
    }
  }, [session?.user]);

  // Debounced activity update
  const debouncedUpdateActivity = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      updateActivityUltraFast();
    }, optionsRef.current.debounceTime || 500);
  }, [updateActivityUltraFast]);

  // ULTRA-FAST event handlers
  const handleMouseMove = useCallback(() => {
    if (optionsRef.current.enableMouseTracking) {
      debouncedUpdateActivity();
    }
  }, [debouncedUpdateActivity]);

  const handleKeyPress = useCallback(() => {
    if (optionsRef.current.enableKeyboardTracking) {
      debouncedUpdateActivity();
    }
  }, [debouncedUpdateActivity]);

  const handleScroll = useCallback(() => {
    if (optionsRef.current.enableScrollTracking) {
      debouncedUpdateActivity();
    }
  }, [debouncedUpdateActivity]);

  const handleFocus = useCallback(() => {
    if (optionsRef.current.enableFocusTracking) {
      // ULTRA-FAST update on focus - no debounce
      updateActivityUltraFast();
    }
  }, [updateActivityUltraFast]);

  const handleVisibilityChange = useCallback(() => {
    if (!document.hidden) {
      // ULTRA-FAST update when tab becomes visible
      updateActivityUltraFast();
    }
  }, [updateActivityUltraFast]);

  // Setup event listeners
  useEffect(() => {
    const user = session?.user as any;
    if (!user?.id) return;

    console.log(
      `⚡ ULTRA-FAST: Setting up activity tracking for user ${user.id}`,
    );

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("keydown", handleKeyPress, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial activity update
    updateActivityUltraFast();

    // Periodic updates for ultra-fast status
    intervalRef.current = setInterval(() => {
      updateActivityUltraFast();
    }, optionsRef.current.updateInterval || 3000);

    return () => {
      // Cleanup event listeners
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("scroll", handleScroll);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Clear intervals and timeouts
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [
    session?.user,
    handleMouseMove,
    handleKeyPress,
    handleScroll,
    handleFocus,
    handleVisibilityChange,
    updateActivityUltraFast,
  ]);

  // Manual activity update function
  const triggerActivityUpdate = useCallback(() => {
    updateActivityUltraFast();
  }, [updateActivityUltraFast]);

  return {
    triggerActivityUpdate,
    isTracking: !!(session?.user as any)?.id,
    lastUpdate: lastUpdateRef.current,
  };
}
