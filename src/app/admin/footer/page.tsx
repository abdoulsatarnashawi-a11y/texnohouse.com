import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getFooterConfig } from "@/lib/store";
import FooterAdminClient from "./FooterAdminClient";

export default async function AdminFooterPage() {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  return <FooterAdminClient initial={getFooterConfig()} />;
}
