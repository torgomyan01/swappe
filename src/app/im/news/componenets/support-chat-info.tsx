"use client";

import { CardBody, CardHeader, Spinner, Card } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { fileHost } from "@/utils/consts";
import Image from "next/image";
import clsx from "clsx";
import { PhotoProvider } from "react-photo-view";
import { useSelector } from "react-redux";
import { ActionAdminGetAllChatNews } from "@/app/actions/chat-news/get-all";

function ChatNewsInfo() {
  const company = useSelector((state: IUserStore) => state.userInfo.company);
  const [chatInfo, setChatInfo] = useState<IChatNews[] | null>(null);

  useEffect(() => {
    ActionAdminGetAllChatNews().then((res: any) => {
      setChatInfo(res.data.reverse() as IChatNews[]);
    });
  }, []);

  const messagesEndRef: any = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView();
      }, 500);
    }
  }, [chatInfo]);

  return (
    <PhotoProvider>
      {chatInfo ? (
        <div
          className={clsx("chat-info", {
            "lg:!hidden": false,
          })}
        >
          <div className="top-info">
            <div className="top-line">
              <div className="left-inf">
                <div className="images">
                  <div className="img-b">
                    <Image
                      src="/img/news.png"
                      alt="swappe support"
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                  <div className="img-s">
                    <Image
                      src={`${fileHost}${company?.image_path}`}
                      alt={company?.name || "Swappe"}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="texts">
                  <b>{company?.name || "Swappe"}</b>
                  <span>Чат с новостями</span>
                </div>
              </div>
              <div className="right-inf">
                <div className="dots-wrap">
                  <div className="dots-icon !cursor-default">
                    <img
                      src="/img/chat/dots-menu.svg"
                      alt=""
                      className="opacity-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="middle-info">
            <div className="scroll-info">
              <div className="sms-wrap sm:pl-6 pl-2">
                {chatInfo.map((item) => (
                  <div
                    className="grid sm:grid-cols-2 grid-cols-1 mb-6"
                    key={`news-card-${item.id}`}
                  >
                    <Card className="py-4" shadow="sm">
                      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <h4 className="font-bold text-large">{item.title}</h4>
                      </CardHeader>
                      <CardBody className="overflow-visible py-2">
                        {item.images.length ? (
                          <>
                            <Image
                              alt="Card background"
                              src={`${fileHost}${item.images[0]}`}
                              width={400}
                              height={400}
                              className="w-full h-full object-cover rounded-xl"
                            />

                            <div className="grid grid-cols-3 gap-2 mt-2">
                              {item.images.slice(1).map((img) => (
                                <Image
                                  key={`news-img-${img}`}
                                  alt="Card background"
                                  src={`${fileHost}${img}`}
                                  width={400}
                                  height={400}
                                  className="w-full h-full object-cover rounded-xl bg-gray-100"
                                />
                              ))}
                            </div>
                          </>
                        ) : null}

                        <div className="text-default-500 text-[14px] mt-3">
                          {item.content}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-[70dvh] flex-jc-c">
          <Spinner color="secondary" />
        </div>
      )}
    </PhotoProvider>
  );
}

export default ChatNewsInfo;
