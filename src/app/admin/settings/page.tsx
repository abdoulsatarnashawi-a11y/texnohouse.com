import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getSiteSettings } from "@/lib/store";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  return <SettingsClient initial={getSiteSettings()} />;
}
