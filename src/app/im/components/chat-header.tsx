"use client";

import { memo, useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { fileHost } from "@/utils/consts";
import PrintDealStatus from "@/app/im/components/print-deal-status";
// Removed server action import - using API route instead
import { useSession } from "next-auth/react";
import { ActionGetLastSeenUser } from "@/app/actions/auth/get-last-seen-user";
import { getOnlineStatus } from "@/utils/helpers";
import clsx from "clsx";
import { useIntervalManager } from "@/hooks/use-interval-manager";

interface ChatHeaderProps {
  chatInfo: IChatItems;
}

const ChatHeader = memo(function ChatHeader({ chatInfo }: ChatHeaderProps) {
  const { data: session }: any = useSession<any>();
  const [status, setStatus] = useState<any>(null);

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

  // Memoized function to get status
  const getStatus = useCallback((userId: number) => {
    ActionGetLastSeenUser(userId).then(({ data }) => {
      const date = getOnlineStatus(data?.last_seen as Date);
      setStatus(date);
    });
  }, []);

  // Initial status fetch
  useEffect(() => {
    if (otherUserId) {
      getStatus(otherUserId);
    }
  }, [otherUserId, getStatus]);

  // Use interval manager for periodic status updates
  useIntervalManager(
    "user-status",
    () => {
      if (otherUserId) {
        getStatus(otherUserId);
      }
    },
    60000, // 1 minute
  );

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
          <span className={clsx("status", status?.statusClass)}>
            {status?.isOnline && <span className="online-indicator"></span>}
            {status?.statusText}
          </span>
        </div>
      </div>

      <PrintDealStatus />
    </div>
  );
});

export default ChatHeader;
