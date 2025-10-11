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
  ActionGetUsersStats,
  ActionGetUsersLastWeek,
} from "@/app/actions/admin/users";

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

export default function AdminDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [usersLastWeek, setUsersLastWeek] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch statistics and users in parallel
        const [statsResult, usersResult] = await Promise.all([
          ActionGetUsersStats(),
          ActionGetUsersLastWeek(),
        ]);

        if (statsResult.status === "ok") {
          setStats(statsResult.data);
        } else {
          setError(statsResult.error || "Ошибка загрузки статистики");
        }

        if (usersResult.status === "ok") {
          setUsersLastWeek(usersResult.data as User[]);
        } else {
          setError(usersResult.error || "Ошибка загрузки пользователей");
        }
      } catch (err) {
        setError("Произошла ошибка при загрузке данных");
        console.error("Error fetching admin data:", err);
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
