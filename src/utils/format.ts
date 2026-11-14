const euroFmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const euroFmt0 = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2 })
const numFmt = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
const num2Fmt = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Remplace les espaces insécables fines d'Intl par des espaces insécables standards (meilleure compatibilité de police). */
function clean(s: string): string {
  return s.replace(/ /g, ' ')
}

/** 11445.71 → « 11 445,71 € » */
export function formatEuro(value: number): string {
  return clean(euroFmt.format(value))
}

/** 60000 → « 60 000 € », 2038.17 → « 2 038,17 € » */
export function formatEuroShort(value: number): string {
  return clean(euroFmt0.format(value))
}

/** Montant comme dans les tableaux du cours : 60000 → « 60 000 », 9045.71 → « 9 045,71 » */
export function formatAmount(value: number): string {
  return clean(Number.isInteger(value) ? numFmt.format(value) : num2Fmt.format(value))
}

export function formatNumber(value: number, maxDecimals = 2): string {
  return clean(new Intl.NumberFormat('fr-FR', { maximumFractionDigits: maxDecimals }).format(value))
}

export function formatPercent(value: number, maxDecimals = 2): string {
  return `${formatNumber(value, maxDecimals)} %`
}

export function formatDuration(totalSec: number): string {
  const m = Math.floor(totalSec / 60)
  const s = Math.round(totalSec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function formatRelative(iso: string, now = new Date()): string {
  const d = new Date(iso)
  const diffMin = Math.round((now.getTime() - d.getTime()) / 60000)
  if (diffMin < 1) return "à l'instant"
  if (diffMin < 60) return `il y a ${diffMin} min`
  const diffH = Math.round(diffMin / 60)
  if (diffH < 24) return `il y a ${diffH} h`
  const diffD = Math.round(diffH / 24)
  if (diffD === 1) return 'hier'
  if (diffD < 7) return `il y a ${diffD} jours`
  return formatDate(iso)
}

/** Libellé d'année du cours : 1 → « N », 2 → « N+1 » */
export function yearLabel(period: number): string {
  return period === 1 ? 'N' : `N+${period - 1}`
}
