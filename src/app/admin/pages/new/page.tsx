import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import PageEditClient from "../[id]/PageEditClient";

export default async function NewPageAdmin() {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  return <PageEditClient isNew />;
}
