"use client";

import React from "react";
import { SITE_URL } from "@/utils/consts";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  HeroUIProvider,
  ToastProvider,
} from "@heroui/react";
import {
  AppProvider,
  DashboardLayout,
  Navigation,
  PageContainer,
} from "@toolpad/core";

import { useSession } from "next-auth/react";

const NAVIGATION = [
  {
    segment: SITE_URL.ADMIN,
    title: "Главная",
    icon: <i className="fa-solid fa-house"></i>,
  },
  {
    segment: SITE_URL.ADMIN_TARIFF,
    title: "Тариф",
    icon: <i className="fa-solid fa-badge-check"></i>,
  },
  // {
  //   segment: SITE_URL.ADMIN_PAGES,
  //   title: "Страницы ",
  //   icon: <i className="fa-duotone fa-regular fa-list-dropdown"></i>,
  //   children: [
  //     {
  //       segment: SITE_URL.ADMIN_PAGES_HOME,
  //       title: "Главная",
  //       icon: "",
  //     },
  //     {
  //       segment: SITE_URL.ADMIN_PAGES_COMPANY,
  //       title: "О компании",
  //       icon: "",
  //     },
  //   ],
  // },
];

function AdminMainTemplate({
  children,
  pathname,
}: {
  children: React.ReactNode;
  pathname: string;
}) {
  const router = useRouter();
  const { data: session } = useSession();

  function changeUrl(string: string | URL) {
    if (typeof string === "string") {
      router.push(string);
    }
  }

  const routerObj = {
    pathname,
    searchParams: new URLSearchParams(),
    navigate: (path: string | URL) => changeUrl(path),
  };

  function ToolbarActionsSearch() {
    return (
      <div className="w-full py-4 px-4">
        <Dropdown>
          <DropdownTrigger>
            <Avatar
              name={session?.user?.name || ""}
              className="cursor-pointer "
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="delete" className="text-danger" color="danger">
              Выход
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }

  return (
    <HeroUIProvider>
      <AppProvider
        navigation={NAVIGATION}
        router={routerObj}
        branding={{
          logo: "",
          title: "SWAPPE Admin",
          homeUrl: `/${SITE_URL.ADMIN}`,
        }}
      >
        <DashboardLayout
          slots={{
            toolbarAccount: ToolbarActionsSearch,
          }}
        >
          <PageContainer className="pt-6">
            <ToastProvider />

            {children}
          </PageContainer>
        </DashboardLayout>
      </AppProvider>
    </HeroUIProvider>
  );
}

export default AdminMainTemplate;
