"use client";

import { memo } from "react";
import Image from "next/image";
import { fileHost } from "@/utils/consts";
import PrintDealStatus from "@/app/im/components/print-deal-status";

interface ChatHeaderProps {
  chatInfo: IChatItems;
}

const ChatHeader = memo(function ChatHeader({ chatInfo }: ChatHeaderProps) {
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
          <span className="status">В сети 2 дня назад</span>
        </div>
      </div>

      <PrintDealStatus />
    </div>
  );
});

export default ChatHeader;
