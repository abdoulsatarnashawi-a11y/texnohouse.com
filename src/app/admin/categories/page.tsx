import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getAllCategories } from "@/lib/store";
import CategoryManager from "./CategoryManager";

export default async function AdminCategoriesPage() {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  return <CategoryManager initial={getAllCategories()} />;
}
