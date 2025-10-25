// src/utils/auth-helpers.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isHelper?: boolean;
  helper_role?: string;
  user_id?: number;
  main_user?: any;
  main_user_id?: number;
  main_user_name?: string;
  main_user_email?: string;
  tariff?: string;
  balance?: number;
  bonus?: number;
  tariff_start_date?: Date;
  tariff_end_date?: Date;
  status?: string;
  role?: any;
  roles?: any;
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user as SessionUser | undefined;
}

export async function isHelperUser(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.isHelper === true;
}

export async function isMainUser(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.isHelper === false;
}

export async function getHelperRole(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.helper_role || null;
}

export async function getMainUserId(): Promise<number | null> {
  const user = await getCurrentUser();
  if (user?.isHelper) {
    return user.main_user_id || user.user_id || null;
  }
  return user?.id ? parseInt(user.id) : null;
}

export async function getCurrentUserId(): Promise<number | null> {
  const user = await getCurrentUser();
  if (user?.isHelper) {
    return user.id ? parseInt(user.id) : null;
  }
  return user?.id ? parseInt(user.id) : null;
}

export async function getMainUserData() {
  const user = await getCurrentUser();
  if (user?.isHelper && user?.main_user) {
    return user.main_user;
  }
  return user;
}
