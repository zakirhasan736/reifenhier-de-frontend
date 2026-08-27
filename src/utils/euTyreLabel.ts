export type EuGradeAE = 'A' | 'B' | 'C' | 'D' | 'E'
export type EuNoiseClass = 'A' | 'B' | 'C'

export type TyreLabelInfo = {
  supplier?: string | null
  identifier?: string | null
  size?: string | null
  efficiency_class?: string | null
  wet_grip_class?: string | null
  noise_level_db?: string | number | null
  noise_class?: string | null
  snow_icon?: boolean | null
  regulation?: string | null
}

export type EuLabelProduct = {
  brand_name?: string
  product_name?: string
  ean?: string
  dimensions?: string
  lastIndex?: string
  speedIndex?: string
  fuel_class?: string
  wet_grip?: string
  noise_class?: string
  merchant_product_third_category?: string
  tyre_label_info?: TyreLabelInfo | null
  slug?: string
}

export type EuLabelData = {
  brand: string
  identifier: string
  size: string
  tyreClass: 'C1' | 'C2' | 'C3'
  fuel: EuGradeAE | null
  wet: EuGradeAE | null
  noiseDb: number | null
  noiseClass: EuNoiseClass | null
  snow: boolean
  qrUrl: string
}

function parseGradeAE(raw?: string | null): EuGradeAE | null {
  const s = String(raw || '')
    .toUpperCase()
    .trim()
  if (!s) return null
  const match = s.match(/\b([ABCDE])\b/) || s.match(/([A-G])/)
  if (!match) return null
  const letter = match[1]
  if (letter === 'F' || letter === 'G') return 'E'
  if ('ABCDE'.includes(letter)) return letter as EuGradeAE
  return null
}

function parseNoiseClass(raw?: string | null): EuNoiseClass | null {
  const s = String(raw || '')
    .toUpperCase()
    .replace(/KLASSE/g, '')
    .trim()
  if (s === 'A' || s === 'B' || s === 'C') return s
  return null
}

function parseNoiseDb(raw?: string | number | null): number | null {
  if (raw === null || raw === undefined || raw === '') return null
  const n = parseFloat(String(raw).replace(',', '.').replace(/[^\d.]/g, ''))
  if (!Number.isFinite(n) || n < 50 || n > 90) return null
  return Math.round(n)
}

function tyreClassFromCategory(category?: string): 'C1' | 'C2' | 'C3' {
  const s = String(category || '').toLowerCase()
  if (s.includes('lkw') || s.includes('truck') || s.includes('c3')) return 'C3'
  if (s.includes('van') || s.includes('transporter') || s.includes('c2'))
    return 'C2'
  return 'C1'
}

function buildSize(p: EuLabelProduct, info: TyreLabelInfo): string {
  if (info.size) return String(info.size).trim()
  const dim = String(p.dimensions || '').replace(/\s+/g, '')
  const li = String(p.lastIndex || '').trim()
  const si = String(p.speedIndex || '').trim()
  const fromName = String(p.product_name || '').match(
    /\b\d{3}\s*\/\s*\d{2}\s*R\s*\d{2}(?:\s+\d{2,3}\s*[A-Z]{1,2})?(?:\s+XL)?\b/i
  )
  if (fromName) return fromName[0].replace(/\s+/g, ' ').toUpperCase()
  const parts = [dim.replace(/(\d)R(\d)/i, '$1R$2')]
  if (li || si) parts.push(`${li}${si}`.trim())
  return parts.filter(Boolean).join(' ') || '—'
}

export function resolveEuLabelData(
  product: EuLabelProduct,
  pageUrl?: string
): EuLabelData {
  const info = product.tyre_label_info || {}
  const fuel = parseGradeAE(info.efficiency_class || product.fuel_class)
  const wet = parseGradeAE(info.wet_grip_class || product.wet_grip)

  const noiseFromInfo = parseNoiseDb(info.noise_level_db)
  const noiseFromField = parseNoiseDb(product.noise_class)
  const noiseDb = noiseFromInfo ?? noiseFromField

  const noiseClass =
    parseNoiseClass(info.noise_class) || parseNoiseClass(product.noise_class)

  return {
    brand: String(info.supplier || product.brand_name || '').trim() || '—',
    identifier: String(info.identifier || product.ean || '').trim() || '—',
    size: buildSize(product, info),
    tyreClass: tyreClassFromCategory(product.merchant_product_third_category),
    fuel,
    wet,
    noiseDb,
    noiseClass,
    snow: Boolean(info.snow_icon),
    qrUrl:
      pageUrl ||
      (product.slug ? `https://www.reifexa.de/produkte/${product.slug}` : ''),
  }
}
