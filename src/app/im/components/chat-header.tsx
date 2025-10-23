"use client";

import { memo, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { fileHost } from "@/utils/consts";
import PrintDealStatus from "@/app/im/components/print-deal-status";
// Removed server action import - using API route instead
import { getOnlineStatus } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useRealtimeStatus } from "@/hooks/use-realtime-status";
import { useActivityTracker } from "@/hooks/use-activity-tracker";

interface ChatHeaderProps {
  chatInfo: IChatItems;
}

const ChatHeader = memo(function ChatHeader({ chatInfo }: ChatHeaderProps) {
  const { data: session }: any = useSession<any>();
  const [otherUserInfo, setOtherUserInfo] = useState<any>(null);
  const [onlineStatus, setOnlineStatus] = useState({
    isOnline: false,
    statusText: "Загрузка...",
    statusClass: "offline",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeStatus, setRealTimeStatus] = useState<{
    isOnline: boolean;
    lastSeen?: Date;
  } | null>(null);

  // Determine which user is the "other" user in the chat
  const otherUserId = useMemo(() => {
    if (!session?.user?.id || !chatInfo?.deal) return null;

    // If current user is the client, show owner's info
    if (session.user.id === chatInfo.deal.client_id) {
      return chatInfo.deal.owner_id;
    }
    // If current user is the owner, show client's info
    return chatInfo.deal.client_id;
  }, [session?.user?.id, chatInfo?.deal]);

  // Real-time online status callbacks
  const onlineStatusCallbacks = useMemo(
    () => ({
      onUserOnline: (userId: number) => {
        if (userId === otherUserId) {
          setRealTimeStatus({ isOnline: true });
          const status = getOnlineStatus(new Date());
          setOnlineStatus(status);
        }
      },
      onUserOffline: (userId: number) => {
        console.log(`🔴 Real-time: User ${userId} went OFFLINE`);
        if (userId === otherUserId) {
          setRealTimeStatus({ isOnline: false });
          const status = getOnlineStatus(
            realTimeStatus?.lastSeen || new Date(),
          );
          setOnlineStatus(status);
          console.log(`✅ Updated status for user ${userId}:`, status);
        }
      },
      onStatusUpdate: (userId: number, lastSeen: Date) => {
        console.log(`🔄 Real-time: User ${userId} status update:`, lastSeen);
        if (userId === otherUserId) {
          setRealTimeStatus({ isOnline: true, lastSeen });
          const status = getOnlineStatus(lastSeen);
          setOnlineStatus(status);
          console.log(`✅ Updated status for user ${userId}:`, status);
        }
      },
    }),
    [otherUserId, realTimeStatus?.lastSeen],
  );

  // Initialize real-time online status
  useRealtimeStatus(onlineStatusCallbacks, {
    autoConnect: true,
    reconnectInterval: 3000, // 3 seconds
    maxReconnectAttempts: 10,
    connectionTimeout: 30000, // 30 seconds
  });

  // Initialize activity tracking
  useActivityTracker({
    updateInterval: 10000, // 10 seconds
    debounceTime: 2000, // 2 seconds debounce
    enableMouseTracking: true,
    enableKeyboardTracking: true,
    enableScrollTracking: true,
    enableFocusTracking: true,
  });

  // Fetch other user's last seen information
  useEffect(() => {
    if (otherUserId) {
      fetch(`/api/chat/get-user-last-seen?userId=${otherUserId}`)
        .then((response) => response.json())
        .then(({ data, error }) => {
          console.log(data, error, "User last seen data");

          if (data && !error) {
            setOtherUserInfo(data);
            const status = getOnlineStatus((data as any).last_seen);
            setOnlineStatus(status);
          } else {
            setOnlineStatus({
              isOnline: false,
              statusText: "Ошибка загрузки",
              statusClass: "offline",
            });
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to get user last seen:", error);
          setOnlineStatus({
            isOnline: false,
            statusText: "Ошибка загрузки",
            statusClass: "offline",
          });
          setIsLoading(false);
        });
    }
  }, [otherUserId]);

  // Update online status every minute
  useEffect(() => {
    if (!otherUserInfo) return;

    const interval = setInterval(() => {
      const status = getOnlineStatus((otherUserInfo as any).last_seen);
      setOnlineStatus(status);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [otherUserInfo]);

  return (
    <div className="top-info">
      <div className="top-line">
        <div className="left-inf">
          <div className="images">
            <div className="img-b">
              <Image
                src={`${fileHost}${chatInfo.deal.client_offer.images[0]}`}
                alt={chatInfo.deal.client.company.name}
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
            <div className="img-s">
              <Image
                src={`${fileHost}${chatInfo.deal.client.company.image_path}`}
                alt={chatInfo.deal.client.company.name}
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
          </div>
          <div className="texts">
            <b>{chatInfo?.deal.client.company.name}</b>
            <span>Имя менеджера</span>
          </div>
        </div>
        <div className="right-inf">
          <div className="dots-wrap">
            <div className="dots-icon !cursor-default">
              <img src="/img/chat/dots-menu.svg" alt="" className="opacity-0" />
            </div>
          </div>
          <span className={`status ${onlineStatus.statusClass}`}>
            {isLoading && <span className="loading-indicator">⟳</span>}
            {!isLoading && onlineStatus.isOnline && (
              <span className="online-indicator"></span>
            )}
            {onlineStatus.statusText}
          </span>
        </div>
      </div>

      <PrintDealStatus />
    </div>
  );
});

export default ChatHeader;
