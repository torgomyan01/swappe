import AdminMainTemplate from "@/components/layout/admin/admin-main-template";
import { SITE_URL } from "@/utils/consts";

export default function AdminHomePage() {
  return (
    <AdminMainTemplate pathname={`/${SITE_URL.ADMIN}`}>
      <div>Home</div>
    </AdminMainTemplate>
  );
}
