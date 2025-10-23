"use client";

import { useEffect, useCallback } from "react";
import { ActionUpdateLastSeen } from "@/app/actions/auth/update-last-seen";

export const useOnlineStatus = () => {
  const updateLastSeen = useCallback(async () => {
    try {
      await ActionUpdateLastSeen();
    } catch (error) {
      console.error("Failed to update last seen:", error);
    }
  }, []);

  useEffect(() => {
    // Update last seen on mount
    updateLastSeen();

    // Set up interval to update every 2 minutes
    const interval = setInterval(updateLastSeen, 2 * 60 * 1000);

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
