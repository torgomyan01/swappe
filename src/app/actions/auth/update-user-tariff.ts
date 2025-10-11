"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function ActionUpdateUserTariff(tariff_key: string) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const tariffSection = await prisma.admin_sections.findFirst({
      where: {
        name: "tariff",
      },
      select: {
        data: true,
      },
    });

    const findTarif = (tariffSection as any)?.data?.tariffs.find(
      (t: any) => t.name === tariff_key,
    );

    if (!findTarif) {
      return { status: "error", data: [], error: "Тариф не найден" };
    }

    const user = await prisma.users.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (user?.tariff === findTarif.name) {
      return {
        status: "error",
        data: [],
        error: "Вы уже подключили этот тариф",
      };
    }

    // Проверка баланса
    const price = Number(findTarif.price ?? 0);
    if (!Number.isFinite(price) || price <= 0) {
      return {
        status: "error",
        data: [],
        error: "Некорректная стоимость тарифа",
      };
    }
    if ((user?.balance ?? 0) < price) {
      return {
        status: "error",
        data: [],
        error: "Недостаточно средств на балансе",
      };
    }

    // Рассчитываем новую дату окончания тарифа
    const now = new Date();
    const oneMonth = 30 * 24 * 60 * 60 * 1000; // 30 дней в миллисекундах

    let newTariffEndDate: Date;

    // Если у пользователя есть действующий тариф и он еще не истек
    if (
      user?.tariff &&
      user?.tariff_end_date &&
      new Date(user.tariff_end_date) > now
    ) {
      // Добавляем месяц к существующей дате окончания
      newTariffEndDate = new Date(
        new Date(user.tariff_end_date).getTime() + oneMonth,
      );
    } else {
      // Если тарифа нет или он истек, устанавливаем с текущей даты + месяц
      newTariffEndDate = new Date(now.getTime() + oneMonth);
    }

    // Проводим изменение в транзакции: списание и установка тарифа
    const [updatedUser] = await prisma.$transaction([
      prisma.users.update({
        where: { id: session.user.id },
        data: {
          balance: { decrement: price },
          tariff: findTarif.name,
          tariff_start_date: now,
          tariff_end_date: newTariffEndDate,
        } as any,
      }),
    ]);

    // Обновляем session данные
    await updateUserSession(session.user.id, {
      tariff: findTarif.name,
      tariff_start_date: now,
      tariff_end_date: newTariffEndDate,
      balance: updatedUser.balance,
    });

    return {
      status: "ok",
      data: updatedUser,
      error: "",
    };
  } catch (error: any) {
    return {
      status: "error",
      data: [],
      error:
        typeof error?.message === "string"
          ? error.message
          : "Не удалось выполнить операцию. Повторите попытку позже",
    };
  }
}

// Функция для обновления session данных
async function updateUserSession(userId: string, newData: any) {
  try {
    // В NextAuth session автоматически обновляется при следующем запросе
    // Но мы можем принудительно обновить кэш
    console.log("Updating session for user:", userId, "with data:", newData);

    // Здесь можно добавить дополнительную логику для обновления session
    // Например, через cookies или другие методы
  } catch (error) {
    console.error("Error updating user session:", error);
  }
}
