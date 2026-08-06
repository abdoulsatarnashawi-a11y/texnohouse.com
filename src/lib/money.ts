/** Official BGN→EUR fixed rate (Bulgaria). Source catalog prices are in BGN. */
export const BGN_PER_EUR = 1.95583;

export function bgnToEur(bgn: number): number {
  return Number((bgn / BGN_PER_EUR).toFixed(2));
}

export function formatPrice(
  amount: number,
  currencySymbol = "€",
  locale = "bg-BG"
): string {
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ${currencySymbol}`;
}
