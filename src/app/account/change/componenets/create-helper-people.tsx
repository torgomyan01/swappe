import { useEffect, useState } from "react";
import { addToast } from "@heroui/react";
import { fileHost } from "@/utils/consts";
import { ActionGetMyHelperPeople } from "@/app/actions/helper-people/get-my";
import { ActionRemoveHelperPeople } from "@/app/actions/helper-people/remove";
import CreateHelperPeopleModal from "./create-helper-people-modal";
import EditHelperPeople from "./edit-helper-people";

function CreateHelperPeople() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedHelperPeople, setSelectedHelperPeople] =
    useState<IHelperPeople | null>(null);
  const [helperPeople, setHelperPeople] = useState<IHelperPeople[]>([]);

  useEffect(() => {
    getHelperPeople();
  }, []);

  function getHelperPeople() {
    ActionGetMyHelperPeople().then((res) => {
      if (res.status === "ok") {
        setHelperPeople(res.data as IHelperPeople[]);
      }
    });
  }

  function removeHelperPeople(id: number) {
    if (confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      addToast({
        title: "Ждите",
        color: "warning",
      });
      ActionRemoveHelperPeople(id).then((res) => {
        if (res.status === "ok") {
          addToast({
            title: "Пользователь удален",
            color: "success",
          });
          getHelperPeople();
        }
      });
    }
  }

  function handleEditClick(people: IHelperPeople) {
    setSelectedHelperPeople(people);
    setIsEditOpen(true);
  }

  return (
    <>
      <div className="users">
        {helperPeople.map((people) => (
          <div className="user-item" key={people.id}>
            <div className="img-wrap">
              <img src={`${fileHost}${people.image_path}`} alt="" />
            </div>
            <div className="texts">
              <b className="name">{people.name}</b>
              <span>
                {people.role === "manager" ? "Менеджер" : "Администратор"}
              </span>
              <a href={`mailto:${people.email}`}>{people.email}</a>
            </div>
            <div className="icons">
              <a
                href="#"
                className="read-icon"
                onClick={(e) => {
                  e.preventDefault();
                  handleEditClick(people);
                }}
              >
                <img src="/img/edit_menu.svg" alt="" />
              </a>
              <span
                className="delete-icon ml-2 cursor-pointer"
                onClick={() => removeHelperPeople(people.id)}
              >
                <img src="/img/delete-Icon-grey.svg" alt="" />
              </span>
            </div>
          </div>
        ))}

        <div
          className="user-add cursor-pointer"
          onClick={() => setIsCreateOpen(true)}
        >
          <span className="icon">
            <img src="/img/plus-green.svg" alt="" />
          </span>
          <span className="text">Добавить</span>
        </div>
      </div>

      <CreateHelperPeopleModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={getHelperPeople}
      />

      {selectedHelperPeople && (
        <EditHelperPeople
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedHelperPeople(null);
          }}
          helperPeople={selectedHelperPeople}
          onSuccess={getHelperPeople}
        />
      )}
    </>
  );
}

export default CreateHelperPeople;
