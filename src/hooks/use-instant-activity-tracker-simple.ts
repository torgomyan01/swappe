import { useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";

interface UseInstantActivityTrackerOptions {
  updateInterval?: number; // milliseconds
  debounceTime?: number; // milliseconds
  enableMouseTracking?: boolean;
  enableKeyboardTracking?: boolean;
  enableScrollTracking?: boolean;
  enableFocusTracking?: boolean;
}

const DEFAULT_OPTIONS: UseInstantActivityTrackerOptions = {
  updateInterval: 10000, // 10 seconds - more frequent for instant updates
  debounceTime: 2000, // 2 seconds debounce
  enableMouseTracking: true,
  enableKeyboardTracking: true,
  enableScrollTracking: true,
  enableFocusTracking: true,
};

export function useInstantActivityTracker(
  options: UseInstantActivityTrackerOptions = {},
) {
  const { data: session } = useSession();
  const optionsRef = useRef({ ...DEFAULT_OPTIONS, ...options });
  const lastUpdateRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // INSTANT activity update function
  const updateActivityInstant = useCallback(async () => {
    // Type assertion for session user
    const user = session?.user as any;
    if (!user?.id) return;

    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    // Only update if enough time has passed
    if (timeSinceLastUpdate < (optionsRef.current.updateInterval || 5000)) {
      return;
    }

    try {
      console.log(`⚡ INSTANT: Updating activity for user ${user.id}`);

      const response = await fetch("/api/auth/update-last-seen-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        lastUpdateRef.current = now;
        console.log(`✅ INSTANT: Activity updated for user ${user.id}`);
      } else {
        console.error(
          `❌ INSTANT: Failed to update activity for user ${user.id}`,
        );
      }
    } catch (error) {
      console.error(
        `❌ INSTANT: Error updating activity for user ${user.id}:`,
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
      updateActivityInstant();
    }, optionsRef.current.debounceTime || 2000);
  }, [updateActivityInstant]);

  // INSTANT event handlers
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
      // INSTANT update on focus - no debounce
      updateActivityInstant();
    }
  }, [updateActivityInstant]);

  const handleVisibilityChange = useCallback(() => {
    if (!document.hidden) {
      // INSTANT update when tab becomes visible
      updateActivityInstant();
    }
  }, [updateActivityInstant]);

  // Setup event listeners
  useEffect(() => {
    const user = session?.user as any;
    if (!user?.id) return;

    console.log(`⚡ INSTANT: Setting up activity tracking for user ${user.id}`);

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("keydown", handleKeyPress, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial activity update
    updateActivityInstant();

    // Periodic updates for instant status
    intervalRef.current = setInterval(() => {
      updateActivityInstant();
    }, optionsRef.current.updateInterval || 5000);

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
    updateActivityInstant,
  ]);

  // Manual activity update function
  const triggerActivityUpdate = useCallback(() => {
    updateActivityInstant();
  }, [updateActivityInstant]);

  return {
    triggerActivityUpdate,
    isTracking: !!(session?.user as any)?.id,
    lastUpdate: lastUpdateRef.current,
  };
}
