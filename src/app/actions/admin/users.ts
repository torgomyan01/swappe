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
  } catch {
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
  } catch {
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
  } catch {
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
  } catch {
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
  } catch {
    return {
      status: "error",
      data: null,
      error: "Ошибка при получении статистики пользователей",
    };
  }
}

// Get daily registrations for the last week
export async function ActionGetUsersByDay() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "Не авторизован" };
    }

    const userRoles = session.user?.role || session.user?.roles || [];
    const isAdmin = Array.isArray(userRoles)
      ? userRoles.includes("admin")
      : userRoles === "admin";

    if (!isAdmin) {
      return { status: "error", data: [], error: "Доступ запрещен" };
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    const users = await prisma.users.findMany({
      where: {
        created_at: {
          gte: oneWeekAgo,
        },
      },
      select: {
        created_at: true,
      },
    });

    // Group by day
    const dailyData: { [key: string]: number } = {};
    const today = new Date();

    // Initialize all days in the last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const key = date.toISOString().split("T")[0];
      dailyData[key] = 0;
    }

    // Count users per day
    users.forEach((user) => {
      const date = new Date(user.created_at);
      date.setHours(0, 0, 0, 0);
      const key = date.toISOString().split("T")[0];
      if (dailyData[key] !== undefined) {
        dailyData[key]++;
      }
    });

    const result = Object.entries(dailyData).map(([date, count]) => ({
      date,
      count,
    }));

    return {
      status: "ok",
      data: result,
      error: null,
    };
  } catch (error: any) {
    return {
      status: "error",
      data: [],
      error: "Ошибка при получении данных по дням",
    };
  }
}

// Get weekly registrations for the last month
export async function ActionGetUsersByWeek() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "Не авторизован" };
    }

    const userRoles = session.user?.role || session.user?.roles || [];
    const isAdmin = Array.isArray(userRoles)
      ? userRoles.includes("admin")
      : userRoles === "admin";

    if (!isAdmin) {
      return { status: "error", data: [], error: "Доступ запрещен" };
    }

    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    oneMonthAgo.setHours(0, 0, 0, 0);

    const users = await prisma.users.findMany({
      where: {
        created_at: {
          gte: oneMonthAgo,
        },
      },
      select: {
        created_at: true,
      },
    });

    // Group by week
    const weeklyData: { [key: string]: number } = {};
    const today = new Date();

    // Initialize all weeks in the last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i * 7);
      date.setHours(0, 0, 0, 0);
      // Get start of week (Monday)
      const dayOfWeek = date.getDay();
      const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const weekStart = new Date(date.setDate(diff));
      const key = `Week ${weekStart.toISOString().split("T")[0]}`;
      weeklyData[key] = 0;
    }

    // Count users per week
    users.forEach((user) => {
      const date = new Date(user.created_at);
      const dayOfWeek = date.getDay();
      const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const weekStart = new Date(date.setDate(diff));
      const key = `Week ${weekStart.toISOString().split("T")[0]}`;
      if (weeklyData[key] !== undefined) {
        weeklyData[key]++;
      }
    });

    const result = Object.entries(weeklyData).map(([week, count]) => ({
      week,
      count,
    }));

    return {
      status: "ok",
      data: result,
      error: null,
    };
  } catch (error: any) {
    return {
      status: "error",
      data: [],
      error: "Ошибка при получении данных по неделям",
    };
  }
}

// Get monthly registrations for the last year
export async function ActionGetUsersByMonth() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "Не авторизован" };
    }

    const userRoles = session.user?.role || session.user?.roles || [];
    const isAdmin = Array.isArray(userRoles)
      ? userRoles.includes("admin")
      : userRoles === "admin";

    if (!isAdmin) {
      return { status: "error", data: [], error: "Доступ запрещен" };
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setHours(0, 0, 0, 0);

    const users = await prisma.users.findMany({
      where: {
        created_at: {
          gte: oneYearAgo,
        },
      },
      select: {
        created_at: true,
      },
    });

    // Group by month
    const monthlyData: { [key: string]: number } = {};
    const today = new Date();

    // Initialize all months in the last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStr = String(date.getMonth() + 1).padStart(2, "0");
      const key = `${date.getFullYear()}-${monthStr}`;
      monthlyData[key] = 0;
    }

    // Count users per month
    users.forEach((user) => {
      const date = new Date(user.created_at);
      const monthStr = String(date.getMonth() + 1).padStart(2, "0");
      const key = `${date.getFullYear()}-${monthStr}`;
      if (monthlyData[key] !== undefined) {
        monthlyData[key]++;
      }
    });

    const result = Object.entries(monthlyData).map(([month, count]) => ({
      month,
      count,
    }));

    return {
      status: "ok",
      data: result,
      error: null,
    };
  } catch (error: any) {
    return {
      status: "error",
      data: [],
      error: "Ошибка при получении данных по месяцам",
    };
  }
}

// Get yearly registrations
export async function ActionGetUsersByYear() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "Не авторизован" };
    }

    const userRoles = session.user?.role || session.user?.roles || [];
    const isAdmin = Array.isArray(userRoles)
      ? userRoles.includes("admin")
      : userRoles === "admin";

    if (!isAdmin) {
      return { status: "error", data: [], error: "Доступ запрещен" };
    }

    const users = await prisma.users.findMany({
      select: {
        created_at: true,
      },
    });

    // Group by year
    const yearlyData: { [key: string]: number } = {};

    // Count users per year
    users.forEach((user) => {
      const date = new Date(user.created_at);
      const key = String(date.getFullYear());
      yearlyData[key] = (yearlyData[key] || 0) + 1;
    });

    const result = Object.entries(yearlyData)
      .map(([year, count]) => ({
        year,
        count,
      }))
      .sort((a, b) => a.year.localeCompare(b.year));

    return {
      status: "ok",
      data: result,
      error: null,
    };
  } catch (error: any) {
    return {
      status: "error",
      data: [],
      error: "Ошибка при получении данных по годам",
    };
  }
}
