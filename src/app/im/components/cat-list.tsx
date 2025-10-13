import { useEffect, useState } from "react";
import { ActionGetMyChatList } from "@/app/actions/chat/get-my-chat-list";
import { SITE_URL } from "@/utils/consts";
import ChatItem from "@/app/im/components/chat-item";
import ChatItemLoading from "@/app/im/components/chat-item-loading";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import clsx from "clsx";

function ChatList() {
  const { id } = useParams();
  const pathname = usePathname();

  const [items, setItems] = useState<IChatItems[] | null>(null);

  useEffect(() => {
    ActionGetMyChatList().then(({ data }) => {
      setItems(data as IChatItems[]);
    });
  }, []);

  return (
    <div
      className={clsx("dialogues", {
        "max-lg:!block": !id,
      })}
    >
      <div className="top">
        <b>Диалог и</b>
        <div className="filter-btn">
          <img src="/img/chat/filter.svg" alt="" />
        </div>
      </div>
      <div className="scroll">
        <div className="dialogues-items">
          {items ? (
            <>
              <Link
                href={SITE_URL.SUPPORT}
                className={clsx("dialogues-item", {
                  active: pathname === SITE_URL.SUPPORT,
                })}
              >
                <div className="images">
                  <div className="big-img">
                    <img src="/img/chat/dialogues-big-img.png" alt="" />
                  </div>
                  <div className="small-img">
                    <img src="/img/support.png" alt="" />
                  </div>
                </div>
                <span className="texts">
                  <b>Чат с поддержкой</b>
                  <span>Swappe</span>
                </span>
              </Link>
              <Link
                href={SITE_URL.CHAT_NEWS}
                className={clsx("dialogues-item", {
                  active: pathname === SITE_URL.CHAT_NEWS,
                })}
              >
                <div className="images">
                  <div className="big-img">
                    <img src="/img/chat/dialogues-big-img.png" alt="" />
                  </div>
                  <div className="small-img">
                    <img src="/img/news.png" alt="" />
                  </div>
                </div>
                <div className="texts">
                  <b>Новости</b>
                  <span>Swappe</span>
                </div>
              </Link>

              {items.length ? (
                items?.map((item) => (
                  <ChatItem key={`chat--item--${item.id}`} item={item} />
                ))
              ) : (
                <Link
                  href={SITE_URL.SEARCH}
                  className="w-full h-[200px] !flex-jc-c border border-dashed rounded-[12px] border-black/50 hover:border-black"
                >
                  <h4 className="opacity-60 text-center">
                    <i className="fa-light fa-plus text-[40px]"></i> <br />
                    Ваш чат пока пусто <br />
                    создать сделка
                  </h4>
                </Link>
              )}
            </>
          ) : (
            Array.from({ length: 10 }).map((_, i) => (
              <ChatItemLoading key={`loading-${i}`} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatList;
