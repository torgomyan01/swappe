"use server";

import { prisma } from "@/lib/prisma";

export type Tariff = {
  name: string;
  price: number;
  title: string;
  supportText: string[];
  description?: string;
};

const SECTION_NAME = "tariff";

async function readSection(): Promise<Tariff[]> {
  const row = await prisma.admin_sections.findFirst({
    where: { name: SECTION_NAME },
  });
  const data = (row?.data as any) ?? {};
  return Array.isArray(data?.tariffs) ? (data.tariffs as Tariff[]) : [];
}

async function writeSection(tariffs: Tariff[]) {
  const existing = await prisma.admin_sections.findFirst({
    where: { name: SECTION_NAME },
  });
  if (!existing) {
    await prisma.admin_sections.create({
      data: { name: SECTION_NAME, data: { tariffs } },
    });
    return;
  }
  await prisma.admin_sections.update({
    where: { id: existing.id },
    data: { data: { tariffs } },
  });
}

export async function ActionGetTariffs() {
  try {
    const tariffs = await readSection();
    return { status: "ok", data: tariffs, error: "" } as const;
  } catch (error: any) {
    return {
      status: "error",
      data: [] as Tariff[],
      error:
        typeof error?.message === "string"
          ? error.message
          : "Не удалось выполнить операцию. Повторите попытку позже",
    } as const;
  }
}

export async function ActionSaveTariffs(tariffs: Tariff[]) {
  try {
    await writeSection(tariffs);
    return { status: "ok", error: "" } as const;
  } catch (error: any) {
    return {
      status: "error",
      error:
        typeof error?.message === "string"
          ? error.message
          : "Не удалось сохранить. Повторите позже",
    } as const;
  }
}

export async function ActionDeleteTariff(name: string) {
  try {
    const tariffs = await readSection();
    const next = tariffs.filter((t) => t.name !== name);
    await writeSection(next);
    return { status: "ok", error: "" } as const;
  } catch (error: any) {
    return {
      status: "error",
      error:
        typeof error?.message === "string"
          ? error.message
          : "Не удалось удалить. Повторите позже",
    } as const;
  }
}
