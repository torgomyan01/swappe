"use client";

import { memo, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { fileHost } from "@/utils/consts";
import PrintDealStatus from "@/app/im/components/print-deal-status";
// Removed server action import - using API route instead
import { getOnlineStatus } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useSimpleStatus } from "@/hooks/use-simple-status";
import { useSimpleActivity } from "@/hooks/use-simple-activity";

interface ChatHeaderProps {
  chatInfo: IChatItems;
}

const ChatHeader = memo(function ChatHeader({ chatInfo }: ChatHeaderProps) {
  const { data: session }: any = useSession<any>();
  const [otherUserInfo, setOtherUserInfo] = useState<any>(null);

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

  // Use simple status hook
  const { status, isLoading } = useSimpleStatus(otherUserId || 0, {
    updateInterval: 10000, // 10 seconds
    enablePolling: true,
  });

  // Use simple activity tracking
  useSimpleActivity({
    updateInterval: 30000, // 30 seconds
    debounceTime: 5000, // 5 seconds debounce
    enableMouseTracking: true,
    enableKeyboardTracking: true,
    enableScrollTracking: true,
    enableFocusTracking: true,
  });

  // Fetch other user's information
  useEffect(() => {
    if (otherUserId) {
      // This will be handled by the useSimpleStatus hook
      // We just need to fetch the user info for display
      setOtherUserInfo({
        id: otherUserId,
        name:
          chatInfo.deal?.client_id === session?.user?.id
            ? chatInfo.deal?.owner?.name
            : chatInfo.deal?.client?.name,
      });
    }
  }, [otherUserId, chatInfo, session?.user?.id]);

  // Status display logic
  const displayStatus = status || {
    isOnline: false,
    statusText: "Загрузка...",
    statusClass: "offline",
  };

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
          <span className={`status ${displayStatus.statusClass}`}>
            {isLoading && <span className="loading-indicator">⟳</span>}
            {!isLoading && displayStatus.isOnline && (
              <span className="online-indicator"></span>
            )}
            {displayStatus.statusText}
          </span>
        </div>
      </div>

      <PrintDealStatus />
    </div>
  );
});

export default ChatHeader;
