"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
} from "@heroui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  ActionGetUsersStats,
  ActionGetUsersLastWeek,
  ActionGetUsersByDay,
  ActionGetUsersByWeek,
  ActionGetUsersByMonth,
  ActionGetUsersByYear,
} from "@/app/actions/admin/users";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

interface UserStats {
  totalUsers: number;
  usersLastWeek: number;
  usersLastMonth: number;
  activeUsers: number;
  usersWithCompanies: number;
}

interface User {
  id: number;
  email: string;
  name: string;
  status: string;
  balance: number;
  bonus: number;
  tariff: string;
  created_at: string;
  company?: {
    name: string;
    city: number;
    industry: number;
  };
}

interface DailyData {
  date: string;
  count: number;
}

interface WeeklyData {
  week: string;
  count: number;
}

interface MonthlyData {
  month: string;
  count: number;
}

interface YearlyData {
  year: string;
  count: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [usersLastWeek, setUsersLastWeek] = useState<User[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all statistics in parallel
        const [
          statsResult,
          usersResult,
          dailyResult,
          weeklyResult,
          monthlyResult,
          yearlyResult,
        ] = await Promise.all([
          ActionGetUsersStats(),
          ActionGetUsersLastWeek(),
          ActionGetUsersByDay(),
          ActionGetUsersByWeek(),
          ActionGetUsersByMonth(),
          ActionGetUsersByYear(),
        ]);

        if (statsResult.status === "ok") {
          setStats(statsResult.data);
        } else {
          setError(statsResult.error || "Ошибка загрузки статистики");
        }

        if (usersResult.status === "ok") {
          setUsersLastWeek(usersResult.data as User[]);
        }

        if (dailyResult.status === "ok") {
          setDailyData(dailyResult.data as DailyData[]);
        }

        if (weeklyResult.status === "ok") {
          setWeeklyData(weeklyResult.data as WeeklyData[]);
        }

        if (monthlyResult.status === "ok") {
          setMonthlyData(monthlyResult.data as MonthlyData[]);
        }

        if (yearlyResult.status === "ok") {
          setYearlyData(yearlyResult.data as YearlyData[]);
        }
      } catch {
        setError("Произошла ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "blocked":
        return "danger";
      default:
        return "default";
    }
  };

  const getTariffColor = (tariff: string) => {
    switch (tariff) {
      case "premium":
        return "primary";
      case "basic":
        return "secondary";
      case "free":
        return "default";
      default:
        return "default";
    }
  };

  // Chart data preparation
  const formatDailyLabels = (data: DailyData[]) => {
    return data.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
      });
    });
  };

  const dailyChartData = {
    labels: formatDailyLabels(dailyData),
    datasets: [
      {
        label: "Регистрации по дням (последняя неделя)",
        data: dailyData.map((item) => item.count),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const weeklyChartData = {
    labels: weeklyData.map((item) => {
      const weekParts = item.week.split(" ");
      const weekNum = weekParts.length > 1 ? weekParts[1] : item.week;
      const date = new Date(weekNum);
      if (isNaN(date.getTime())) {
        return item.week;
      }
      return date.toLocaleDateString("ru-RU", {
        month: "short",
        day: "numeric",
      });
    }),
    datasets: [
      {
        label: "Регистрации по неделям (последний месяц)",
        data: weeklyData.map((item) => item.count),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
      },
    ],
  };

  const monthlyChartData = {
    labels: monthlyData.map((item) => {
      const [year, month] = item.month.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString("ru-RU", {
        month: "short",
        year: "numeric",
      });
    }),
    datasets: [
      {
        label: "Регистрации по месяцам (последний год)",
        data: monthlyData.map((item) => item.count),
        backgroundColor: "rgba(168, 85, 247, 0.8)",
        borderColor: "rgb(168, 85, 247)",
        borderWidth: 1,
      },
    ],
  };

  const yearlyChartData = {
    labels: yearlyData.map((item) => item.year),
    datasets: [
      {
        label: "Регистрации по годам",
        data: yearlyData.map((item) => item.count),
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(147, 51, 234, 0.8)",
        ],
        borderColor: [
          "rgb(239, 68, 68)",
          "rgb(249, 115, 22)",
          "rgb(234, 179, 8)",
          "rgb(34, 197, 94)",
          "rgb(59, 130, 246)",
          "rgb(147, 51, 234)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats?.totalUsers || 0}
            </div>
            <div className="text-sm text-gray-600">Всего пользователей</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats?.usersLastWeek || 0}
            </div>
            <div className="text-sm text-gray-600">За последнюю неделю</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats?.usersLastMonth || 0}
            </div>
            <div className="text-sm text-gray-600">За последний месяц</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats?.activeUsers || 0}
            </div>
            <div className="text-sm text-gray-600">Активных пользователей</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {stats?.usersWithCompanies || 0}
            </div>
            <div className="text-sm text-gray-600">С компаниями</div>
          </CardBody>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Chart - Last Week */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">
              Регистрации по дням (последняя неделя)
            </h2>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              <Line data={dailyChartData} options={chartOptions} />
            </div>
          </CardBody>
        </Card>

        {/* Weekly Chart - Last Month */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">
              Регистрации по неделям (последний месяц)
            </h2>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              <Bar data={weeklyChartData} options={chartOptions} />
            </div>
          </CardBody>
        </Card>

        {/* Monthly Chart - Last Year */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">
              Регистрации по месяцам (последний год)
            </h2>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              <Bar data={monthlyChartData} options={chartOptions} />
            </div>
          </CardBody>
        </Card>

        {/* Yearly Chart */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Регистрации по годам</h2>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              <Doughnut data={yearlyChartData} options={chartOptions} />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Users Table */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">
            Пользователи, зарегистрированные за последнюю неделю
          </h2>
        </CardHeader>
        <CardBody>
          {usersLastWeek.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>За последнюю неделю новых пользователей не зарегистрировано</p>
            </div>
          ) : (
            <Table aria-label="Users from last week">
              <TableHeader>
                <TableColumn>ИМЯ</TableColumn>
                <TableColumn>EMAIL</TableColumn>
                <TableColumn>СТАТУС</TableColumn>
                <TableColumn>ТАРИФ</TableColumn>
                <TableColumn>БАЛАНС</TableColumn>
                <TableColumn>БОНУСЫ</TableColumn>
                <TableColumn>КОМПАНИЯ</TableColumn>
                <TableColumn>ДАТА РЕГИСТРАЦИИ</TableColumn>
              </TableHeader>
              <TableBody>
                {usersLastWeek.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip color={getStatusColor(user.status)} size="sm">
                        {user.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip color={getTariffColor(user.tariff)} size="sm">
                        {user.tariff}
                      </Chip>
                    </TableCell>
                    <TableCell>{user.balance}</TableCell>
                    <TableCell>{user.bonus}</TableCell>
                    <TableCell>
                      {user.company ? (
                        <div className="text-sm">
                          <div className="font-medium">{user.company.name}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
