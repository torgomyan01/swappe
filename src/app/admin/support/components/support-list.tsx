"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Checkbox, Input, Tooltip } from "@heroui/react";
import { ActionAdminListSupportChats } from "@/app/actions/support/admin-list-chats";
import SupportTable from "./support-table";

type SupportUser = {
  id: number | string;
  name?: string | null;
  email?: string | null;
};

type SupportMessage = {
  id: number | string;
  content: string;
  created_at?: string | null;
};

type SupportChat = {
  id: number | string;
  user?: SupportUser | null;
  messages?: SupportMessage[];
  unread_count?: number;
};

const LS_ENABLED_KEY = "adminSupportAutoRefreshEnabled";
const LS_INTERVAL_KEY = "adminSupportRefreshIntervalMs";

export default function SupportList({
  initialChats,
}: {
  initialChats: SupportChat[];
}) {
  const [chats, setChats] = useState<SupportChat[]>(initialChats || []);
  const [loading, setLoading] = useState(false);
  const [autoEnabled, setAutoEnabled] = useState<boolean>(false);
  const [intervalMs, setIntervalMs] = useState<number>(60000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const saveSettings = useCallback((enabled: boolean, ms: number) => {
    try {
      localStorage.setItem(LS_ENABLED_KEY, JSON.stringify(enabled));
      localStorage.setItem(LS_INTERVAL_KEY, JSON.stringify(ms));
    } catch {}
  }, []);

  const readSettings = useCallback(() => {
    try {
      const enabledRaw = localStorage.getItem(LS_ENABLED_KEY);
      const intervalRaw = localStorage.getItem(LS_INTERVAL_KEY);
      const enabledParsed = enabledRaw ? JSON.parse(enabledRaw) : false;
      const intervalParsed = intervalRaw ? JSON.parse(intervalRaw) : 60000;
      return {
        enabled: Boolean(enabledParsed),
        ms: Number(intervalParsed) > 0 ? Number(intervalParsed) : 60000,
      };
    } catch {
      return { enabled: false, ms: 60000 };
    }
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (ms: number) => {
      stopTimer();
      intervalRef.current = setInterval(() => {
        refresh();
      }, ms);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ActionAdminListSupportChats();
      const data: any[] = res.status === "ok" ? (res.data as any[]) : [];
      const normalized = data.map((c: any) => ({
        ...c,
        messages:
          c?.messages?.map((m: any) => ({
            ...m,
            created_at: m?.created_at
              ? new Date(m.created_at).toISOString()
              : null,
          })) || [],
      }));
      setChats(normalized);
    } finally {
      setLoading(false);
    }
  }, []);

  // Init settings from localStorage on mount
  useEffect(() => {
    const { enabled, ms } = readSettings();
    setAutoEnabled(enabled);
    setIntervalMs(ms);
    if (enabled) startTimer(ms);
    return () => stopTimer();
  }, [readSettings, startTimer, stopTimer]);

  // When toggling auto refresh
  const onToggleAuto = useCallback(
    (checked: boolean) => {
      setAutoEnabled(checked);
      saveSettings(checked, intervalMs);
      if (checked) startTimer(intervalMs);
      else stopTimer();
    },
    [intervalMs, saveSettings, startTimer, stopTimer],
  );

  // When changing interval
  const onChangeInterval = useCallback((value: string) => {
    const num = Number(value);
    if (Number.isFinite(num) && num >= 5000) {
      setIntervalMs(num);
    }
  }, []);

  const onApplyInterval = useCallback(() => {
    saveSettings(autoEnabled, intervalMs);
    if (autoEnabled) startTimer(intervalMs);
  }, [autoEnabled, intervalMs, saveSettings, startTimer]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Техническая поддержка</h1>
          <p className="text-sm text-gray-500 mt-1">
            Всего чатов:{" "}
            <span className="font-medium text-gray-700">{chats.length}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            color="success"
            variant="solid"
            size="sm"
            isLoading={loading}
            startContent={<i className="fa-solid fa-rotate" />}
            onPress={refresh}
          >
            Обновить
          </Button>

          <Checkbox
            isSelected={autoEnabled}
            onValueChange={onToggleAuto}
            color="success"
          >
            Авто-обновление
          </Checkbox>

          <Tooltip content="Интервал в миллисекундах (минимум 5000)">
            <Input
              size="sm"
              type="number"
              min={5000}
              step={5000}
              labelPlacement="outside-left"
              aria-label="Интервал (мс)"
              placeholder="60000"
              className="w-40"
              value={String(intervalMs)}
              onValueChange={onChangeInterval}
            />
          </Tooltip>

          <Button size="sm" variant="flat" onPress={onApplyInterval}>
            Применить
          </Button>
        </div>
      </div>

      <SupportTable chats={chats} />
    </div>
  );
}
