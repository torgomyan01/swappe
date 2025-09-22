import moment from "moment";
import MessageImagesBlock from "@/app/im/components/message-images-block";
import MessageFeedback from "@/app/im/components/message-feedback";
import MyMessageFileBlock from "@/app/im/components/my-message-file-block";
import { fileHost } from "@/utils/consts";
import Image from "next/image";

interface IThisProps {
  message: IMessage;
  info: IChatItems;
}

function MyMessage({ message, info }: IThisProps) {
  return (
    <div className="right-sms-wrap sm:!min-w-[300px]">
      <div className="right-sms">
        <div className="style">
          {message.file_type === "files" && (
            <MyMessageFileBlock message={message} />
          )}

          {message.file_type === "images" && (
            <MessageImagesBlock message={message} />
          )}

          {message.selected_chat_id && <MessageFeedback />}

          <p dangerouslySetInnerHTML={{ __html: message.content }} />
        </div>
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
