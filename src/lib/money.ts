export function formatPrice(
  amount: number,
  currencySymbol = "лв.",
  locale = "bg-BG"
): string {
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ${currencySymbol}`;
}

export function formatEuroHint(bgn: number): string {
  // Approximate display only — BGN fixed to EUR at 1.95583
  const eur = bgn / 1.95583;
  return `(${eur.toFixed(2)}€)`;
}
