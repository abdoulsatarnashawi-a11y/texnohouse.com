import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getProductById } from "@/lib/store";
import ProductEditClient from "./ProductEditClient";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  const { id } = await params;
  if (id === "new") {
    return <ProductEditClient isNew />;
  }
  const product = getProductById(Number(id));
  if (!product) redirect("/admin/products");
  return <ProductEditClient product={product} />;
}
