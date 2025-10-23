import WaitConfirm from "@/app/im/components/deal-statuses/client/wait-confirm";
import WaitConfirmDoc from "@/app/im/components/deal-statuses/client/wait-confirm-doc";
import AllCompleted from "@/app/im/components/deal-statuses/client/all-completed";
import Completed from "@/app/im/components/deal-statuses/client/completed";
import SendReview from "@/app/im/components/deal-statuses/client/send-review";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { memo, useMemo } from "react";

const PrintDealStatus = memo(function PrintDealStatus() {
  const { data: session }: any = useSession();

  const chatInfo = useSelector((state: IUserStore) => state.userInfo.chatInfo);

  // Memoize the print type to prevent unnecessary recalculations
  const printType = useMemo(() => {
    return chatInfo?.deal.owner.id === session?.user.id ? "owner" : "client";
  }, [chatInfo?.deal.owner.id, session?.user.id]);

  // Memoize the status component to prevent unnecessary re-renders
  const statusComponent = useMemo(() => {
    if (!chatInfo) return null;

    const status =
      printType === "owner"
        ? chatInfo.deal.statue_owner
        : chatInfo.deal.status_client;

    switch (status) {
      case "wait-confirm":
        return <WaitConfirm />;
      case "wait-doc-confirm":
        return <WaitConfirmDoc />;
      case "doc-confirmed":
        return <Completed />;
      case "send-review":
        return <SendReview />;
      case "completed":
        return <AllCompleted />;
      default:
        return null;
    }
  }, [chatInfo, printType]);

  return statusComponent;
});

export default PrintDealStatus;
