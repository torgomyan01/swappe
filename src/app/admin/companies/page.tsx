"use client";

import { SITE_URL } from "@/utils/consts";
import AdminMainTemplate from "@/components/layout/admin/admin-main-template";
import { useEffect, useMemo, useState } from "react";
import {
  addToast,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@heroui/react";
import { CheckCircle, MessageSquare, MoreVertical } from "lucide-react";
import Link from "next/link";
import {
  ActionAdminGetCompanies,
  ActionAdminChangeCompanyStatus,
  ActionAdminSendCompanyNotification,
} from "@/app/actions/admin/companies";
import { fileHost } from "@/utils/consts";

type StatusKey = "moderation" | "approved" | "rejected" | "all";

interface CompanyWithRelations {
  id: number;
  user_id: number;
  name: string;
  phone_number: string;
  inn: string;
  city: number;
  industry: number;
  about_us: string;
  image_path: string;
  status: "moderation" | "approved" | "rejected";
  plan: string;
  is_self_employed: boolean;
  user: {
    id: number;
    name: string;
    email: string;
  };
  city_data: {
    id: number;
    name: string;
    name_alt: string;
  };
  industry_data: {
    id: number;
    name: string;
  };
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<CompanyWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusKey>("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [selected, setSelected] = useState<CompanyWithRelations | null>(null);
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
  });

  const statusOptions: { key: StatusKey; label: string }[] = useMemo(
    () => [
      { key: "all", label: "Все" },
      { key: "moderation", label: "На модерации" },
      { key: "approved", label: "Одобренные" },
      { key: "rejected", label: "Не одобренные" },
    ],
    [],
  );

  useEffect(() => {
    fetchCompanies();
  }, [status, page]);

  async function fetchCompanies() {
    setLoading(true);
    const res = await ActionAdminGetCompanies({
      status: status === "all" ? undefined : status,
      search: search.trim() || undefined,
      page,
      pageSize,
    });
    if (res.status === "ok") {
      setCompanies(res.data as any);
      setTotalCount(res.totalCount);
    } else {
      addToast({ title: res.error || "Ошибка загрузки", color: "danger" });
    }
    setLoading(false);
  }

  function openNotification(c: CompanyWithRelations) {
    setSelected(c);
    setNotificationForm({
      title: `Уведомление по компании "${c.name}"`,
      message: "",
    });
    setNotificationOpen(true);
  }

  async function changeStatus(
    c: CompanyWithRelations,
    next: "moderation" | "approved" | "rejected",
  ) {
    const res = await ActionAdminChangeCompanyStatus(c.id, next, c.user_id);
    if (res.status === "ok") {
      addToast({ title: "Статус обновлён", color: "success" });
      fetchCompanies();
    } else {
      addToast({ title: res.error, color: "danger" });
    }
  }

  async function sendNotification() {
    if (
      !selected ||
      !notificationForm.title.trim() ||
      !notificationForm.message.trim()
    ) {
      addToast({ title: "Заполните все поля", color: "danger" });
      return;
    }

    const res = await ActionAdminSendCompanyNotification({
      companyId: selected.id,
      title: notificationForm.title,
      message: notificationForm.message,
    });

    if (res.status === "ok") {
      addToast({ title: "Уведомление отправлено", color: "success" });
      setNotificationOpen(false);
      fetchCompanies();
    } else {
      addToast({ title: res.error, color: "danger" });
    }
  }

  function statusColor(s: string) {
    switch (s) {
      case "approved":
        return "success" as const;
      case "moderation":
        return "warning" as const;
      case "rejected":
        return "danger" as const;
      default:
        return "default" as const;
    }
  }

  function statusLabel(s: string) {
    switch (s) {
      case "approved":
        return "Одобрена";
      case "moderation":
        return "На модерации";
      case "rejected":
        return "Не одобрена";
      default:
        return s;
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <AdminMainTemplate pathname={`/${SITE_URL.ADMIN_COMPANIES}`}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end gap-3 justify-between">
          <h1 className="text-2xl font-semibold">Компании</h1>
          <div className="flex gap-3 w-full md:w-auto">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию/ИНН/телефону"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  fetchCompanies();
                }
              }}
            />
            <Select
              selectedKeys={[status]}
              onSelectionChange={(keys) => {
                const k = Array.from(keys)[0] as StatusKey;
                setStatus(k);
                setPage(1);
              }}
            >
              {statusOptions.map((o) => (
                <SelectItem key={o.key}>{o.label}</SelectItem>
              ))}
            </Select>
            <Button
              color="primary"
              onPress={() => {
                setPage(1);
                fetchCompanies();
              }}
            >
              Найти
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : (
          <Table aria-label="Companies table" className="min-h-[400px]">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Название</TableColumn>
              <TableColumn>Пользователь</TableColumn>
              <TableColumn>ИНН</TableColumn>
              <TableColumn>Город</TableColumn>
              <TableColumn>Отрасль</TableColumn>
              <TableColumn>Статус</TableColumn>
              <TableColumn>Действия</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Компании не найдены">
              {companies.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {c.image_path && (
                        <Link
                          href={SITE_URL.COMPANY(c.id)}
                          target="_blank"
                          className="min-w-12 h-12 rounded object-cover relative overflow-hidden group"
                        >
                          <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <i className="fa-light fa-arrow-up-right text-white"></i>
                          </div>
                          <img
                            src={
                              c.image_path.startsWith("http")
                                ? c.image_path
                                : `${fileHost}${c.image_path}`
                            }
                            alt={c.name}
                            className="w-12 h-12 rounded object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </Link>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">{c.name}</span>
                        {c.is_self_employed && (
                          <span className="text-xs text-gray-500">
                            Самозанятый
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{c.user?.name}</span>
                      <span className="text-xs text-gray-500">
                        {c.user?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{c.inn || "-"}</TableCell>
                  <TableCell>{c.city_data?.name || "-"}</TableCell>
                  <TableCell>{c.industry_data?.name || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={statusColor(c.status)}
                      variant="flat"
                    >
                      {statusLabel(c.status)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      {c.status === "moderation" && (
                        <>
                          <Button
                            size="sm"
                            color="success"
                            variant="flat"
                            startContent={<CheckCircle className="w-4 h-4" />}
                            onPress={() => changeStatus(c, "approved")}
                          >
                            Одобрить
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            onPress={() => changeStatus(c, "rejected")}
                          >
                            Отклонить
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        color="warning"
                        variant="flat"
                        startContent={<MessageSquare className="w-4 h-4" />}
                        onPress={() => openNotification(c)}
                      >
                        Уведомить
                      </Button>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Company actions">
                          {c.status !== "approved" ? (
                            <DropdownItem
                              key="approve"
                              startContent={<CheckCircle className="w-4 h-4" />}
                              onPress={() => changeStatus(c, "approved")}
                            >
                              Одобрить
                            </DropdownItem>
                          ) : null}
                          {c.status !== "rejected" ? (
                            <DropdownItem
                              key="reject"
                              className="text-danger"
                              color="danger"
                              onPress={() => changeStatus(c, "rejected")}
                            >
                              Отклонить
                            </DropdownItem>
                          ) : null}
                          {c.status !== "moderation" ? (
                            <DropdownItem
                              key="to-moderation"
                              onPress={() => changeStatus(c, "moderation")}
                            >
                              На модерацию
                            </DropdownItem>
                          ) : null}
                          <DropdownItem
                            key="notify"
                            startContent={<MessageSquare className="w-4 h-4" />}
                            onPress={() => openNotification(c)}
                          >
                            Уведомить пользователя
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Всего: {totalCount} • Страница {page} из {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              isDisabled={page <= 1}
              onPress={() => setPage((p) => Math.max(1, p - 1))}
            >
              Назад
            </Button>
            <Button
              isDisabled={page >= totalPages}
              onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Вперёд
            </Button>
          </div>
        </div>

        {/* Notification Modal */}
        <Modal
          isOpen={notificationOpen}
          onOpenChange={setNotificationOpen}
          size="2xl"
        >
          <ModalContent>
            <ModalHeader>Отправить уведомление</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Компания:</div>
                  <div className="font-medium">{selected?.name}</div>
                  <div className="text-sm text-gray-500">
                    Пользователь: {selected?.user?.name} (
                    {selected?.user?.email})
                  </div>
                </div>
                <Input
                  label="Заголовок уведомления"
                  placeholder="Введите заголовок"
                  value={notificationForm.title}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      title: e.target.value,
                    })
                  }
                />
                <Textarea
                  label="Сообщение"
                  placeholder="Введите сообщение для пользователя"
                  value={notificationForm.message}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      message: e.target.value,
                    })
                  }
                  minRows={4}
                />
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-sm text-yellow-800">
                    <strong>Внимание:</strong> Это уведомление будет отправлено
                    владельцу компании через push notification.
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() => setNotificationOpen(false)}
              >
                Отмена
              </Button>
              <Button
                color="warning"
                onPress={sendNotification}
                isDisabled={
                  !notificationForm.title.trim() ||
                  !notificationForm.message.trim()
                }
              >
                Отправить уведомление
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </AdminMainTemplate>
  );
}
