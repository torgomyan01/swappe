"use client";

import { useEffect, useCallback, useRef } from "react";

export const useOnlineStatus = () => {
  const lastUpdateRef = useRef<number>(0);
  const DEBOUNCE_TIME = 30000; // 30 seconds

  const updateLastSeen = useCallback(async () => {
    const now = Date.now();

    // Debounce: only update if enough time has passed
    if (now - lastUpdateRef.current < DEBOUNCE_TIME) {
      return;
    }

    try {
      const response = await fetch("/api/auth/update-last-seen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update last seen");
      }

      lastUpdateRef.current = now;
    } catch (error) {
      console.error("Failed to update last seen:", error);
    }
  }, []);

  useEffect(() => {
    // Update last seen on mount
    updateLastSeen();

    // Set up interval to update every 5 minutes
    const interval = setInterval(updateLastSeen, 5 * 60 * 1000);

    // Update on user activity
    const handleActivity = () => {
      updateLastSeen();
    };

    // Listen for user activity events
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup
    return () => {
      clearInterval(interval);
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [updateLastSeen]);
};
