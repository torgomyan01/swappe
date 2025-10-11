"use client";

import {
  addToast,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Spinner,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { SITE_URL } from "@/utils/consts";
import AdminMainTemplate from "@/components/layout/admin/admin-main-template";
import {
  ActionGetUsers,
  ActionUpdateUser,
  ActionDeleteUser,
} from "@/app/actions/admin/users";
import { useEffect, useState } from "react";
import { MoreVertical, Edit, Trash2, User } from "lucide-react";

interface User {
  id: number;
  email: string;
  name: string;
  status: string;
  balance: number;
  bonus: number;
  tariff: string | null;
  tariff_start_date: Date | string;
  tariff_end_date: Date | string;
  role: any;
  created_at: Date | string;
  updated_at: Date | string;
  company?: {
    name: string;
    phone_number: string;
    city: number;
    industry: number;
  } | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    status: "",
    balance: 0,
    bonus: 0,
    tariff: "",
    role: [] as string[],
    tariff_start_date: "",
    tariff_end_date: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const result = await ActionGetUsers();
    if (result.status === "ok") {
      setUsers(result.data);
    } else {
      addToast({
        title: result.error,
        color: "danger",
      });
    }
    setLoading(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      status: user.status,
      balance: user.balance,
      bonus: user.bonus,
      tariff: user.tariff || "",
      role: Array.isArray(user.role) ? user.role : user.role ? [user.role] : [],
      tariff_start_date: user.tariff_start_date
        ? new Date(user.tariff_start_date).toISOString().split("T")[0]
        : "",
      tariff_end_date: user.tariff_end_date
        ? new Date(user.tariff_end_date).toISOString().split("T")[0]
        : "",
    });
    setEditModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    const result = await ActionUpdateUser(selectedUser.id, editForm);
    if (result.status === "ok") {
      addToast({
        title: "Пользователь успешно обновлен",
        color: "success",
      });
      setEditModalOpen(false);
      fetchUsers();
    } else {
      addToast({
        title: result.error,
        color: "danger",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    const result = await ActionDeleteUser(selectedUser.id);
    if (result.status === "ok") {
      addToast({
        title: "Пользователь успешно удален",
        color: "success",
      });
      setDeleteModalOpen(false);
      fetchUsers();
    } else {
      addToast({
        title: result.error,
        color: "danger",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "success";
      case "pending":
        return "warning";
      case "blocked":
        return "danger";
      default:
        return "default";
    }
  };

  const getRoleColor = (role: string | string[]) => {
    const roles = Array.isArray(role) ? role : [role];
    if (roles.includes("admin")) return "danger";
    if (roles.includes("user")) return "primary";
    return "default";
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(amount);
  };

  if (loading) {
    return (
      <AdminMainTemplate pathname={`/${SITE_URL.ADMIN_USERS}`}>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </AdminMainTemplate>
    );
  }

  return (
    <AdminMainTemplate pathname={`/${SITE_URL.ADMIN_USERS}`}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Пользователи</h1>
          <Button
            color="primary"
            onPress={fetchUsers}
            startContent={<User className="w-4 h-4" />}
          >
            Обновить
          </Button>
        </div>

        <Table aria-label="Users table" className="min-h-[400px]">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Имя</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Статус</TableColumn>
            <TableColumn>Роль</TableColumn>
            <TableColumn>Баланс</TableColumn>
            <TableColumn>Тариф</TableColumn>
            <TableColumn>Дата создания</TableColumn>
            <TableColumn>Действия</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Пользователи не найдены">
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    {user.company?.name && (
                      <span className="text-sm text-gray-500">
                        {user.company.name}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    color={getStatusColor(user.status)}
                    variant="flat"
                  >
                    {user.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(user.role) ? (
                      user.role.map((roleItem, index) => (
                        <Chip
                          key={index}
                          size="sm"
                          color={getRoleColor([roleItem])}
                          variant="flat"
                        >
                          {roleItem}
                        </Chip>
                      ))
                    ) : (
                      <Chip
                        size="sm"
                        color={getRoleColor(user.role)}
                        variant="flat"
                      >
                        {user.role}
                      </Chip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {formatCurrency(user.balance)}
                    </span>
                    {user.bonus > 0 && (
                      <span className="text-sm text-yellow-600">
                        +{user.bonus} бонусов
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {user.tariff ? (
                    <div className="flex flex-col">
                      <span className="font-medium">{user.tariff}</span>
                      <span className="text-sm text-gray-500">
                        до {formatDate(user.tariff_end_date)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Нет тарифа</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" variant="light">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="User actions">
                      <DropdownItem
                        key="edit"
                        startContent={<Edit className="w-4 h-4" />}
                        onPress={() => handleEditUser(user)}
                      >
                        Редактировать
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        startContent={<Trash2 className="w-4 h-4" />}
                        onPress={() => handleDeleteUser(user)}
                      >
                        Удалить
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit User Modal */}
        <Modal
          isOpen={editModalOpen}
          onOpenChange={setEditModalOpen}
          size="2xl"
        >
          <ModalContent>
            <ModalHeader>Редактировать пользователя</ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Имя"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
                <Input
                  label="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                />
                <Select
                  label="Статус"
                  selectedKeys={[editForm.status]}
                  onSelectionChange={(keys) =>
                    setEditForm({
                      ...editForm,
                      status: Array.from(keys)[0] as string,
                    })
                  }
                >
                  <SelectItem key="verified">Подтвержден</SelectItem>
                  <SelectItem key="pending">Ожидает</SelectItem>
                  <SelectItem key="blocked">Заблокирован</SelectItem>
                </Select>
                <Select
                  label="Роли"
                  selectionMode="multiple"
                  selectedKeys={editForm.role}
                  onSelectionChange={(keys) =>
                    setEditForm({
                      ...editForm,
                      role: Array.from(keys) as string[],
                    })
                  }
                >
                  <SelectItem key="user">Пользователь</SelectItem>
                  <SelectItem key="admin">Администратор</SelectItem>
                </Select>
                <Input
                  label="Баланс"
                  type="number"
                  value={editForm.balance.toString()}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      balance: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <Input
                  label="Бонусы"
                  type="number"
                  value={editForm.bonus.toString()}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      bonus: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setEditModalOpen(false)}>
                Отмена
              </Button>
              <Button color="primary" onPress={handleSaveUser}>
                Сохранить
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete User Modal */}
        <Modal isOpen={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <ModalContent>
            <ModalHeader>Удалить пользователя</ModalHeader>
            <ModalBody>
              <p>
                Вы уверены, что хотите удалить пользователя{" "}
                <strong>{selectedUser?.name}</strong>? Это действие нельзя
                отменить.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setDeleteModalOpen(false)}>
                Отмена
              </Button>
              <Button color="danger" onPress={handleConfirmDelete}>
                Удалить
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </AdminMainTemplate>
  );
}
