import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import type { PageRow } from "@/lib/types";
import PageEditClient from "./PageEditClient";

export default async function EditPageAdmin({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  const { id } = await params;
  const page = getDb().prepare("SELECT * FROM pages WHERE id = ?").get(Number(id)) as
    | PageRow
    | undefined;
  if (!page) redirect("/admin/pages");
  return <PageEditClient page={page} />;
}
