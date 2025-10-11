"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function ActionGetUsers() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "Не авторизован" };
    }

    // Check if user is admin
    const userRoles = session.user?.role || session.user?.roles || [];
    const isAdmin = Array.isArray(userRoles)
      ? userRoles.includes("admin")
      : userRoles === "admin";

    if (!isAdmin) {
      return { status: "error", data: [], error: "Доступ запрещен" };
    }

    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        balance: true,
        bonus: true,
        tariff: true,
        tariff_start_date: true,
        tariff_end_date: true,
        role: true,
        created_at: true,
        updated_at: true,
        company: {
          select: {
            name: true,
            phone_number: true,
            city: true,
            industry: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return {
      status: "ok",
      data: users,
      error: null,
    };
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return {
      status: "error",
      data: [],
      error: "Ошибка при получении пользователей",
    };
  }
}

export async function ActionUpdateUser(userId: number, userData: any) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: null, error: "Не авторизован" };
    }

    // Check if user is admin
    const userRoles = session.user?.role || session.user?.roles || [];
    const isAdmin = Array.isArray(userRoles)
      ? userRoles.includes("admin")
      : userRoles === "admin";

    if (!isAdmin) {
      return { status: "error", data: null, error: "Доступ запрещен" };
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        name: userData.name,
        email: userData.email,
        status: userData.status,
        balance: userData.balance,
        bonus: userData.bonus,
        tariff: userData.tariff,
        role: Array.isArray(userData.role) ? userData.role : [userData.role],
        tariff_start_date: userData.tariff_start_date
          ? new Date(userData.tariff_start_date)
          : undefined,
        tariff_end_date: userData.tariff_end_date
          ? new Date(userData.tariff_end_date)
          : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        balance: true,
        bonus: true,
        tariff: true,
        tariff_start_date: true,
        tariff_end_date: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      status: "ok",
      data: updatedUser,
      error: null,
    };
  } catch (error: any) {
    console.error("Error updating user:", error);
    return {
      status: "error",
      data: null,
      error: "Ошибка при обновлении пользователя",
    };
  }
}

export async function ActionDeleteUser(userId: number) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: null, error: "Не авторизован" };
    }

    // Check if user is admin
    const userRoles = session.user?.role || session.user?.roles || [];
    const isAdmin = Array.isArray(userRoles)
      ? userRoles.includes("admin")
      : userRoles === "admin";

    if (!isAdmin) {
      return { status: "error", data: null, error: "Доступ запрещен" };
    }

    // Don't allow deleting own account
    if (session.user.id === userId) {
      return {
        status: "error",
        data: null,
        error: "Нельзя удалить собственный аккаунт",
      };
    }

    await prisma.users.delete({
      where: { id: userId },
    });

    return {
      status: "ok",
      data: null,
      error: null,
    };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return {
      status: "error",
      data: null,
      error: "Ошибка при удалении пользователя",
    };
  }
}

export async function ActionGetUsersLastWeek() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "Не авторизован" };
    }

    // Check if user is admin
    const userRoles = session.user?.role || session.user?.roles || [];
    const isAdmin = Array.isArray(userRoles)
      ? userRoles.includes("admin")
      : userRoles === "admin";

    if (!isAdmin) {
      return { status: "error", data: [], error: "Доступ запрещен" };
    }

    // Calculate date 7 days ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const users = await prisma.users.findMany({
      where: {
        created_at: {
          gte: oneWeekAgo,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        balance: true,
        bonus: true,
        tariff: true,
        created_at: true,
        company: {
          select: {
            name: true,
            city: true,
            industry: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return {
      status: "ok",
      data: users,
      error: null,
    };
  } catch (error: any) {
    console.error("Error fetching users from last week:", error);
    return {
      status: "error",
      data: [],
      error: "Ошибка при получении пользователей за последнюю неделю",
    };
  }
}

export async function ActionGetUsersStats() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: null, error: "Не авторизован" };
    }

    // Check if user is admin
    const userRoles = session.user?.role || session.user?.roles || [];
    const isAdmin = Array.isArray(userRoles)
      ? userRoles.includes("admin")
      : userRoles === "admin";

    if (!isAdmin) {
      return { status: "error", data: null, error: "Доступ запрещен" };
    }

    // Get total users count
    const totalUsers = await prisma.users.count();

    // Get users registered in the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const usersLastWeek = await prisma.users.count({
      where: {
        created_at: {
          gte: oneWeekAgo,
        },
      },
    });

    // Get users registered in the last month
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const usersLastMonth = await prisma.users.count({
      where: {
        created_at: {
          gte: oneMonthAgo,
        },
      },
    });

    // Get active users (with status 'active')
    const activeUsers = await prisma.users.count({
      where: {
        status: "verified",
      },
    });

    // Get users with companies
    const usersWithCompanies = await prisma.users.count({
      where: {
        company: {
          isNot: null,
        },
      },
    });

    return {
      status: "ok",
      data: {
        totalUsers,
        usersLastWeek,
        usersLastMonth,
        activeUsers,
        usersWithCompanies,
      },
      error: null,
    };
  } catch (error: any) {
    console.error("Error fetching user statistics:", error);
    return {
      status: "error",
      data: null,
      error: "Ошибка при получении статистики пользователей",
    };
  }
}
