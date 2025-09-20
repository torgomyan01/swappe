import MyMessageFileBlock from "@/app/im/components/my-message-file-block";
import MessageImagesBlock from "@/app/im/components/message-images-block";
import MessageFeedback from "@/app/im/components/message-feedback";
import moment from "moment/moment";

interface IThisProps {
  message: IMessage;
}

function ClientMessage({ message }: IThisProps) {
  return (
    <div className="left-sms-wrap sm:!min-w-[300px]">
      <div className="img">
        <img src="/img/avatar.png" alt="" />
      </div>
      <div className="left-sms">
        <div className="style">
          {message.file_type !== "files" && <MyMessageFileBlock />}

          {message.file_type === "images" && <MessageImagesBlock />}

          {message.selected_chat_id && <MessageFeedback />}

          {message.content}
        </div>
        <div className="time">
          <img src="/img/chat/massage-state.svg" alt="" />
          {moment(message.created_at).format("hh:mm")}
        </div>
      </div>
    </div>
  );
}

export default ClientMessage;
