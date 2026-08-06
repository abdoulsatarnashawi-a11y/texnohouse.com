import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminLoginForm from "./AdminLoginForm";

export default async function AdminLoginPage() {
  const user = await getAdminSession();
  if (user) redirect("/admin");
  return <AdminLoginForm />;
}
