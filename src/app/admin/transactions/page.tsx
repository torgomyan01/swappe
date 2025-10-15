"use client";

import AdminMainTemplate from "@/components/layout/admin/admin-main-template";
import { SITE_URL } from "@/utils/consts";
import { useEffect, useMemo, useState } from "react";
import {
  addToast,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Copy } from "lucide-react";
import {
  ActionAdminExportPaymentsCSV,
  ActionAdminGetPayments,
  ActionAdminGetPaymentsStats,
} from "@/app/actions/admin/payments";

type PaymentStatusKey = "all" | IPayment["status"];

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<
    (IPayment & { user?: { id: number; email: string; name: string } })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [status, setStatus] = useState<PaymentStatusKey>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    failed: 0,
    sumTotal: 0,
    sumPaid: 0,
    avgPaid: 0,
  });

  const statusOptions: { key: PaymentStatusKey; label: string }[] = useMemo(
    () => [
      { key: "all", label: "Все статусы" },
      { key: "paid", label: "Оплачено" },
      { key: "pending", label: "В ожидании" },
      { key: "failed", label: "Ошибка" },
    ],
    [],
  );

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [status, page]);

  async function fetchPayments() {
    setLoading(true);
    const res = await ActionAdminGetPayments({
      status,
      userSearch: userSearch.trim() || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      page,
      pageSize,
    });
    if (res.status === "ok") {
      setPayments(res.data as any);
      setTotalCount(res.totalCount || 0);
    } else {
      addToast({ title: res.error || "Ошибка загрузки", color: "danger" });
    }
    setLoading(false);
  }

  async function fetchStats() {
    const res = await ActionAdminGetPaymentsStats({
      status,
      userSearch: userSearch.trim() || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    });
    if (res.status === "ok") {
      setStats(res.data as any);
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  function statusColor(s: IPayment["status"]) {
    switch (s) {
      case "paid":
        return "success" as const;
      case "pending":
        return "warning" as const;
      case "failed":
        return "danger" as const;
      default:
        return "default" as const;
    }
  }

  async function handleSearch() {
    setPage(1);
    await fetchPayments();
    await fetchStats();
  }

  async function handleExport() {
    const res = await ActionAdminExportPaymentsCSV({
      status,
      userSearch: userSearch.trim() || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    });
    if (res.status === "ok" && typeof res.data === "string") {
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fname = `payments_export_${new Date().toISOString().slice(0, 10)}.csv`;
      a.download = fname;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast({ title: "Экспортировано", color: "success" });
    } else {
      addToast({ title: res.error || "Ошибка экспорта", color: "danger" });
    }
  }

  return (
    <AdminMainTemplate pathname={`/${SITE_URL.ADMIN_TRANSACTIONS}`}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end gap-3 justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Сделки и платежи</h1>
            <p className="text-sm text-default-500 mt-1">
              Просматривайте все платежи по сайту, фильтруйте и экспортируйте.
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Input
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Поиск пользователя (email, имя)"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <Select
              selectedKeys={[status]}
              onSelectionChange={(keys) => {
                const k = Array.from(keys)[0] as PaymentStatusKey;
                setStatus(k);
                setPage(1);
              }}
            >
              {statusOptions.map((o) => (
                <SelectItem key={o.key}>{o.label}</SelectItem>
              ))}
            </Select>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
            <Button color="primary" onPress={handleSearch}>
              Найти
            </Button>
            <Button onPress={handleExport} variant="flat">
              Экспорт CSV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-default-500">Всего платежей</div>
            <div className="text-2xl font-semibold">{stats.total}</div>
          </div>
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-default-500">Оплачено</div>
            <div className="text-2xl font-semibold">{stats.paid}</div>
          </div>
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-default-500">Ожидают</div>
            <div className="text-2xl font-semibold">{stats.pending}</div>
          </div>
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-default-500">Ошибки</div>
            <div className="text-2xl font-semibold">{stats.failed}</div>
          </div>
          <div className="p-4 rounded-lg border border-gray-200 md:col-span-2">
            <div className="text-sm text-default-500">Сумма всех</div>
            <div className="text-2xl font-semibold">{stats.sumTotal} ₽</div>
          </div>
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-default-500">Сумма оплаченных</div>
            <div className="text-2xl font-semibold">{stats.sumPaid} ₽</div>
          </div>
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-default-500">Средний чек (оплач.)</div>
            <div className="text-2xl font-semibold">{stats.avgPaid} ₽</div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : (
          <Table aria-label="Payments table" className="min-h-[400px]">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Пользователь</TableColumn>
              <TableColumn>Сумма</TableColumn>
              <TableColumn>Статус</TableColumn>
              <TableColumn>Payment ID</TableColumn>
              <TableColumn>Дата</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Платежи не найдены">
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{p.user?.name}</span>
                      <span className="text-xs text-gray-500">
                        {p.user?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{p.amount} ₽</TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={statusColor(p.status)}
                      variant="flat"
                    >
                      {p.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className="truncate max-w-[220px]"
                        title={p.payment_id}
                      >
                        {p.payment_id}
                      </span>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        aria-label="Скопировать payment_id"
                        onPress={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              String(p.payment_id || ""),
                            );
                            addToast({
                              title: "Скопировано",
                              color: "success",
                            });
                          } catch {
                            addToast({
                              title: "Не удалось скопировать",
                              color: "danger",
                            });
                          }
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(
                      p.created_at as unknown as string,
                    ).toLocaleString()}
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
      </div>
    </AdminMainTemplate>
  );
}
