import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
} from "@heroui/react";
import DefInput from "@/components/common/input/def-input";
import { useRef, useState } from "react";
import { ActionChangeEmail } from "@/app/actions/auth/change-email";
import { useSession } from "next-auth/react";

interface IThisProps {
  isOpen: boolean;
  onClose: () => void;
}

function ModalChangeEmail({ isOpen, onClose }: IThisProps) {
  const { data: session }: any = useSession<any>();

  const [emailInput, setEmailInput] = useState<string>("");

  const form = useRef(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function StartChangeEmail(e: any) {
    e.preventDefault();

    if (session.user.email === emailInput) {
      addToast({
        description:
          "Вы не можете изменить один и тот же адрес электронной почты.",
        color: "danger",
      });
      return;
    }

    if (emailInput) {
      setLoading(true);
      ActionChangeEmail(emailInput, session.user.email)
        .then(({ status, error }) => {
          if (status === "ok") {
            addToast({
              description: "Проверьте ваше почта ",
              color: "success",
            });
            setSuccess(true);
          }

          if (status === "error") {
            addToast({
              description: error,
              color: "danger",
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalContent className="bg-[#fffcf5]">
        <ModalBody className="p-0">
          {success ? (
            <div className="phone-change-info2">
              <img
                src="/img/back-left.svg"
                alt=""
                className="!w-7 absolute left-4 top-0 cursor-pointer"
                onClick={() => setSuccess(false)}
              />
              <h3>Все готово</h3>
              <p>
                Ссылка отправлена на <a href="#">{emailInput}</a>
              </p>
              <p>Проверь свою почту и нажми на ссылку, чтобы продолжить</p>
              <img src="/img/check-img2.png" alt="" />
            </div>
          ) : (
            <div className="global-popup w-full !px-0">
              <div className="form-wrap">
                <img src="/img/sign-in-style.png" alt="" />
                <form action="#" onSubmit={StartChangeEmail}>
                  <h2>Изменить почту</h2>
                  <p>
                    Введи почту, и мы отправим письмо с ссылкой для
                    подтверждения
                  </p>
                  <DefInput
                    label="Почта"
                    placeholder="Почта"
                    required
                    name="email"
                    showAllErrors
                    rules={[/^[^\s@]+@[^\s@]+\.[^\s@]+$/]}
                    messages={[
                      "Пожалуйста, введите корректный адрес электронной почты",
                    ]}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    formRef={form}
                  />
                  <Button
                    className="green-btn"
                    type="submit"
                    isLoading={loading}
                  >
                    Получить ссылку
                  </Button>
                </form>
              </div>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ModalChangeEmail;
