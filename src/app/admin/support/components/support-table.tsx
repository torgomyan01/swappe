"use client";

import Link from "next/link";
import {
  Avatar,
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { SITE_URL } from "@/utils/consts";

type SupportUser = {
  id: number | string;
  name?: string | null;
  email?: string | null;
};

type SupportMessage = {
  id: number | string;
  content: string;
  created_at?: string | null; // ISO string for client safety
};

type SupportChat = {
  id: number | string;
  user?: SupportUser | null;
  messages?: SupportMessage[];
  unread_count?: number;
};

export default function SupportTable({ chats }: { chats: SupportChat[] }) {
  // Разделяем чаты на непрочитанные и прочитанные
  const unreadChats = chats.filter((c) => c.unread_count && c.unread_count > 0);
  const readChats = chats.filter(
    (c) => !c.unread_count || c.unread_count === 0,
  );

  const renderTableRows = (chatList: SupportChat[]) => {
    return chatList.map((c) => {
      const last = c.messages?.[0];
      const updated = last?.created_at ? new Date(last.created_at) : null;
      const initial = (
        c.user?.name?.[0] ||
        c.user?.id?.toString()?.[0] ||
        "U"
      ).toUpperCase();
      const hasUnread = c.unread_count && c.unread_count > 0;

      return (
        <TableRow
          key={String(c.id)}
          className={`hover:bg-default-50 ${
            hasUnread ? "bg-success-50/30" : ""
          }`}
        >
          <TableCell>
            <div className="flex items-center gap-3 min-w-0">
              <Badge
                content={
                  c.unread_count && c.unread_count > 0
                    ? String(c.unread_count)
                    : undefined
                }
                color="success"
                isInvisible={!c.unread_count}
                placement="bottom-right"
              >
                <Avatar
                  name={initial}
                  className={`${
                    hasUnread
                      ? "bg-success-200 text-success-800 ring-2 ring-success-400"
                      : "bg-default-200 text-default-700"
                  }`}
                  size="sm"
                />
              </Badge>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">
                  {c.user?.name || `#${c.user?.id}`}
                </div>
                <div className="text-xs text-default-500 truncate">
                  ID: {c.user?.id}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="text-sm text-default-700 whitespace-nowrap">
            {c.user?.email || "—"}
          </TableCell>
          <TableCell>
            <div
              className={`text-sm line-clamp-1 max-w-[520px] ${
                hasUnread
                  ? "font-semibold text-default-900"
                  : "text-default-700"
              }`}
            >
              {last?.content || "—"}
            </div>
          </TableCell>
          <TableCell className="text-sm text-default-500 whitespace-nowrap">
            {updated ? updated.toLocaleString() : "—"}
          </TableCell>
          <TableCell>
            <div className="flex justify-end">
              <Link href={`/${SITE_URL.ADMIN_SUPPORT}/${c.id}`}>
                <Button
                  color={hasUnread ? "success" : "default"}
                  variant={hasUnread ? "solid" : "flat"}
                  className="flex-jc-c"
                  size="sm"
                  startContent={<i className="fa-solid fa-message" />}
                >
                  Открыть
                </Button>
              </Link>
            </div>
          </TableCell>
        </TableRow>
      );
    });
  };

  const allEmpty = chats.length === 0;
  const unreadEmpty = unreadChats.length === 0;
  const readEmpty = readChats.length === 0;

  return (
    <div className="space-y-6">
      {/* Секция непрочитанных чатов */}
      {!unreadEmpty && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-success-100 text-success-800 rounded-lg">
              <i className="fa-solid fa-envelope-circle-check text-sm" />
              <span className="text-sm font-semibold">
                Непрочитанные сообщения
              </span>
              <Badge
                content={String(unreadChats.length)}
                color="success"
                size="sm"
              >
                <span />
              </Badge>
            </div>
          </div>
          <div className="rounded-xl border-2 border-success-300 bg-white shadow-sm overflow-hidden">
            <Table
              aria-label="Непрочитанные чаты поддержки"
              removeWrapper
              classNames={{
                thead: "bg-success-50 sticky top-0 z-10",
                td: "align-middle",
              }}
            >
              <TableHeader>
                <TableColumn>Пользователь</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Последнее сообщение</TableColumn>
                <TableColumn>Обновлено</TableColumn>
                <TableColumn className="text-right">Действия</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Нет непрочитанных сообщений">
                {unreadChats.length > 0 ? renderTableRows(unreadChats) : []}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Секция прочитанных чатов */}
      {!readEmpty && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-default-100 text-default-700 rounded-lg">
              <i className="fa-solid fa-envelope-open text-sm" />
              <span className="text-sm font-medium">Прочитанные сообщения</span>
              <span className="text-xs text-default-500">
                ({readChats.length})
              </span>
            </div>
          </div>
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden border-black/20">
            <Table
              aria-label="Прочитанные чаты поддержки"
              removeWrapper
              classNames={{
                thead: "bg-default-50 sticky top-0 z-10",
                td: "align-middle",
              }}
            >
              <TableHeader>
                <TableColumn>Пользователь</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Последнее сообщение</TableColumn>
                <TableColumn>Обновлено</TableColumn>
                <TableColumn className="text-right">Действия</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Нет прочитанных сообщений">
                {readChats.length > 0 ? renderTableRows(readChats) : []}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Пустое состояние, если нет чатов вообще */}
      {allEmpty && (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden border-black/20">
          <div className="py-10">
            <div className="flex flex-col items-center justify-center text-center gap-3">
              <img
                src="/img/icons/icon-support.svg"
                alt="Support"
                className="h-20 w-20 object-contain opacity-80"
              />
              <div className="text-base font-medium text-default-700">
                Нет доступных чатов поддержки
              </div>
              <div className="text-sm text-default-500">
                Когда пользователи свяжутся с поддержкой, они появятся здесь.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
