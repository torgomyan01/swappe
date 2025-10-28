import { useRef, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  Button,
  Select,
  SelectItem,
  addToast,
} from "@heroui/react";
import DefInput from "@/components/common/input/def-input";
import { ActionCreateHelperPeople } from "@/app/actions/helper-people/create";
import { fileHostUpload } from "@/utils/consts";
import axios from "axios";

interface CreateHelperPeopleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CreateHelperPeopleModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateHelperPeopleModalProps) {
  const form = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    if (file.size > 1048576) {
      addToast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 1 МБ",
        color: "danger",
      });
      e.target.value = "";
      setFile(null);
    } else {
      setFile(file);
    }
  };

  function CreateHelperPeople(e: any) {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const repeatPassword = e.target.repeat_password.value;
    const role = e.target.role.value;

    if (password !== repeatPassword) {
      addToast({
        title: "Пароль и повторный пароль должны быть одинаковыми.",
        color: "danger",
      });
      return;
    }

    if (!file) {
      addToast({
        title: "Логотип не выбран",
        color: "danger",
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file as File);
    axios.post(fileHostUpload, formData).then((res) => {
      ActionCreateHelperPeople(name, email, password, role, res.data.url)
        .then((res) => {
          if (res.status === "error") {
            addToast({
              title: res.error,
              color: "danger",
            });
          }
          if (res.status === "ok") {
            addToast({
              title: "Пользователь успешно создан",
              color: "success",
            });
            form.current?.reset();
            setFile(null);
            onSuccess();
            setTimeout(() => {
              onClose();
            }, 1000);
          }
        })
        .finally(() => setLoading(false));
    });
  }

  return (
    <Modal isOpen={isOpen} size="xl" hideCloseButton scrollBehavior="inside">
      <ModalContent className="p-0 max-h-[90vh]">
        <ModalBody className="p-0 max-h-[98vh] overflow-y-auto rounded-[12px]">
          <div className="popups-wrap">
            <div className="global-popup !p-0">
              <div className="form-wrap !max-w-full">
                <img src="/img/sign-in-style.png" alt="" />
                <div className="popup-close" onClick={onClose}>
                  <img src="/img/close-pop.svg" alt="" />
                </div>

                <form action="" ref={form} onSubmit={CreateHelperPeople}>
                  <h2>Добавить пользователя</h2>
                  <DefInput
                    label="Имя"
                    placeholder="Имя"
                    name="name"
                    required
                    showAllErrors
                    rules={[/^[^!$%@_?*]+$/, (v) => v.trim().length >= 2]}
                    messages={[
                      "Нельзя использовать символы !$%@_?*",
                      "Должно быть не менее 2 символов.",
                    ]}
                    formRef={form}
                  />
                  <DefInput
                    label="E-mail"
                    placeholder="E-mail"
                    name="email"
                    rules={[/^[^\s@]+@[^\s@]+\.[^\s@]+$/]}
                    messages={[
                      "Пожалуйста, введите корректный адрес электронной почты",
                    ]}
                    required
                    showAllErrors
                    formRef={form}
                  />
                  <div>
                    <h4 className="text-[14px] font-medium text-[#252525] mb-2">
                      Должность
                    </h4>
                    <Select
                      className="w-full mb-4"
                      classNames={{ trigger: "h-[46px]" }}
                      placeholder="Выберите должность"
                      name="role"
                    >
                      <SelectItem key="manager">Менеджер</SelectItem>
                    </Select>
                  </div>

                  <DefInput
                    label="Пароль"
                    placeholder="Пароль"
                    name="password"
                    type="password"
                    required
                    showAllErrors
                    formRef={form}
                    rules={[
                      (v) => v.length >= 8,
                      (v) => /[a-z]/.test(v),
                      (v) => /[A-Z]/.test(v),
                      (v) => /\d/.test(v),
                      (v) => /[^A-Za-z0-9]/.test(v),
                      (v) => !/\s/.test(v),
                    ]}
                    messages={[
                      "Пароль должен содержать не менее 8 символов",
                      "Должна быть хотя бы одна строчная буква (a–z)",
                      "Должна быть хотя бы одна заглавная буква (A–Z)",
                      "Должна быть хотя бы одна цифра (0–9)",
                      "Должен быть хотя бы один специальный символ (например, !@#$%^&*)",
                      "Пробелы использовать нельзя",
                    ]}
                  />

                  <DefInput
                    label="Повторите пароль"
                    placeholder="Повторите пароль"
                    name="repeat_password"
                    type="password"
                    required
                    showAllErrors
                    formRef={form}
                    rules={[
                      (v) => v.length >= 8,
                      (v) => /[a-z]/.test(v),
                      (v) => /[A-Z]/.test(v),
                      (v) => /\d/.test(v),
                      (v) => /[^A-Za-z0-9]/.test(v),
                      (v) => !/\s/.test(v),
                    ]}
                    messages={[
                      "Пароль должен содержать не менее 8 символов",
                      "Должна быть хотя бы одна строчная буква (a–z)",
                      "Должна быть хотя бы одна заглавная буква (A–Z)",
                      "Должна быть хотя бы одна цифра (0–9)",
                      "Должен быть хотя бы один специальный символ (например, !@#$%^&*)",
                      "Пробелы использовать нельзя",
                    ]}
                  />

                  <div className="input-wrap">
                    <span>Логотип</span>
                    <label className="file-dropzone">
                      <input
                        type="file"
                        name="file"
                        accept="image/jpeg, image/png, image/webp, image/svg+xml"
                        hidden
                        onChange={handleFileChange}
                      />
                      <div className="file-dropzone-content">
                        <div className="upload-icon">
                          <img src="img/down-icon.svg" alt="" />
                        </div>
                        <p>
                          Перетащи или{" "}
                          <span className="highlight">
                            Выбери файл{" "}
                            {file
                              ? `${file?.name} (${Math.round(file?.size / 1024)} КБ)`
                              : null}
                          </span>
                        </p>
                        <p className="file-types">
                          JPG, PNG или SVG (не более 1 МБ)
                        </p>
                      </div>
                    </label>
                  </div>
                  <Button
                    className="green-btn cursor-pointer"
                    type="submit"
                    isLoading={loading}
                    isDisabled={loading}
                  >
                    Сохранить
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default CreateHelperPeopleModal;
