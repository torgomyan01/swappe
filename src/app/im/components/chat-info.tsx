"use client";

import {
  addToast,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
} from "@heroui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fileHost, fileHostUpload, fileHostUploadDoc } from "@/utils/consts";
import Image from "next/image";
import PrintDealStatus from "@/app/im/components/print-deal-status";
import Messages from "@/app/im/components/messages";
import { ActionGetMessages } from "@/app/actions/chat/get-messages";
import { useSession } from "next-auth/react";
import InputEmoji from "react-input-emoji";
import {
  truncateString,
  UpdateChatInfo,
  validateDocumentFiles,
  validateImageFiles,
} from "@/utils/helpers";
import axios from "axios";
import clsx from "clsx";
import { PhotoProvider } from "react-photo-view";
import FeedbackBlock from "@/app/im/components/feedback-block";
import { useDispatch, useSelector } from "react-redux";

function ChatInfo() {
  const dispatch: any = useDispatch();
  const { id }: { id: string } = useParams();
  const { data: session }: any = useSession<any>();
  const chatInfo = useSelector((state: IUserStore) => state.userInfo.chatInfo);

  useEffect(() => {
    if (id) {
      dispatch(UpdateChatInfo(id));
    }
  }, [id]);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [ws, setWs] = useState<any>(null);
  const [sendLoading, setSendLoading] = useState(false);

  const [selectedMessage, setSelectedMessage] = useState<number>(0);

  function GetOldMessages() {
    if (id) {
      ActionGetMessages(+id).then(({ data }) => {
        setMessages(data as IMessage[]);
      });
    }
  }

  useEffect(() => {
    GetOldMessages();

    const wsUrl =
      process.env.NODE_ENV === "production"
        ? `wss://${window.location.host}/ws`
        : "ws://localhost:3004";

    const wsClient: any = new WebSocket(wsUrl);

    wsClient.onopen = () => console.log("Connected to WebSocket server");

    wsClient.onmessage = (event: any) => {
      const data = JSON.parse(event.data);
      if (data.type === "MESSAGE") {
        if (id && data.payload.chat_id === +id) {
          setSendLoading(false);
          setMessages((prev) => [...prev, data.payload]);
        }
      }
    };

    wsClient.onclose = () => console.log("Disconnected from WebSocket server");
    wsClient.onerror = (error: any) => console.error("WebSocket error:", error);

    setWs(wsClient);

    return () => {
      if (wsClient) {
        wsClient.close();
      }
    };
  }, []);

  const [text, setText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const findSelectedMessage = messages.find(
    (msg) => msg.id === selectedMessage,
  );

  useEffect(() => {
    if (selectedFiles.length > 6) {
      const cropFiles = selectedFiles.slice(0, 5);

      setSelectedFiles(cropFiles);

      addToast({
        description: "Максимальное количество файлов не должно превышать 5.",
        color: "danger",
      });
    }
    if (selectedImages.length > 6) {
      const cropFiles = selectedImages.slice(0, 5);

      setSelectedImages(cropFiles);

      addToast({
        description: "Максимальное количество картинки не должно превышать 5.",
        color: "danger",
      });
    }
  }, [selectedFiles, selectedImages]);

  function removeFile(index: number) {
    const filter = selectedFiles.filter((f, i) => i !== index);

    setSelectedFiles(filter);
  }

  function removeImage(index: number) {
    const filter = selectedImages.filter((f, i) => i !== index);

    setSelectedImages(filter);
  }

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN && id && chatInfo) {
      setSendLoading(true);
      setText("");

      if (text || selectedImages.length || selectedFiles.length) {
        if (selectedImages.length || selectedFiles.length) {
          startUploadFilesImages((paths) => {
            const messageData = {
              type: "NEW_MESSAGE",
              chat_id: +id,
              sender_id: session.user.id,
              content: text,
              file_type: PrintTypeFile(),
              file_paths: paths,
              selected_chat_id: selectedMessage,
            };

            ws.send(JSON.stringify(messageData));

            setSelectedImages([]);
            setSelectedFiles([]);
          });
        } else {
          const messageData = {
            type: "NEW_MESSAGE",
            chat_id: +id,
            sender_id: session.user.id,
            content: text,
            file_type: null,
            file_paths: null,
            selected_chat_id: selectedMessage,
          };

          ws.send(JSON.stringify(messageData));
        }

        setSelectedMessage(0);
      }
    }
  };

  function startUploadFilesImages(callBack: (paths: any) => void) {
    if (selectedFiles.length) {
      const promise = Array.from(selectedFiles).map((image: File) => {
        const formData = new FormData();
        formData.append("file", image);

        return axios.post(fileHostUploadDoc, formData);
      });

      Promise.all(promise).then((data) => {
        const paths: any = data.map((req) => {
          if (req.data.status === "success") {
            return {
              name: req.data.name,
              url: req.data.url,
            };
          }
        });
        callBack(paths);
      });
    }

    if (selectedImages.length) {
      const promise = Array.from(selectedImages).map((image: File) => {
        const formData = new FormData();
        formData.append("image", image);

        return axios.post(fileHostUpload, formData);
      });

      Promise.all(promise).then((data) => {
        const paths: string[] = data.map((req) => req.data.url);
        callBack(paths);
      });
    }
  }

  function PrintTypeFile() {
    if (selectedFiles.length) {
      return "files";
    }

    if (selectedImages.length) {
      return "images";
    }
  }

  const handleFileChange = (event: any) => {
    const selectedFiles = event.target.files;

    if (selectedFiles.length > 0) {
      const isValid = validateDocumentFiles(selectedFiles);

      if (isValid === "ok") {
        setSelectedFiles(Array.from(selectedFiles));
      } else if (isValid === "type") {
        addToast({
          description:
            "Пожалуйста, выбирайте только файлы документов (PDF, Word, Excel и т. д.).",
          color: "danger",
        });
        event.target.value = "";
      } else if (isValid === "size") {
        addToast({
          description: "Размер файла превышает допустимый лимит (5 МБ).",
          color: "danger",
        });
        event.target.value = "";
      }
    }
  };

  function selectImages(e: any) {
    const selectedFiles = e.target.files;

    if (selectedFiles.length) {
      const status = validateImageFiles(selectedFiles);

      if (status === "ok") {
        setSelectedImages(Array.from(selectedFiles));
      } else if (status === "type") {
        addToast({
          description:
            "Пожалуйста, выбирайте только файлы изображений (JPG, PNG, GIF и т. д.).",
          color: "danger",
        });
        e.target.value = "";
      } else if (status === "size") {
        addToast({
          description: "Размер изображений превышает допустимый лимит (5 МБ).",
          color: "danger",
        });
        e.target.value = "";
      }
    }
  }

  return (
    <PhotoProvider>
      {id ? (
        chatInfo ? (
          <div
            className={clsx("chat-info", {
              "lg:!hidden": !id,
            })}
          >
            <div className="top-info">
              <div className="top-line">
                <div className="left-inf">
                  <div className="images">
                    <div className="img-b">
                      <Image
                        src={`${fileHost}${chatInfo.deal.client_offer.images[0]}`}
                        alt={chatInfo.deal.client.company.name}
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                    </div>
                    <div className="img-s">
                      <Image
                        src={`${fileHost}${chatInfo.deal.client.company.image_path}`}
                        alt={chatInfo.deal.client.company.name}
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="texts">
                    <b>{chatInfo?.deal.client.company.name}</b>
                    <span>Имя менеджера</span>
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
                  <span className="status">В сети 2 дня назад</span>
                </div>
              </div>

              <PrintDealStatus />
            </div>

            <Messages
              chat={chatInfo}
              messages={messages}
              onSelectMessage={(id) => setSelectedMessage(id)}
            />

            <input
              type="file"
              className="hidden"
              multiple
              id="select-iamge"
              onChange={selectImages}
              disabled={!!selectedFiles.length || !!selectedImages.length}
              accept="image/jpeg, image/png, image/gif, image/bmp, image/webp"
            />

            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              multiple
              id="select-files"
              disabled={!!selectedFiles.length || !!selectedImages.length}
              accept=".pdf, .doc, .docx, .xls, .xlsx, .txt, .odt"
            />

            <div className="bottom-info">
              <Dropdown>
                <DropdownTrigger>
                  <button className="plus cursor-pointer">
                    <img src="/img/chat/plus-white.svg" alt="" />
                  </button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="new">
                    <label
                      htmlFor="select-iamge"
                      className={clsx("w-full cursor-pointer", {
                        "opacity-50 !cursor-default":
                          !!selectedFiles.length || !!selectedImages.length,
                      })}
                    >
                      <i className="fa-regular fa-images mr-2"></i>Картинка
                    </label>
                  </DropdownItem>
                  <DropdownItem key="copy">
                    <label
                      htmlFor="select-files"
                      className={clsx("w-full cursor-pointer", {
                        "opacity-50 !cursor-default":
                          !!selectedFiles.length || !!selectedImages.length,
                      })}
                    >
                      <i className="fa-regular fa-file  mr-2"></i>Документ
                    </label>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <div className="chat-dialog-wrap">
                {selectedFiles.length ? (
                  <div className="w-full flex-js-c gap-1 p-4 pb-2 flex-wrap">
                    {selectedFiles.map((file: File, index: number) => (
                      <div
                        key={`file-selected-${index}`}
                        className="px-4 py-2 bg-green/20 rounded-[6px] text-[14px] flex-jsb-c gap-2"
                      >
                        {truncateString(file.name, 15)}
                        <i
                          className="fa-solid fa-xmark cursor-pointer"
                          onClick={() => removeFile(index)}
                        ></i>
                      </div>
                    ))}
                  </div>
                ) : null}

                {selectedImages.length ? (
                  <div className="w-full flex-js-c gap-1 p-4 pb-2 flex-wrap">
                    {selectedImages.map((file: File, index: number) => (
                      <div
                        key={`image-selected-${index}`}
                        className="bg-green/20 rounded-[6px] overflow-hidden relative w-[80px] h-[80px]"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        <i
                          className="fa-solid fa-xmark cursor-pointer absolute top-2 right-2 text-green"
                          onClick={() => removeImage(index)}
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                {selectedMessage && findSelectedMessage ? (
                  <FeedbackBlock
                    message={findSelectedMessage}
                    chatInfo={chatInfo}
                    onClose={() => setSelectedMessage(0)}
                  />
                ) : null}

                <form action="#" className="relative !z-[100]">
                  <InputEmoji
                    value={text}
                    onChange={setText}
                    cleanOnEnter
                    onEnter={sendMessage}
                    placeholder="Напиши сообщение..."
                    shouldReturn
                    shouldConvertEmojiToImage={false}
                  />
                  <button
                    className="smile !bottom-[12px] !right-[60px] !cursor-pointer relative z-10"
                    type="button"
                    disabled={sendLoading}
                    onClick={sendMessage}
                  >
                    {sendLoading ? (
                      <Spinner
                        color="secondary"
                        size="sm"
                        className="relative top-1"
                      />
                    ) : (
                      <i className="fa-solid fa-paper-plane text-green"></i>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-[70dvh] flex-jc-c">
            <Spinner color="secondary" />
          </div>
        )
      ) : (
        <div
          className={clsx("chat-info !h-[60dvh] !flex-jc-c opacity-50", {
            "max-lg:!hidden": !id,
          })}
        >
          Выбирайте чат пожалуйста
        </div>
      )}
    </PhotoProvider>
  );
}

export default ChatInfo;
