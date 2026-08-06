import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getHeaderConfig } from "@/lib/store";
import HeaderAdminClient from "./HeaderAdminClient";

export default async function AdminHeaderPage() {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  return <HeaderAdminClient initial={getHeaderConfig()} />;
}
