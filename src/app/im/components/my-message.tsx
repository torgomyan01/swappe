import moment from "moment";
import MessageImagesBlock from "@/app/im/components/message-images-block";
import MyMessageFileBlock from "@/app/im/components/my-message-file-block";
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
}

const MyMessage = memo(function MyMessage({
  message,
  info,
  onSelectMessage,
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

  // Memoize the formatted time to prevent unnecessary recalculations
  const formattedTime = useMemo(() => {
    return moment(message.created_at).format("hh:mm");
  }, [message.created_at]);

  // Memoize the company link to prevent unnecessary re-renders
  const companyLink = useMemo(() => {
    return SITE_URL.COMPANY(company?.id || 0);
  }, [company?.id]);

  return (
    <div className="right-sms-wrap sm:!min-w-[300px] relative">
      <div className="right-sms">
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
      <Link href={companyLink} target="_blank" className="img">
        <Image
          src={`${fileHost}${company?.image_path}`}
          alt=""
          width={100}
          height={100}
        />
      </Link>
    </div>
  );
});

export default MyMessage;
