import { Button, Modal, ModalBody, ModalContent } from "@heroui/react";
import { useRef, useState } from "react";
import DefInput from "@/components/common/input/def-input";

function ModalAddVideo() {
  const form = useRef(null);

  const [modalState, setModalState] = useState<boolean>(false);

  const validators = [
    {
      rule: (v: string) => !v || /youtube|youtu\.be|rutube/.test(v),
      message: "Ссылка должна быть только на Youtube или Rutube",
    },
  ];

  const [videoUrls, setVideoUrls] = useState<string[]>([]);

  function FormSubmit(e: any) {
    e.preventDefault();

    if (videoUrls.length < 5) {
      const value = e.target.videoUrl.value;

      setVideoUrls((old) => [...old, value]);

      // form?.current?.querySelector("input").value = "";
    }
  }

  return (
    <>
      <div className="title-nums">
        <span className="text">Видео</span>
        <span className="num">0/4</span>
      </div>
      <div className="video-items">
        <div className="item active" onClick={() => setModalState(true)}>
          <img
            src="/img/creating-proposal/plus-green2.svg"
            alt="plus-icon"
            className="icon"
          />
        </div>
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
                  <span>0/5</span>
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
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="absolute right-2 top-8"
                      color="danger"
                    >
                      Добавить
                    </Button>
                  </form>
                </div>
                <div className="load-images">
                  {videoUrls.map((url, index) => (
                    <div key={`url--${index}`} className="image">
                      <span className="number">1</span>
                      <span className="close-white">
                        <img
                          src="/img/creating-proposal/close-white.svg"
                          alt=""
                        />
                      </span>
                      <img
                        src="/img/creating-proposal/slider-img2.png"
                        alt=""
                        className="img"
                      />
                    </div>
                  ))}
                </div>
                {videoUrls.length > 0 && (
                  <div className="buttons">
                    <a href="#" className="cancel">
                      Отменить
                    </a>
                    <a href="#" className="add  green-btn">
                      Добавить
                    </a>
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
