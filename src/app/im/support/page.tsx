"use client";

import "../_chat.scss";

import MainTemplate from "@/components/common/main-template/main-template";
import ChatList from "../components/cat-list";
import SupportChatInfo from "./componenets/support-chat-info";

function Page() {
  return (
    <MainTemplate footer={false}>
      <div className="chat-wrap">
        <div className="wrapper">
          <div className="hidden lg:block">
            <ChatList />
          </div>

          <SupportChatInfo />
        </div>
      </div>
    </MainTemplate>
  );
}

export default Page;
