import { Skeleton } from "@heroui/react";

function ChatItemLoading() {
  return (
    <div className="dialogues-item !bg-[#e4e4e77d]">
      <div className="images">
        <div className="big-img">
          <Skeleton className="w-full h-full rounded-[8px]" />
        </div>
        <div className="small-img border-[3px] border-[#f8f2ea]">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
      <div className="texts">
        <b>
          <Skeleton className="w-[150px] h-[10px] rounded-[8px] mb-1" />
        </b>
        <Skeleton className="w-[80px] h-[15px] rounded-[8px]" />
      </div>
    </div>
  );
}

export default ChatItemLoading;
