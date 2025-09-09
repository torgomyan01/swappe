import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import DefInput from "@/components/common/input/def-input";
import UploadVideoImage from "@/app/account/offers/create/components/upload-video-image";
import SelectedVideoImage from "@/app/account/offers/create/components/selected-video-image";
import { useDispatch } from "react-redux";
import { setCompanyVideos } from "@/redux/offer-page";

function ModalAddVideo() {
  const dispatch = useDispatch();

  const form = useRef(null);

  const [modalState, setModalState] = useState<boolean>(false);

  const validators = [
    {
      rule: (v: string) => !v || /youtube|youtu\.be|rutube/.test(v),
      message: "Ссылка должна быть только на Youtube или Rutube",
    },
  ];

  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [SelectedVideoUrls, setSelectedVideoUrls] = useState<string[]>([]);

  useEffect(() => {
    if (SelectedVideoUrls.length > 5) {
      addToast({
        title: "Предупреждение",
        description: "Вы можете выбрать до 5 видео.",
        color: "secondary",
      });
      const cropImages = SelectedVideoUrls.slice(0, 5);
      setSelectedVideoUrls(cropImages);
    }
  }, [SelectedVideoUrls]);

  const [input, setInput] = useState("");

  function FormSubmit(e: any) {
    e.preventDefault();

    if (videoUrls.length < 5) {
      const value = e.target.videoUrl.value;

      setVideoUrls((old) => [...old, value]);

      setInput("");
    }
  }

  function RemoveUrl(index: number) {
    const newUrls = videoUrls.filter(
      (v: string, _index: number) => _index !== index,
    );

    setVideoUrls(newUrls);
  }

  function AddSelectedUrl() {
    const urls = [...SelectedVideoUrls, ...videoUrls];

    setSelectedVideoUrls(urls);
    setVideoUrls([]);
    setModalState(false);
    dispatch(setCompanyVideos(urls));
  }

  function CancelModal() {
    setVideoUrls([]);
    setModalState(false);
  }

  return (
    <>
      <div className="title-nums">
        <span className="text">Видео</span>
        <span className="num">{SelectedVideoUrls.length}/5</span>
      </div>
      <div className="video-items">
        {SelectedVideoUrls.map((url, index) => (
          <SelectedVideoImage key={`url__${index}`} url={url} />
        ))}

        {SelectedVideoUrls.length < 5 && (
          <div className="item active" onClick={() => setModalState(true)}>
            <img
              src="/img/creating-proposal/plus-green2.svg"
              alt="plus-icon"
              className="icon"
            />
          </div>
        )}
      </div>

      <Modal
        size="2xl"
        isOpen={modalState}
        onClose={() => setModalState(false)}
      >
        <ModalContent className="bg-[#fffcf5]">
          <ModalBody>
            <div className="global-popup">
              <div className="load-form-wrap py-6">
                <div className="top-line">
                  <b>Загрузка видео</b>
                  <span>{videoUrls.length + 1}/5</span>
                </div>
                <div className="url-wrap">
                  <form ref={form} className="relative" onSubmit={FormSubmit}>
                    <DefInput
                      label={
                        <span className="text-[14px] !font-medium">
                          Введи URL на сервис или сервис
                        </span>
                      }
                      placeholder="Введи URL на сервис или сервис Youtube, или RuTube"
                      name="videoUrl"
                      formRef={form}
                      showAllErrors={true}
                      rules={validators.map((e) => e.rule)}
                      messages={validators.map((e) => e.message)}
                      required
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    {videoUrls.length < 5 && (
                      <Button
                        type="submit"
                        size="sm"
                        className="absolute right-2 top-8"
                        color="danger"
                      >
                        Добавить
                      </Button>
                    )}
                  </form>
                </div>
                <div className="load-images">
                  {videoUrls.map((url, index) => (
                    <UploadVideoImage
                      key={`url--${index}`}
                      url={url}
                      index={index + 1}
                      onDelete={() => RemoveUrl(index)}
                    />
                  ))}
                </div>
                {videoUrls.length > 0 && (
                  <div className="buttons">
                    <Button className="cancel" onPress={CancelModal}>
                      Отменить
                    </Button>
                    <Button className="add green-btn" onPress={AddSelectedUrl}>
                      Добавить
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalAddVideo;
