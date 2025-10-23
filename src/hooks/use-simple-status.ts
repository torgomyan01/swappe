import { useEffect, useState, useCallback } from "react";
import { ActionGetUserLastSeen } from "@/app/actions/chat/get-user-last-seen";

interface UserStatus {
  isOnline: boolean;
  lastSeen: Date;
  statusText: string;
  statusClass: string;
}

interface UseSimpleStatusOptions {
  updateInterval?: number; // milliseconds
  enablePolling?: boolean;
}

export function useSimpleStatus(
  otherUserId: number,
  options: UseSimpleStatusOptions = {},
) {
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    updateInterval = 10000, // 10 seconds
    enablePolling = true,
  } = options;

  // Fetch user status using server action
  const fetchUserStatus = useCallback(async () => {
    if (!otherUserId) return;

    try {
      setIsLoading(true);
      const { data, error } = await ActionGetUserLastSeen(otherUserId);

      if (data && !error) {
        const lastSeen = new Date(data.last_seen);
        const now = new Date();
        const diffMs = now.getTime() - lastSeen.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);

        let statusData: UserStatus;
        if (diffMinutes <= 1) {
          statusData = {
            isOnline: true,
            lastSeen,
            statusText: "В сети",
            statusClass: "online",
          };
        } else {
          const timeAgo = formatTimeAgo(lastSeen);
          statusData = {
            isOnline: false,
            lastSeen,
            statusText: `Был в сети ${timeAgo}`,
            statusClass: "offline",
          };
        }

        setStatus(statusData);
        console.log(
          `📊 SIMPLE: Status updated for user ${otherUserId}:`,
          statusData,
        );
      }
    } catch (error) {
      console.error(
        `❌ SIMPLE: Error fetching status for user ${otherUserId}:`,
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }, [otherUserId]);

  // Format time ago
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 60) {
      return `${diffMinutes} мин. назад`;
    } else if (diffHours < 24) {
      return `${diffHours} ч. назад`;
    } else {
      return `${diffDays} дн. назад`;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUserStatus();
  }, [fetchUserStatus]);

  // Polling for updates
  useEffect(() => {
    if (!enablePolling || !otherUserId) return;

    const interval = setInterval(() => {
      fetchUserStatus();
    }, updateInterval);

    return () => clearInterval(interval);
  }, [enablePolling, otherUserId, updateInterval, fetchUserStatus]);

  return {
    status,
    isLoading,
    refreshStatus: fetchUserStatus,
  };
}
