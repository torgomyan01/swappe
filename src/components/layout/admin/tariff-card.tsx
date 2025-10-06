"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Textarea,
} from "@heroui/react";

type Tariff = Omit<ITariff, "name"> & { name: string; description?: string };

interface TariffCardProps {
  tariff: Tariff;
  index: number;
  onChangeField: (idx: number, field: keyof Tariff, value: any) => void;
  onAddSupport: (idx: number) => void;
  onRemoveSupport: (idx: number, sIdx: number) => void;
  onChangeSupport: (idx: number, sIdx: number, value: string) => void;
  onDelete: (name: string) => void;
}

function TariffCardBase({
  tariff: t,
  index: idx,
  onChangeField,
  onAddSupport,
  onRemoveSupport,
  onChangeSupport,
  onDelete,
}: TariffCardProps) {
  // Local state for smooth typing
  const [title, setTitle] = useState(t.title);
  const [priceStr, setPriceStr] = useState(String(t.price ?? 0));
  const [description, setDescription] = useState(t.description ?? "");
  const [supportList, setSupportList] = useState<string[]>(t.supportText ?? []);

  // Sync local state when tariff prop changes (e.g., after save/fetch)
  useEffect(() => {
    setTitle(t.title);
    setPriceStr(String(t.price ?? 0));
    setDescription(t.description ?? "");
    setSupportList(Array.isArray(t.supportText) ? t.supportText : []);
  }, [t.title, t.price, t.description, t.supportText]);

  // Debounce helpers
  const debounceRef = useRef<number | null>(null);
  const schedule = (fn: () => void) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(fn, 200);
  };

  // Propagate changes debounced
  useEffect(() => {
    schedule(() => onChangeField(idx, "title", title));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  useEffect(() => {
    const num = Number(priceStr || 0);
    schedule(() => onChangeField(idx, "price", Number.isFinite(num) ? num : 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceStr]);

  useEffect(() => {
    schedule(() => onChangeField(idx, "description", description));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  useEffect(() => {
    schedule(() => onChangeField(idx, "supportText", supportList));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportList]);

  return (
    <Card className="overflow-hidden rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
      <CardBody className="space-y-4">
        <Input
          label="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="number"
          label="Цена"
          value={priceStr}
          onChange={(e) => setPriceStr(e.target.value)}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Пункты поддержки</span>
            <Button
              size="sm"
              variant="flat"
              onPress={() => setSupportList((l) => [...l, ""])}
            >
              Добавить пункт
            </Button>
          </div>
          <div className="space-y-2">
            {supportList.map((item, sIdx) => (
              <div key={sIdx} className="flex items-center gap-2">
                <Input
                  className="flex-1"
                  value={item}
                  placeholder={`Пункт ${sIdx + 1}`}
                  onChange={(e) =>
                    setSupportList((l) => {
                      const n = [...l];
                      n[sIdx] = e.target.value;
                      return n;
                    })
                  }
                />
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={() =>
                    setSupportList((l) => {
                      const n = [...l];
                      n.splice(sIdx, 1);
                      return n;
                    })
                  }
                >
                  Удалить
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Textarea
          label="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </CardBody>
      <CardFooter>
        <div className="w-full flex justify-between items-center px-1 gap-2">
          <Input
            label="Идентификатор (key)"
            value={t.name}
            onChange={(e) => onChangeField(idx, "name", e.target.value)}
          />
          <Button
            color="danger"
            variant="flat"
            onPress={() => onDelete(t.name)}
          >
            Удалить
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export const TariffCard = memo(TariffCardBase);

export default TariffCard;
