const SYMBOLS: Record<string, string> = {
  USD: '$', PHP: '₱', SGD: 'S$', MYR: 'RM', IDR: 'Rp', THB: '฿',
}

export function formatPrice(amount: number, currency = 'USD'): string {
  const symbol = SYMBOLS[currency] ?? currency
  return `${symbol}${amount.toFixed(2)}`
}

export const CURRENCIES = Object.keys(SYMBOLS)
