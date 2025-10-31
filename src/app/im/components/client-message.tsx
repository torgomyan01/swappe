import MyMessageFileBlock from "@/app/im/components/my-message-file-block";
import MessageImagesBlock from "@/app/im/components/message-images-block";
import moment from "moment/moment";
import { fileHost, SITE_URL } from "@/utils/consts";
import Image from "next/image";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import FeedbackBlock from "@/app/im/components/feedback-block";
import { useState, memo, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

interface IThisProps {
  message: IMessage;
  info: IChatItems;
  onSelectMessage: (messageId: number) => void;
  chatType?: "support" | "deal";
}

const ClientMessage = memo(function ClientMessage({
  message,
  info,
  onSelectMessage,
  chatType = "deal",
}: IThisProps) {
  const company = useSelector((state: IUserStore) => state.userInfo.company);

  const [isOpen, setIsOpen] = useState(false);

  const handleContextMenu = useCallback((e: any) => {
    e.preventDefault();
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSelectMessage = useCallback(() => {
    onSelectMessage(message.id);
  }, [onSelectMessage, message.id]);

  // Memoize the client message info to prevent unnecessary recalculations
  const clientMessageInfo = useMemo(() => {
    if (info.deal.owner?.company?.id === company?.id) {
      return info.deal.client.company;
    }

    if (info.deal.client.company.id === company?.id) {
      return info.deal.owner.company;
    }
    return null;
  }, [info.deal.owner?.company?.id, info.deal.client.company.id, company?.id]);

  // Memoize the formatted time to prevent unnecessary recalculations
  const formattedTime = useMemo(() => {
    return moment(message.created_at).format("HH:MM");
  }, [message.created_at]);

  // Memoize the company link to prevent unnecessary re-renders
  const companyLink = useMemo(() => {
    return SITE_URL.COMPANY(clientMessageInfo?.id || 0);
  }, [clientMessageInfo?.id]);

  return (
    <div className="left-sms-wrap sm:!min-w-[300px] relative z-0">
      <Link href={companyLink} className="img" target="_blank">
        {chatType === "deal" ? (
          <Image
            src={`${fileHost}${clientMessageInfo?.image_path}`}
            alt=""
            width={100}
            height={100}
          />
        ) : (
          <Image
            src="/img/icons/icon-support.svg"
            alt=""
            width={100}
            height={100}
          />
        )}
      </Link>
      <div className="left-sms">
        <Dropdown
          classNames={{
            base: "before:bg-default-200",
            content:
              "py-1 px-1 border border-default-200 bg-linear-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
          }}
          isOpen={isOpen}
          onClose={handleClose}
        >
          <DropdownTrigger>
            <div className="style" onContextMenu={handleContextMenu}>
              {message.file_type === "files" && (
                <MyMessageFileBlock message={message} />
              )}

              {message.file_type === "images" && (
                <MessageImagesBlock message={message} />
              )}

              {message.selected_chat_id && (
                <FeedbackBlock message={message} chatInfo={info} isReadOnly />
              )}

              {(() => {
                // Simple regex for URLs
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                const content = message.content || "";

                // If the content contains a URL, replace it with a clickable link (opens in new tab)
                if (urlRegex.test(content)) {
                  const parts = content.split(urlRegex);
                  return (
                    <p>
                      {parts.map((part, i) =>
                        urlRegex.test(part) ? (
                          <a
                            key={`url-${i}-${part}`}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline break-all"
                          >
                            {part}
                          </a>
                        ) : (
                          <span
                            key={i}
                            dangerouslySetInnerHTML={{ __html: part }}
                          />
                        ),
                      )}
                    </p>
                  );
                } else {
                  // Otherwise, just render the content as before
                  return <p dangerouslySetInnerHTML={{ __html: content }} />;
                }
              })()}
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="menu message" variant="faded">
            <DropdownItem
              key={`select-${message.id}`}
              onPress={handleSelectMessage}
            >
              <div className="flex-js-c gap-2">
                <i className="fa-solid fa-reply"></i>Ответить
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <div className="time">
          <img src="/img/chat/massage-state.svg" alt="" />
          {formattedTime}
        </div>
      </div>
    </div>
  );
});

export default ClientMessage;
