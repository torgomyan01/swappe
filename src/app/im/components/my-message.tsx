import moment from "moment";
import MessageImagesBlock from "@/app/im/components/message-images-block";
import MyMessageFileBlock from "@/app/im/components/my-message-file-block";
import { fileHost } from "@/utils/consts";
import Image from "next/image";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import FeedbackBlock from "@/app/im/components/feedback-block";
import { useState } from "react";

interface IThisProps {
  message: IMessage;
  info: IChatItems;
  onSelectMessage: (messageId: number) => void;
}

function MyMessage({ message, info, onSelectMessage }: IThisProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleContextMenu = (e: any) => {
    e.preventDefault();
    setIsOpen(true);
  };

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
      <div className="img">
        <Image
          src={`${fileHost}${info.deal.owner.company.image_path}`}
          alt=""
          width={100}
          height={100}
        />
      </div>
    </div>
  );
}

export default MyMessage;
