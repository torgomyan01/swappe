"use client";

import React, { useEffect, useState } from "react";
import AdminMainTemplate from "@/components/layout/admin/admin-main-template";
import { SITE_URL } from "@/utils/consts";
import {
  ActionAdminGetReviewReports,
  ActionAdminResolveReviewReport,
  ActionAdminSendReviewNotification,
} from "@/app/actions/admin/review-reports";
import {
  Button,
  Select,
  SelectItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Divider,
  Input,
  Textarea,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

export default function AdminReviewReportsPage() {
  const [status, setStatus] = useState<"pending" | "resolved" | "all">(
    "pending",
  );
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [notifyState, setNotifyState] = useState<
    Record<
      number,
      { recipient: "reviewer" | "reporter"; title: string; message: string }
    >
  >({});
  const [modalId, setModalId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    const res = await ActionAdminGetReviewReports({ status });
    if (res.status === "ok") setItems(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function decide(reportId: number, decision: "delete" | "keep") {
    setLoading(true);
    await ActionAdminResolveReviewReport(reportId, decision);
    await load();
  }

  return (
    <AdminMainTemplate pathname={`/${SITE_URL.ADMIN_REVIEW_REPORTS}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Жалобы на отзывы</h2>
        <Select
          selectedKeys={[status]}
          onChange={(e) => setStatus(e.target.value as any)}
          className="w-48"
          aria-label="Статус"
        >
          <SelectItem key="pending">Ожидают</SelectItem>
          <SelectItem key="resolved">Решенные</SelectItem>
          <SelectItem key="all">Все</SelectItem>
        </Select>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((it) => (
          <Card key={it.id} className="border border-gray-200 shadow-sm">
            <CardHeader className="flex justify-between items-start gap-3">
              <div className="flex flex-col">
                <div className="text-sm text-gray-500">Жалоба #{it.id}</div>
                <div className="text-xs text-gray-400">
                  {it.created_at
                    ? new Date(it.created_at).toLocaleString()
                    : null}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Chip
                  color={it.status === "pending" ? "warning" : "success"}
                  variant="flat"
                  size="sm"
                >
                  {it.status === "pending" ? "Ожидает" : "Решена"}
                </Chip>
                {it.review?.status ? (
                  <Chip size="sm" variant="flat">
                    Отзыв: {it.review.status}
                  </Chip>
                ) : null}
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-3">
              <div>
                <span className="text-sm font-medium">Причина: </span>
                <span className="text-sm">{it.reason}</span>
              </div>
              {it.details ? (
                <div>
                  <span className="text-sm font-medium">Описание: </span>
                  <span className="text-sm text-gray-700">{it.details}</span>
                </div>
              ) : null}
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <div className="text-xs text-gray-500 mb-1">
                  Отзыв #{it.review?.id}
                </div>
                <div className="text-sm leading-relaxed">
                  {it.review?.review}
                </div>
              </div>
              <Divider className="my-2" />
              <div>
                <Button
                  variant="ghost"
                  onPress={() => {
                    if (!notifyState[it.id]) {
                      setNotifyState((s) => ({
                        ...s,
                        [it.id]: {
                          recipient: "reviewer",
                          title: "",
                          message: "",
                        },
                      }));
                    }
                    setModalId(it.id);
                  }}
                >
                  Отправить push-уведомление
                </Button>
              </div>
            </CardBody>
            {it.status === "pending" && (
              <CardFooter className="flex justify-end gap-2">
                <Button
                  color="danger"
                  variant="flat"
                  isDisabled={loading}
                  onPress={() => decide(it.id, "delete")}
                >
                  Удалить отзыв
                </Button>
                <Button
                  color="success"
                  isDisabled={loading}
                  onPress={() => decide(it.id, "keep")}
                >
                  Оставить видимым
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
        {!items.length && !loading && (
          <div className="text-gray-500">Нет данных</div>
        )}
      </div>

      <Modal
        isOpen={modalId !== null}
        onOpenChange={(open) => !open && setModalId(null)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Отправить уведомление</ModalHeader>
              <ModalBody>
                {modalId !== null && (
                  <div className="grid grid-cols-1 gap-3">
                    <Select
                      label="Кому"
                      selectedKeys={[
                        notifyState[modalId]?.recipient || "reviewer",
                      ]}
                      onChange={(e) =>
                        setNotifyState((s) => ({
                          ...s,
                          [modalId]: {
                            recipient: (e.target.value as any) || "reviewer",
                            title: s[modalId]?.title || "",
                            message: s[modalId]?.message || "",
                          },
                        }))
                      }
                    >
                      <SelectItem key="reviewer">Автор отзыва</SelectItem>
                      <SelectItem key="reporter">Жалобщик</SelectItem>
                    </Select>
                    <Input
                      label="Заголовок"
                      value={notifyState[modalId]?.title || ""}
                      onValueChange={(v) =>
                        setNotifyState((s) => ({
                          ...s,
                          [modalId]: {
                            recipient: s[modalId]?.recipient || "reviewer",
                            title: v,
                            message: s[modalId]?.message || "",
                          },
                        }))
                      }
                    />
                    <Textarea
                      label="Сообщение"
                      value={notifyState[modalId]?.message || ""}
                      onValueChange={(v) =>
                        setNotifyState((s) => ({
                          ...s,
                          [modalId]: {
                            recipient: s[modalId]?.recipient || "reviewer",
                            title: s[modalId]?.title || "",
                            message: v,
                          },
                        }))
                      }
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button
                  color="primary"
                  isDisabled={
                    !modalId ||
                    !(
                      notifyState[modalId!]?.title &&
                      notifyState[modalId!]?.message
                    )
                  }
                  isLoading={loading}
                  onPress={async () => {
                    if (!modalId) return;
                    setLoading(true);
                    await ActionAdminSendReviewNotification({
                      reportId: modalId,
                      recipient:
                        (notifyState[modalId]?.recipient as any) || "reviewer",
                      title: notifyState[modalId]?.title || "",
                      message: notifyState[modalId]?.message || "",
                    });
                    setLoading(false);
                    onClose();
                  }}
                >
                  Отправить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </AdminMainTemplate>
  );
}
