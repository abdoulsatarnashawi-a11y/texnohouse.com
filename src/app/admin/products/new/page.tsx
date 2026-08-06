import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import ProductEditClient from "../[id]/ProductEditClient";

export default async function NewProductPage() {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  return <ProductEditClient isNew />;
}
