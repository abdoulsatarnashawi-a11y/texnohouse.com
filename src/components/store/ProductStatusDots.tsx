import type { ProductRow } from "@/lib/types";

export function ProductStatusDots({
  product,
  className = "",
}: {
  product: Pick<ProductRow, "featured" | "on_sale" | "is_in_stock">;
  className?: string;
}) {
  const statuses = [
    {
      show: Boolean(product.featured),
      color: "bg-yellow-400",
      label: "Нов продукт",
    },
    {
      show: Boolean(product.on_sale),
      color: "bg-red-500",
      label: "Намалено",
    },
    {
      show: !Boolean(product.is_in_stock),
      color: "bg-blue-500",
      label: "Не е наличен",
    },
  ];

  return (
    <span className={`flex items-center gap-1.5 ${className}`} aria-label="Статус на продукта">
      {statuses
        .filter((status) => status.show)
        .map((status) => (
          <span
            key={status.label}
            title={status.label}
            aria-label={status.label}
            className={`h-3 w-3 rounded-full ring-2 ring-white shadow-sm ${status.color}`}
          />
        ))}
    </span>
  );
}
