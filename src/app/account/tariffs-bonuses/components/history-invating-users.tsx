import { ActionGetMyInvatingUsers } from "@/app/actions/auth/get-my-invating-users";
import EmptyRes from "@/components/common/empty-res/empty-res";
import { fileHost } from "@/utils/consts";
import { Avatar } from "@heroui/react";
import clsx from "clsx";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";

function HistoryInvatingUsers() {
  const [invatingUsers, setInvatingUsers] = useState<IUserProfile[]>([]);

  console.log(invatingUsers);

  useEffect(() => {
    ActionGetMyInvatingUsers().then((res) => {
      if (res.status === "ok") {
        setInvatingUsers(res.data as IUserProfile[]);
      }
    });
  }, []);

  return (
    <>
      <h4>История активаций</h4>
      <div
        className={clsx({
          activate: invatingUsers.length,
        })}
      >
        {invatingUsers.length > 0 ? (
          invatingUsers.map((user) => (
            <div className="item" key={`invating-user-${user.id}`}>
              <div className="img">
                <Avatar
                  isBordered
                  radius="sm"
                  src={`${fileHost}${user.company?.image_path}`}
                  name={user.name}
                  showFallback
                  color="secondary"
                  className="mr-4"
                />
              </div>
              <div className="texts">
                <b>{user.name}</b>
                <span>{moment(user.created_at).format("DD.MM.YYYY")}</span>
              </div>
            </div>
          ))
        ) : (
          <EmptyRes title="Нет активаций" size="sm" />
        )}
      </div>
    </>
  );
}

export default HistoryInvatingUsers;
