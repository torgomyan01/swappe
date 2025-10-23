"use client";

import { memo, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { fileHost } from "@/utils/consts";
import PrintDealStatus from "@/app/im/components/print-deal-status";
import { ActionGetUserLastSeen } from "@/app/actions/chat/get-user-last-seen";
import { getOnlineStatus } from "@/utils/helpers";
import { useSession } from "next-auth/react";

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

  // Fetch other user's last seen information
  useEffect(() => {
    if (otherUserId) {
      ActionGetUserLastSeen(otherUserId).then(({ data, status }) => {
        if (status === "ok" && data) {
          setOtherUserInfo(data);
          const status = getOnlineStatus((data as any).last_seen);
          setOnlineStatus(status);
        }
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
            {onlineStatus.isOnline && (
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
