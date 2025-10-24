"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { fileHost, SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { sliceText } from "@/utils/helpers";
import {
  Alert,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  Switch,
  Tooltip,
} from "@heroui/react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { ActionGetMyPushNotifications } from "@/app/actions/push-notification/get-my-notofication";
import { ActionChangeWritedPushNotification } from "@/app/actions/push-notification/change-writed";
import { ActionGetUnreadMessageCount } from "@/app/actions/chat/get-unread-count";
import { useWebSocket } from "@/contexts/websocket-context";
import EmptyRes from "../empty-res/empty-res";

function Navbar() {
  const { data: session } = useSession();
  const company = useSelector((state: IUserStore) => state.userInfo.company);
  const searchParams = useSearchParams();
  const search = searchParams.get("value");
  const [notifications, setNotifications] = useState<boolean>(false);
  const { onMessage, offMessage } = useWebSocket();

  const [notificationsData, setNotificationsData] = useState<
    IPushNotification[]
  >([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState<number>(0);

  useEffect(() => {
    getNotificationColor();
    getUnreadMessageCount();
    setInterval(getNotificationColor, 10000);
    setInterval(getUnreadMessageCount, 60000); // Check every 60 seconds
  }, []);

  // Handle WebSocket messages to update unread count
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleWebSocketMessage = (data: any) => {
      if (data.type === "MESSAGE") {
        // Debounce the unread count refresh to prevent too many API calls
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          getUnreadMessageCount();
        }, 1000); // Wait 1 second before refreshing
      }
    };

    onMessage(handleWebSocketMessage);

    return () => {
      offMessage(handleWebSocketMessage);
      clearTimeout(timeoutId);
    };
  }, [onMessage, offMessage]);

  function getNotificationColor() {
    ActionGetMyPushNotifications().then(({ data }) => {
      setNotificationsData(data as IPushNotification[]);
    });
  }

  function getUnreadMessageCount() {
    ActionGetUnreadMessageCount().then(({ data }) => {
      setUnreadMessageCount(data as number);
    });
  }

  const [onlyNew, setOnlyNew] = useState(false);

  useEffect(() => {
    const onlyNew = localStorage.getItem("onlyNewNotifications");
    if (onlyNew) {
      setOnlyNew(onlyNew === "1");
    }
  }, []);

  const push = notificationsData.filter(
    (notification) => notification.opened === false,
  );

  const [isLoading, setIsLoading] = useState(false);

  function handleChangeWritedPushNotification() {
    const ids = push.map((notification) => notification.id);
    setIsLoading(true);
    ActionChangeWritedPushNotification(ids).then(() => {
      getNotificationColor();
      setIsLoading(false);
    });
  }

  function handleOpenNotification(id: number) {
    ActionChangeWritedPushNotification([id]).then(() => {
      getNotificationColor();
    });
  }

  function handleChangeOnlyNew(value: boolean) {
    setOnlyNew(value);

    localStorage.setItem("onlyNewNotifications", value ? "1" : "0");
  }

  const filteredNotifications = notificationsData.filter((notification) =>
    onlyNew ? notification.opened === false : true,
  );

  return (
    <>
      <div className="header-profile">
        <div className="wrapper">
          <Link href={SITE_URL.HOME} className="logo">
            <img src="/img/black-logo.svg" alt="" />
          </Link>
          <form className="search" action={SITE_URL.SEARCH}>
            <input
              type="text"
              placeholder="Введи запрос"
              name="value"
              defaultValue={search || ""}
            />
            <button type="button">
              <img src="/img/search-icon.svg" alt="" />
            </button>
          </form>
          <div className="icons">
            <Tooltip content="Создать предложение">
              <Link href={SITE_URL.ACCOUNT_OFFER_CREATE}>
                <span className="icon cursor-pointer">
                  <img src="/img/menu-icon1.svg" alt="" />
                </span>
              </Link>
            </Tooltip>
            <Tooltip content="Уведомления">
              <span
                className="icon cursor-pointer"
                onClick={() => setNotifications(!notifications)}
              >
                {push.length ? <span className="circle" /> : null}
                <img src="/img/menu-icon2.svg" alt="" />
              </span>
            </Tooltip>
            <Tooltip content="Избранное">
              <Link
                href={SITE_URL.ACCOUNT_FAVORITES}
                className="icon cursor-pointer"
              >
                <img src="/img/menu-icon3.svg" alt="" />
              </Link>
            </Tooltip>
            <Tooltip content="Сделки">
              <Link
                href={SITE_URL.ACCOUNT_TRANSACTIONS}
                className="icon cursor-pointer"
              >
                <img src="/img/menu-icon4.svg" alt="" />
              </Link>
            </Tooltip>
            <Tooltip content="Сообщения">
              <Link href={SITE_URL.CHAT} className="icon cursor-pointer">
                {unreadMessageCount > 0 && (
                  <span className="count">+{unreadMessageCount}</span>
                )}
                <img src="/img/menu-icon5.svg" alt="" />
              </Link>
            </Tooltip>
          </div>
          {session ? (
            <Dropdown>
              <DropdownTrigger>
                <div className="user-in cursor-pointer">
                  <span>{sliceText(session.user?.name || "", 10, ".")}</span>
                  {company && (
                    <div className="avatar">
                      <img src={`${fileHost}${company.image_path}`} alt="" />
                    </div>
                  )}
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem href={SITE_URL.ACCOUNT} key="accout">
                  Профиль
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-danger"
                  onPress={() => signOut()}
                  color="danger"
                >
                  Выход
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Link href={SITE_URL.LOGIN} className="user cursor-pointer">
              <img src="/img/user-icon.svg" alt="user icon" />
            </Link>
          )}
        </div>
      </div>

      <div className="wrapper">
        <div className="mobile-icons">
          <Link href={SITE_URL.ACCOUNT_OFFER_CREATE} className="icon">
            <img src="/img/menu-icon1.svg" alt="" />
          </Link>
          <span
            className="icon"
            onClick={() => setNotifications(!notifications)}
          >
            <img src="/img/menu-icon2.svg" alt="" />
          </span>
          <Link href={SITE_URL.ACCOUNT_FAVORITES} className="icon">
            <img src="/img/menu-icon3.svg" alt="" />
          </Link>
          <Link href={SITE_URL.ACCOUNT_TRANSACTIONS} className="icon">
            <img src="/img/menu-icon4.svg" alt="" />
          </Link>
          <Link href={SITE_URL.CHAT} className="icon">
            {unreadMessageCount > 0 && (
              <span className="count text-[11px]">+{unreadMessageCount}</span>
            )}
            <img src="/img/menu-icon5.svg" alt="" />
          </Link>
        </div>
      </div>

      <div className="notifications-wrapper">
        {notifications && (
          <div
            className="fixed top-0 left-0 w-full h-full z-1"
            onClick={() => setNotifications(false)}
          />
        )}
        <div
          className={clsx("notifications", {
            show: notifications,
          })}
        >
          <div className="top-mob">
            <span className="back" onClick={() => setNotifications(false)}>
              <img src="/img/back-left.svg" alt="" />
            </span>
            <b>Уведомления</b>
          </div>
          <div className="top-line">
            <b>Уведомления</b>
            <Switch
              color="secondary"
              aria-label="Только новые"
              onValueChange={handleChangeOnlyNew}
              isSelected={onlyNew}
            />
          </div>
          {push.length > 0 && (
            <div
              className="view-all cursor-pointer flex-jc-c gap-2"
              onClick={handleChangeWritedPushNotification}
            >
              Пометить все просмотренными ({push.length})
              {isLoading && <Spinner color="secondary" size="sm" />}
            </div>
          )}

          <div className="px-4">
            {filteredNotifications.length ? (
              <>
                {filteredNotifications.map((notification) => (
                  <div key={`notification-${notification.id}`}>
                    <Alert
                      color={notification.type as PushNotificationType}
                      title={notification.title}
                      description={notification.description}
                      className="mb-2"
                      variant="faded"
                      endContent={
                        <Button
                          as={Link}
                          href={notification.link}
                          target="_blank"
                          size="sm"
                          variant="faded"
                          className="!flex-jc-c min-w-[90px]"
                          onPress={() =>
                            handleOpenNotification(notification.id)
                          }
                        >
                          Открыть <i className="fa-solid fa-arrow-right"></i>
                        </Button>
                      }
                    />
                  </div>
                ))}
              </>
            ) : (
              <EmptyRes title="Уведомлений нет" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
