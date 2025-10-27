"use client";

import { useCallback, useState, memo, useEffect } from "react";
import {
  addToast,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
} from "@heroui/react";
import InputEmoji from "react-input-emoji";
import {
  truncateString,
  validateDocumentFiles,
  validateImageFiles,
} from "@/utils/helpers";
import axios from "axios";
import { fileHostUpload, fileHostUploadDoc } from "@/utils/consts";
import clsx from "clsx";

interface MessageInputProps {
  onSendMessage: (messageData: any) => void;
  sendLoading: boolean;
  selectedMessage: number;
  onSelectMessage: (id: number) => void;
  subscriptionError?: string | null;
}

const MessageInput = memo(function MessageInput({
  onSendMessage,
  sendLoading,
  selectedMessage,
  onSelectMessage,
  subscriptionError,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleFileChange = useCallback((event: any) => {
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
  }, []);

  const selectImages = useCallback((e: any) => {
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
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((f, i) => i !== index));
  }, []);

  const removeImage = useCallback((index: number) => {
    setSelectedImages((prev) => prev.filter((f, i) => i !== index));
  }, []);

  const startUploadFilesImages = useCallback(
    (callBack: (paths: any) => void) => {
      const uploadPromises: Promise<any>[] = [];

      if (selectedFiles.length) {
        const filePromises = Array.from(selectedFiles).map((image: File) => {
          const formData = new FormData();
          formData.append("file", image);
          return axios.post(fileHostUploadDoc, formData);
        });
        uploadPromises.push(...filePromises);
      }

      if (selectedImages.length) {
        const imagePromises = Array.from(selectedImages).map((image: File) => {
          const formData = new FormData();
          formData.append("image", image);
          return axios.post(fileHostUpload, formData);
        });
        uploadPromises.push(...imagePromises);
      }

      if (uploadPromises.length > 0) {
        Promise.all(uploadPromises).then((data) => {
          const paths: any = data.map((req) => {
            if (req.data.status === "success") {
              return {
                name: req.data.name,
                url: req.data.url,
              };
            }
            return req.data.url;
          });
          callBack(paths);
        });
      }
    },
    [selectedFiles, selectedImages],
  );

  const PrintTypeFile = useCallback(() => {
    if (selectedFiles.length) {
      return "files";
    }
    if (selectedImages.length) {
      return "images";
    }
    return null;
  }, [selectedFiles, selectedImages]);

  const sendMessage = useCallback(() => {
    if (text || selectedImages.length || selectedFiles.length) {
      if (selectedImages.length || selectedFiles.length) {
        startUploadFilesImages((paths) => {
          const messageData = {
            type: "NEW_MESSAGE",
            content: text,
            file_type: PrintTypeFile(),
            file_paths: paths,
            selected_chat_id: selectedMessage,
          };

          onSendMessage(messageData);
          setSelectedImages([]);
          setSelectedFiles([]);
        });
      } else {
        const messageData = {
          type: "NEW_MESSAGE",
          content: text,
          file_type: null,
          file_paths: null,
          selected_chat_id: selectedMessage,
        };

        onSendMessage(messageData);
      }

      setText("");
      onSelectMessage(0);
    }
  }, [
    text,
    selectedImages,
    selectedFiles,
    selectedMessage,
    startUploadFilesImages,
    PrintTypeFile,
    onSendMessage,
    onSelectMessage,
  ]);

  // File validation effects
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

  return (
    <>
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

      <div className="bottom-info z-[10]">
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

          {subscriptionError && (
            <div className="w-full px-4 py-2 mb-2 bg-warning/20 border border-warning rounded-[6px] text-[14px] flex-jsb-c gap-2">
              <span className="text-warning">{subscriptionError}</span>
              <a
                href="/account/tariffs-bonuses"
                className="text-green underline font-semibold"
              >
                Активировать план
              </a>
            </div>
          )}

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
    </>
  );
});

export default MessageInput;
