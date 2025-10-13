"use client";

import "../_chat.scss";

import MainTemplate from "@/components/common/main-template/main-template";
import ChatList from "../components/cat-list";
import ChatNewsInfo from "./componenets/support-chat-info";

function Page() {
  return (
    <MainTemplate footer={false}>
      <div className="chat-wrap">
        <div className="wrapper">
          <ChatList />

          <ChatNewsInfo />
        </div>
      </div>
    </MainTemplate>
  );
}

export default Page;
