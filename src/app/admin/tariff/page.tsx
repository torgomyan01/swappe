"use client";

import { useEffect, useState, useCallback } from "react";
import { addToast, Button } from "@heroui/react";
import {
  ActionDeleteTariff,
  ActionGetTariffs,
  ActionSaveTariffs,
} from "@/app/actions/admin/tariff";
import AdminMainTemplate from "@/components/layout/admin/admin-main-template";
import { SITE_URL } from "@/utils/consts";
import TariffCard from "@/components/layout/admin/tariff-card";

type Tariff = Omit<ITariff, "name"> & { name: string; description?: string };

export default function AdminHomePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);

  async function fetchTariffs() {
    try {
      setLoading(true);
      const res = await ActionGetTariffs();
      if (res.status === "ok") {
        setTariffs(res.data as Tariff[]);
      } else {
        addToast({
          title: res.error || "Ошибка при загрузке",
          color: "danger",
        });
      }
    } catch {
      addToast({ title: "Ошибка при загрузке", color: "danger" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTariffs();
  }, []);

  const onChangeField = useCallback(
    (idx: number, field: keyof Tariff, value: any) => {
      setTariffs((prev) => {
        const next = [...prev];
        const current = next[idx];
        next[idx] = { ...current, [field]: value } as Tariff;
        return next;
      });
    },
    [],
  );

  const addTariff = useCallback(() => {
    setTariffs((prev) => [
      ...prev,
      {
        name: "basic",
        price: 0,
        title: "Базовый",
        supportText: [""],
        description: "",
      },
    ]);
  }, []);

  const saveAll = useCallback(async () => {
    try {
      setSaving(true);
      const res = await ActionSaveTariffs(tariffs);
      if (res.status === "ok") {
        addToast({ title: "Сохранено", color: "success" });
        fetchTariffs();
      } else {
        addToast({
          title: res.error || "Не удалось сохранить",
          color: "danger",
        });
      }
    } catch {
      addToast({ title: "Ошибка при сохранении", color: "danger" });
    } finally {
      setSaving(false);
    }
  }, [tariffs]);

  const removeOne = useCallback(async (name: string) => {
    try {
      const res = await ActionDeleteTariff(name);
      if (res.status === "ok") {
        addToast({ title: "Удалено", color: "success" });
        setTariffs((prev) => prev.filter((t) => t.name !== name));
      } else {
        addToast({ title: res.error || "Не удалось удалить", color: "danger" });
      }
    } catch {
      addToast({ title: "Ошибка при удалении", color: "danger" });
    }
  }, []);

  const addSupportItem = useCallback((tIndex: number) => {
    setTariffs((prev) => {
      const next = [...prev];
      const current = next[tIndex];
      const list = Array.isArray(current.supportText)
        ? [...current.supportText]
        : [];
      list.push("");
      next[tIndex] = { ...current, supportText: list } as Tariff;
      return next;
    });
  }, []);

  const removeSupportItem = useCallback((tIndex: number, sIndex: number) => {
    setTariffs((prev) => {
      const next = [...prev];
      const current = next[tIndex];
      const list = Array.isArray(current.supportText)
        ? [...current.supportText]
        : [];
      list.splice(sIndex, 1);
      next[tIndex] = { ...current, supportText: list } as Tariff;
      return next;
    });
  }, []);

  const changeSupportItem = useCallback(
    (tIndex: number, sIndex: number, value: string) => {
      setTariffs((prev) => {
        const next = [...prev];
        const current = next[tIndex];
        const list = Array.isArray(current.supportText)
          ? [...current.supportText]
          : [];
        list[sIndex] = value;
        next[tIndex] = { ...current, supportText: list } as Tariff;
        return next;
      });
    },
    [],
  );

  return (
    <AdminMainTemplate pathname={`/${SITE_URL.ADMIN_TARIFF}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Тарифы</h1>
          <div className="flex items-center gap-2">
            <Button color="default" variant="flat" onPress={addTariff}>
              Добавить тариф
            </Button>
            <Button color="secondary" isLoading={saving} onPress={saveAll}>
              Сохранить все
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="loading loading-spinner loading-sm" /> Загрузка...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tariffs.map((t, idx) => (
              <TariffCard
                key={`${t.name}-${idx}`}
                tariff={t}
                index={idx}
                onChangeField={onChangeField}
                onAddSupport={addSupportItem}
                onRemoveSupport={removeSupportItem}
                onChangeSupport={changeSupportItem}
                onDelete={removeOne}
              />
            ))}
          </div>
        )}
      </div>
    </AdminMainTemplate>
  );
}
