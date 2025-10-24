import Image from "next/image";
import { fileHost, SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { useParams } from "next/navigation";
import clsx from "clsx";
import { Tooltip, Chip } from "@heroui/react";
import { sliceText } from "@/utils/helpers";
import { ActionGetChatUnreadCount } from "@/app/actions/chat/get-chat-unread-count";
import { useEffect, useState } from "react";
import { useWebSocket } from "@/contexts/websocket-context";

interface IThisProps {
  item: IChatItems;
}

function ChatItem({ item }: IThisProps) {
  const { id } = useParams();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { onMessage, offMessage } = useWebSocket();

  // Fetch unread count for this chat
  useEffect(() => {
    const fetchUnreadCount = () => {
      ActionGetChatUnreadCount(item.id).then(({ data }) => {
        setUnreadCount(data as number);
      });
    };

    fetchUnreadCount();

    // Refresh count every 60 seconds (reduced frequency)
    const interval = setInterval(fetchUnreadCount, 60000);

    return () => clearInterval(interval);
  }, [item.id]);

  // Listen for new messages via WebSocket
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleWebSocketMessage = (data: any) => {
      if (data.type === "MESSAGE" && data.payload.chat_id === item.id) {
        // Debounce the unread count refresh to prevent too many API calls
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          ActionGetChatUnreadCount(item.id).then(({ data }) => {
            setUnreadCount(data as number);
          });
        }, 1000); // Wait 1 second before refreshing
      }
    };

    onMessage(handleWebSocketMessage);

    return () => {
      offMessage(handleWebSocketMessage);
      clearTimeout(timeoutId);
    };
  }, [item.id, onMessage, offMessage]);

  return (
    <Link
      href={`${SITE_URL.CHAT}/${item.id}`}
      className={clsx("dialogues-item", {
        active: id && +id === item.id,
      })}
    >
      <div className="images">
        <div className="big-img">
          <Image
            src={`${fileHost}${item.deal.owner_offer.images[0]}`}
            alt="img"
            width={200}
            height={200}
            className="rounded-[8px]"
          />
        </div>
        <div className="small-img border-[3px] border-[#f8f2ea]">
          <Tooltip content={`Company: ${item.deal.client.company.name}`}>
            <Image
              src={`${fileHost}${item.deal.client.company.image_path}`}
              alt={item.deal.client.company.name}
              width={200}
              height={200}
            />
          </Tooltip>
        </div>
      </div>
      <div className="texts w-full">
        <div className="w-full flex-jsb-c">
          <b title={item.chat_name}>{sliceText(item.chat_name)}</b>
          {unreadCount > 0 && (
            <Chip size="sm" color="secondary">
              {unreadCount}
            </Chip>
          )}
        </div>
        <span className="company-name">{item.deal.client.company.name}</span>
      </div>
    </Link>
  );
}

export default ChatItem;
