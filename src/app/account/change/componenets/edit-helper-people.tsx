import { useEffect, useRef, useState } from "react";
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
import { ActionEditHelperPeople } from "@/app/actions/helper-people/edit";
import { ActionDeleteHelperPeopleImage } from "@/app/actions/helper-people/delete-image";
import { fileHost, fileHostUpload } from "@/utils/consts";
import axios from "axios";

interface EditHelperPeopleProps {
  isOpen: boolean;
  onClose: () => void;
  helperPeople: IHelperPeople;
  onSuccess: () => void;
}

function EditHelperPeople({
  isOpen,
  onClose,
  helperPeople,
  onSuccess,
}: EditHelperPeopleProps) {
  const form = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageDeleted, setImageDeleted] = useState(false);

  useEffect(() => {
    if (isOpen && helperPeople) {
      // Pre-fill form with existing data
      if (form.current) {
        const nameInput = form.current.elements.namedItem(
          "name",
        ) as HTMLInputElement;
        const emailInput = form.current.elements.namedItem(
          "email",
        ) as HTMLInputElement;
        const roleInput = form.current.elements.namedItem(
          "role",
        ) as HTMLInputElement;
        const passwordInput = form.current.elements.namedItem(
          "password",
        ) as HTMLInputElement;
        const repeatPasswordInput = form.current.elements.namedItem(
          "repeat_password",
        ) as HTMLInputElement;

        if (nameInput) nameInput.value = helperPeople.name;
        if (emailInput) emailInput.value = helperPeople.email;
        if (roleInput) roleInput.value = helperPeople.role;
        if (passwordInput) passwordInput.value = "";
        if (repeatPasswordInput) repeatPasswordInput.value = "";
      }
      setFile(null);
      setImageDeleted(false);
    }
  }, [isOpen, helperPeople]);

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

  const handleDeleteImage = async () => {
    if (confirm("Вы уверены, что хотите удалить изображение?")) {
      setLoading(true);
      try {
        const result = await ActionDeleteHelperPeopleImage(helperPeople.id);
        if (result.status === "ok") {
          addToast({
            title: "Изображение удалено",
            color: "success",
          });
          setImageDeleted(true);
          onSuccess(); // Refresh the data
        } else {
          addToast({
            title: result.error,
            color: "danger",
          });
        }
      } catch (error) {
        addToast({
          title: "Ошибка при удалении изображения",
          color: "danger",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  function EditHelperPeopleSubmit(e: any) {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const repeatPassword = e.target.repeat_password.value;
    const role = e.target.role.value;

    // Check if passwords match only if password is provided
    if (password && password !== repeatPassword) {
      addToast({
        title: "Пароль и повторный пароль должны быть одинаковыми.",
        color: "danger",
      });
      return;
    }

    setLoading(true);

    // If no new file is selected, use existing image
    if (!file) {
      ActionEditHelperPeople(
        helperPeople.id,
        name,
        email,
        password || null,
        role,
        null, // Keep existing image
      )
        .then((res) => {
          if (res.status === "error") {
            addToast({
              title: res.error,
              color: "danger",
            });
          }
          if (res.status === "ok") {
            addToast({
              title: "Пользователь успешно обновлен",
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
    } else {
      // Upload new image
      const formData = new FormData();
      formData.append("image", file as File);
      axios.post(fileHostUpload, formData).then((res) => {
        ActionEditHelperPeople(
          helperPeople.id,
          name,
          email,
          password || null,
          role,
          res.data.url,
        )
          .then((res) => {
            if (res.status === "error") {
              addToast({
                title: res.error,
                color: "danger",
              });
            }
            if (res.status === "ok") {
              addToast({
                title: "Пользователь успешно обновлен",
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
  }

  return (
    <Modal isOpen={isOpen} size="xl" hideCloseButton>
      <ModalContent className="p-0">
        <ModalBody className="p-0">
          <div className="popups-wrap">
            <div className="global-popup !p-0">
              <div className="form-wrap !max-w-full">
                <img src="/img/sign-in-style.png" alt="" />
                <div className="popup-close" onClick={onClose}>
                  <img src="/img/close-pop.svg" alt="" />
                </div>

                <form action="" ref={form} onSubmit={EditHelperPeopleSubmit}>
                  <h2>Изменить данные</h2>
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
                    label="Новый пароль (оставьте пустым, чтобы не менять)"
                    placeholder="Новый пароль"
                    name="password"
                    type="password"
                    showAllErrors
                    formRef={form}
                    rules={[
                      (v) => !v || v.length >= 8,
                      (v) => !v || /[a-z]/.test(v),
                      (v) => !v || /[A-Z]/.test(v),
                      (v) => !v || /\d/.test(v),
                      (v) => !v || /[^A-Za-z0-9]/.test(v),
                      (v) => !v || !/\s/.test(v),
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
                    label="Повторите новый пароль"
                    placeholder="Повторите новый пароль"
                    name="repeat_password"
                    type="password"
                    showAllErrors
                    formRef={form}
                    rules={[
                      (v) => !v || v.length >= 8,
                      (v) => !v || /[a-z]/.test(v),
                      (v) => !v || /[A-Z]/.test(v),
                      (v) => !v || /\d/.test(v),
                      (v) => !v || /[^A-Za-z0-9]/.test(v),
                      (v) => !v || !/\s/.test(v),
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

                  {helperPeople.image_path && !imageDeleted ? (
                    <div className="input-wrap">
                      <span>Фото профиля</span>
                      <div className="photo-profile">
                        <div className="img-wrap">
                          <img
                            src={`${fileHost}${helperPeople.image_path}`}
                            alt=""
                          />
                        </div>
                        <b className="text">
                          {helperPeople.image_path.split("/").pop()}
                        </b>
                        <div
                          className="icon-bas cursor-pointer"
                          onClick={handleDeleteImage}
                        >
                          <img src="/img/delete-Icon-grey.svg" alt="" />
                        </div>
                      </div>
                    </div>
                  ) : (
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
                                : "или оставьте текущий"}
                            </span>
                          </p>
                          <p className="file-types">
                            JPG, PNG или SVG (не более 1 МБ)
                          </p>
                        </div>
                      </label>
                    </div>
                  )}

                  <Button
                    className="green-btn cursor-pointer"
                    type="submit"
                    isLoading={loading}
                    isDisabled={loading}
                  >
                    Сохранить изменения
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

export default EditHelperPeople;
