import { useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { ActionUpdateLastSeen } from "@/app/actions/auth/update-last-seen";

interface UseSimpleActivityOptions {
  updateInterval?: number; // milliseconds
  debounceTime?: number; // milliseconds
  enableMouseTracking?: boolean;
  enableKeyboardTracking?: boolean;
  enableScrollTracking?: boolean;
  enableFocusTracking?: boolean;
}

const DEFAULT_OPTIONS: UseSimpleActivityOptions = {
  updateInterval: 30000, // 30 seconds
  debounceTime: 5000, // 5 seconds debounce
  enableMouseTracking: true,
  enableKeyboardTracking: true,
  enableScrollTracking: true,
  enableFocusTracking: true,
};

export function useSimpleActivity(options: UseSimpleActivityOptions = {}) {
  const { data: session } = useSession();
  const optionsRef = useRef({ ...DEFAULT_OPTIONS, ...options });
  const lastUpdateRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Activity update function using server action
  const updateActivity = useCallback(async () => {
    const user = session?.user as any;
    if (!user?.id) return;

    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    // Only update if enough time has passed
    if (timeSinceLastUpdate < (optionsRef.current.updateInterval || 30000)) {
      return;
    }

    try {
      console.log(`⚡ SIMPLE: Updating activity for user ${user.id}`);

      const { data, error } = await ActionUpdateLastSeen();

      if (data && !error) {
        lastUpdateRef.current = now;
        console.log(`✅ SIMPLE: Activity updated for user ${user.id}`);
      } else {
        console.error(
          `❌ SIMPLE: Failed to update activity for user ${user.id}`,
        );
      }
    } catch (error) {
      console.error(
        `❌ SIMPLE: Error updating activity for user ${user.id}:`,
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
      updateActivity();
    }, optionsRef.current.debounceTime || 5000);
  }, [updateActivity]);

  // Event handlers
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
      // Immediate update on focus
      updateActivity();
    }
  }, [updateActivity]);

  const handleVisibilityChange = useCallback(() => {
    if (!document.hidden) {
      // Immediate update when tab becomes visible
      updateActivity();
    }
  }, [updateActivity]);

  // Setup event listeners
  useEffect(() => {
    const user = session?.user as any;
    if (!user?.id) return;

    console.log(`⚡ SIMPLE: Setting up activity tracking for user ${user.id}`);

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("keydown", handleKeyPress, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial activity update
    updateActivity();

    // Periodic updates
    intervalRef.current = setInterval(() => {
      updateActivity();
    }, optionsRef.current.updateInterval || 30000);

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
    updateActivity,
  ]);

  // Manual activity update function
  const triggerActivityUpdate = useCallback(() => {
    updateActivity();
  }, [updateActivity]);

  return {
    triggerActivityUpdate,
    isTracking: !!(session?.user as any)?.id,
    lastUpdate: lastUpdateRef.current,
  };
}
