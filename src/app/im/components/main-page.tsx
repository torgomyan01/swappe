import MainTemplate from "@/components/common/main-template/main-template";
import ChatList from "@/app/im/components/cat-list";
import ChatInfo from "@/app/im/components/chat-info";

function MainPage() {
  return (
    <MainTemplate footer={false}>
      <div className="chat-wrap">
        <div className="wrapper">
          <ChatList />

          <ChatInfo />
        </div>
      </div>
    </MainTemplate>
  );
}

export default MainPage;
