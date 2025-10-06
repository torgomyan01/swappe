import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SITE_URL } from "@/utils/consts";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const isAdmin = (() => {
    const raw = user?.role ?? user?.roles ?? user?.status;
    if (Array.isArray(raw)) {
      return raw.map((r: any) => String(r).toLowerCase()).includes("admin");
    }
    if (typeof raw === "string") {
      return raw.toLowerCase().includes("admin");
    }
    return false;
  })();

  if (!session || !isAdmin) {
    redirect(SITE_URL.LOGIN);
  }

  return children;
}
