import Image from "next/image";
import { fileHost } from "@/utils/consts";
import MyMessageFileBlock from "@/app/im/components/my-message-file-block";
import MessageImagesBlock from "@/app/im/components/message-images-block";
import { sliceText } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { memo } from "react";

interface IThisProps {
  message: IMessage;
  chatInfo: IChatItems;
  onClose?: () => void;
  isReadOnly?: boolean;
}

const FeedbackBlock = memo(function FeedbackBlock({
  message,
  chatInfo,
  onClose,
  isReadOnly = false,
}: IThisProps) {
  const { data: session }: any = useSession<any>();

  return (
    <div
      className={clsx("answer", {
        "!p-0 mb-2": isReadOnly,
      })}
    >
      {!isReadOnly ? (
        <>
          <img src="/img/chat/forward.svg" alt="" className="back" />
          <div className="img-wrapper">
            {message?.sender_id === session.user.id ? (
              <Image
                src={`${fileHost}${chatInfo.deal.owner.company.image_path}`}
                alt=""
                width={100}
                height={100}
              />
            ) : (
              <Image
                src={`${fileHost}${chatInfo.deal.client.company.image_path}`}
                alt=""
                width={100}
                height={100}
              />
            )}
          </div>
        </>
      ) : null}

      <div
        className={clsx("texts bg-white/60 w-full px-4 pt-2 rounded-[8px]", {
          "!mr-0": isReadOnly,
        })}
      >
        <span className="green">Ответ {chatInfo.deal.client.company.name}</span>
        {message?.file_type === "files" && (
          <MyMessageFileBlock message={message} />
        )}

        {message?.file_type === "images" && (
          <MessageImagesBlock message={message} isMin />
        )}
        <span
          className="black block mb-2"
          dangerouslySetInnerHTML={{
            __html: sliceText(message?.content || "", 50),
          }}
        />
      </div>
      {!isReadOnly && (
        <button className="close" type="button">
          <img
            src="/img/close-grey.svg"
            alt="close"
            className="cursor-pointer"
            onClick={onClose}
          />
        </button>
      )}
    </div>
  );
});

export default FeedbackBlock;
