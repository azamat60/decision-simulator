export const currency = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value)

export const percent = (value: number): string => `${(value * 100).toFixed(1)}%`

export const decimal = (value: number, digits = 1): string => value.toFixed(digits)

export const dateTime = (iso: string): string => new Date(iso).toLocaleString()
