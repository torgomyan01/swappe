import WaitConfirm from "@/app/im/components/deal-statuses/client/wait-confirm";
import WaitConfirmDoc from "@/app/im/components/deal-statuses/client/wait-confirm-doc";
import AllCompleted from "@/app/im/components/deal-statuses/client/all-completed";
import Completed from "@/app/im/components/deal-statuses/client/completed";
import SendReview from "@/app/im/components/deal-statuses/client/send-review";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";

function PrintDealStatus() {
  const { data: session }: any = useSession();

  const chatInfo = useSelector((state: IUserStore) => state.userInfo.chatInfo);

  const PrintType =
    chatInfo?.deal.owner.id === session?.user.id ? "owner" : "client";

  function PrintStatuses() {
    if (chatInfo) {
      const status =
        PrintType === "owner"
          ? chatInfo.deal.statue_owner
          : chatInfo.deal.status_client;

      if (status === "wait-confirm") {
        return <WaitConfirm />;
      }
      if (status === "wait-doc-confirm") {
        return <WaitConfirmDoc />;
      }
      if (status === "doc-confirmed") {
        return <Completed />;
      }
      if (status === "send-review") {
        return <SendReview />;
      }
      if (status === "completed") {
        return <AllCompleted />;
      }
    }
  }

  return <PrintStatuses />;
}

export default PrintDealStatus;
