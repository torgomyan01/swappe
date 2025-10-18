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
import {
  Edit,
  MoreVertical,
  Trash2,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import {
  ActionAdminGetOffers,
  ActionAdminChangeOfferStatus,
  ActionAdminUpdateOffer,
  ActionAdminDeleteOffer,
  ActionAdminSendNotification,
} from "@/app/actions/admin/offers";
import Link from "next/link";
import { fileHost, SITE_URL as CONST } from "@/utils/consts";

type StatusKey = "active" | "archive" | "moderation" | "all";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<IUserOfferFront[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusKey>("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [selected, setSelected] = useState<IUserOfferFront | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    type: "",
    vid: "",
    price: "",
    description: "",
  });
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
  });

  const statusOptions: { key: StatusKey; label: string }[] = useMemo(
    () => [
      { key: "all", label: "Все" },
      { key: "moderation", label: "На модерации" },
      { key: "active", label: "Активные" },
      { key: "archive", label: "Архив" },
    ],
    [],
  );

  useEffect(() => {
    fetchOffers();
  }, [status, page]);

  async function fetchOffers() {
    setLoading(true);
    const res = await ActionAdminGetOffers({
      status: status === "all" ? undefined : (status as any),
      search: search.trim() || undefined,
      page,
      pageSize,
    });
    if (res.status === "ok") {
      setOffers(res.data as any);
      setTotalCount(res.totalCount);
    } else {
      addToast({ title: res.error || "Ошибка загрузки", color: "danger" });
    }
    setLoading(false);
  }

  function openEdit(o: IUserOfferFront) {
    setSelected(o);
    setEditForm({
      name: o.name,
      type: o.type,
      vid: o.vid,
      price: String(o.price ?? ""),
      description: o.description,
    });
    setEditOpen(true);
  }

  function openDelete(o: IUserOfferFront) {
    setSelected(o);
    setDeleteOpen(true);
  }

  function openNotification(o: IUserOfferFront) {
    setSelected(o);
    setNotificationForm({
      title: `Уведомление по предложению "${o.name}"`,
      message: "",
    });
    setNotificationOpen(true);
  }

  async function saveEdit() {
    if (!selected) return;
    const res = await ActionAdminUpdateOffer({
      id: selected.id,
      name: editForm.name,
      type: editForm.type,
      vid: editForm.vid,
      price: editForm.price ? Number(editForm.price) : undefined,
      description: editForm.description,
    });
    if (res.status === "ok") {
      addToast({ title: "Предложение обновлено", color: "success" });
      setEditOpen(false);
      fetchOffers();
    } else {
      addToast({ title: res.error, color: "danger" });
    }
  }

  async function changeStatus(
    o: IUserOfferFront,
    next: Exclude<StatusKey, "all">,
  ) {
    const res = await ActionAdminChangeOfferStatus(o.id, next);
    if (res.status === "ok") {
      addToast({ title: "Статус обновлён", color: "success" });
      fetchOffers();
    } else {
      addToast({ title: res.error, color: "danger" });
    }
  }

  async function confirmDelete() {
    if (!selected) return;
    const res = await ActionAdminDeleteOffer(selected.id);
    if (res.status === "ok") {
      addToast({ title: "Предложение удалено", color: "success" });
      setDeleteOpen(false);
      fetchOffers();
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

    const res = await ActionAdminSendNotification({
      offerId: selected.id,
      title: notificationForm.title,
      message: notificationForm.message,
    });

    if (res.status === "ok") {
      addToast({ title: "Уведомление отправлено", color: "success" });
      setNotificationOpen(false);
      fetchOffers();
    } else {
      addToast({ title: res.error, color: "danger" });
    }
  }

  function statusColor(s: string) {
    switch (s) {
      case "active":
        return "success" as const;
      case "archive":
        return "default" as const;
      case "moderation":
        return "warning" as const;
      default:
        return "default" as const;
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <AdminMainTemplate pathname={`/${SITE_URL.ADMIN_OFFERS}`}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end gap-3 justify-between">
          <h1 className="text-2xl font-semibold">Предложения</h1>
          <div className="flex gap-3 w-full md:w-auto">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию/описанию"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  fetchOffers();
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
                fetchOffers();
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
          <Table aria-label="Offers table" className="min-h-[400px]">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Название</TableColumn>
              <TableColumn>Пользователь</TableColumn>
              <TableColumn>Цена</TableColumn>
              <TableColumn>Статус</TableColumn>
              <TableColumn>Действия</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Предложения не найдены">
              {offers.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{o.name}</span>
                      <span className="text-xs text-gray-500">
                        {o.type} · {o.vid}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{o.user?.name}</span>
                      <span className="text-xs text-gray-500">
                        {o.user?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{o.price}</TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={statusColor(o.status)}
                      variant="flat"
                    >
                      {o.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      {o.status === "moderation" && (
                        <Button
                          size="sm"
                          color="success"
                          variant="flat"
                          startContent={<CheckCircle className="w-4 h-4" />}
                          onPress={() => changeStatus(o, "active")}
                        >
                          Одобрить
                        </Button>
                      )}
                      <Button
                        size="sm"
                        color="warning"
                        variant="flat"
                        startContent={<MessageSquare className="w-4 h-4" />}
                        onPress={() => openNotification(o)}
                      >
                        Уведомить
                      </Button>
                      <Link href={`${CONST.OFFER}/${o.id}`} target="_blank">
                        <Button size="sm" variant="flat">
                          Открыть
                        </Button>
                      </Link>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Offer actions">
                          <DropdownItem
                            key="edit"
                            startContent={<Edit className="w-4 h-4" />}
                            onPress={() => openEdit(o)}
                          >
                            Редактировать
                          </DropdownItem>
                          <DropdownItem
                            key="notify"
                            startContent={<MessageSquare className="w-4 h-4" />}
                            onPress={() => openNotification(o)}
                          >
                            Уведомить пользователя
                          </DropdownItem>
                          {o.status !== "active" ? (
                            <DropdownItem
                              key="make-active"
                              onPress={() => changeStatus(o, "active")}
                            >
                              Сделать активным
                            </DropdownItem>
                          ) : null}
                          {o.status !== "archive" ? (
                            <DropdownItem
                              key="to-archive"
                              onPress={() => changeStatus(o, "archive")}
                            >
                              В архив
                            </DropdownItem>
                          ) : null}
                          {o.status !== "moderation" ? (
                            <DropdownItem
                              key="to-moderation"
                              onPress={() => changeStatus(o, "moderation")}
                            >
                              На модерацию
                            </DropdownItem>
                          ) : null}
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            startContent={<Trash2 className="w-4 h-4" />}
                            onPress={() => openDelete(o)}
                          >
                            Удалить
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

        {/* Edit Modal */}
        <Modal isOpen={editOpen} onOpenChange={setEditOpen} size="2xl">
          <ModalContent>
            <ModalHeader>Редактировать предложение</ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Название"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
                <Select
                  label="Тип"
                  selectedKeys={[editForm.type]}
                  onSelectionChange={(keys) =>
                    setEditForm({
                      ...editForm,
                      type: Array.from(keys)[0] as string,
                    })
                  }
                >
                  <SelectItem key="product">Товар</SelectItem>
                  <SelectItem key="service">Услуга</SelectItem>
                </Select>
                <Select
                  label="Вид"
                  selectedKeys={[editForm.vid]}
                  onSelectionChange={(keys) =>
                    setEditForm({
                      ...editForm,
                      vid: Array.from(keys)[0] as string,
                    })
                  }
                >
                  <SelectItem key="online">Онлайн</SelectItem>
                  <SelectItem key="offline">Оффлайн</SelectItem>
                </Select>
                <Input
                  label="Цена"
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                />
                <div className="col-span-2">
                  <Textarea
                    label="Описание"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                  />
                </div>
                {selected?.images &&
                Array.isArray(selected.images) &&
                selected.images.length > 0 ? (
                  <div className="col-span-2">
                    <div className="mb-2 text-sm text-gray-600">
                      Изображения
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {selected.images.map((src, idx) => {
                        const full =
                          typeof src === "string" &&
                          (src.startsWith("http") ? src : `${fileHost}${src}`);
                        return (
                          <div
                            key={idx}
                            className="aspect-square w-full overflow-hidden rounded-md border"
                          >
                            <img
                              src={full as string}
                              alt="offer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setEditOpen(false)}>
                Отмена
              </Button>
              <Button color="primary" onPress={saveEdit}>
                Сохранить
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Modal */}
        <Modal isOpen={deleteOpen} onOpenChange={setDeleteOpen}>
          <ModalContent>
            <ModalHeader>Удалить предложение</ModalHeader>
            <ModalBody>
              Вы уверены, что хотите удалить «{selected?.name}»? Это действие
              нельзя отменить.
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setDeleteOpen(false)}>
                Отмена
              </Button>
              <Button color="danger" onPress={confirmDelete}>
                Удалить
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

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
                  <div className="text-sm text-gray-600 mb-1">Предложение:</div>
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
                    <strong>Внимание:</strong> После отправки уведомления статус
                    предложения будет изменен на "На модерации".
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
