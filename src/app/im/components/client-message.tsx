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
import { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

interface IThisProps {
  message: IMessage;
  info: IChatItems;
  onSelectMessage: (messageId: number) => void;
  chatType?: "support" | "deal";
}

function ClientMessage({
  message,
  info,
  onSelectMessage,
  chatType = "deal",
}: IThisProps) {
  const company = useSelector((state: IUserStore) => state.userInfo.company);

  const [isOpen, setIsOpen] = useState(false);

  const handleContextMenu = (e: any) => {
    e.preventDefault();
    setIsOpen(true);
  };

  function PrintClientMessageInfo() {
    if (info.deal.owner?.company?.id === company?.id) {
      return info.deal.client.company;
    }

    if (info.deal.client.company.id === company?.id) {
      return info.deal.owner.company;
    }
  }

  return (
    <div className="left-sms-wrap sm:!min-w-[300px] relative z-0">
      <Link
        href={SITE_URL.COMPANY(PrintClientMessageInfo()?.id || 0)}
        className="img"
        target="_blank"
      >
        {chatType === "deal" ? (
          <Image
            src={`${fileHost}${PrintClientMessageInfo()?.image_path}`}
            alt=""
            width={100}
            height={100}
          />
        ) : (
          <Image src="/img/support.png" alt="" width={100} height={100} />
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
          onClose={() => setIsOpen(false)}
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

              <p dangerouslySetInnerHTML={{ __html: message.content }} />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="menu message" variant="faded">
            <DropdownItem
              key={`select-${message.id}`}
              onPress={() => onSelectMessage(message.id)}
            >
              <div className="flex-js-c gap-2">
                <i className="fa-solid fa-reply"></i>Ответить
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <div className="time">
          <img src="/img/chat/massage-state.svg" alt="" />
          {moment(message.created_at).format("hh:mm")}
        </div>
      </div>
    </div>
  );
}

export default ClientMessage;
