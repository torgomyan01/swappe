import AdminMainTemplate from "@/components/layout/admin/admin-main-template";
import AdminDashboard from "./components/admin-dashboard";
import { SITE_URL } from "@/utils/consts";

export default function AdminHomePage() {
  return (
    <AdminMainTemplate pathname={`/${SITE_URL.ADMIN}`}>
      <AdminDashboard />
    </AdminMainTemplate>
  );
}
