type Options = {
  bits: boolean
  binary: boolean
  signed: boolean
  minimumFractionDigits: number
  maximumFractionDigits: number
  locale: any
}

const BYTE_UNITS = [
  'B',
  'kB',
  'MB',
  'GB',
  'TB',
  'PB',
  'EB',
  'ZB',
  'YB',
]

const BIBYTE_UNITS = [
  'B',
  'kiB',
  'MiB',
  'GiB',
  'TiB',
  'PiB',
  'EiB',
  'ZiB',
  'YiB',
]

const BIT_UNITS = [
  'b',
  'kbit',
  'Mbit',
  'Gbit',
  'Tbit',
  'Pbit',
  'Ebit',
  'Zbit',
  'Ybit',
]

const BIBIT_UNITS = [
  'b',
  'kibit',
  'Mibit',
  'Gibit',
  'Tibit',
  'Pibit',
  'Eibit',
  'Zibit',
  'Yibit',
]

/*
Formats the given number using `Number#toLocaleString`.
- If locale is a string, the value is expected to be a locale-key (for example: `de`).
- If locale is true, the system default locale is used for translation.
- If no value for locale is specified, the number is returned unmodified.
*/
const toLocaleString = (number: number, locale: any, options: any) => (
  typeof locale === 'string' || Array.isArray(locale)
    ? number.toLocaleString(locale, options)
    : (locale === true || options !== undefined)
      ? number.toLocaleString(undefined, options)
      : number
)

const prettyBytes = (number: number, options?: Options) => {
  if (!Number.isFinite(number))
    throw new TypeError(`Expected a finite number, got ${typeof number}: ${number}`)

  // eslint-disable-next-line no-param-reassign
  options = {
    bits: false,
    binary: false,
    ...options,
  }

  const UNITS = options.bits
    ? (options.binary ? BIBIT_UNITS : BIT_UNITS)
    : (options.binary ? BIBYTE_UNITS : BYTE_UNITS)

  if (options.signed && number === 0)
    return ` 0 ${UNITS[0]}`

  const isNegative = number < 0
  const prefix = isNegative ? '-' : (options.signed ? '+' : '')

  if (isNegative)
    // eslint-disable-next-line no-param-reassign
    number = -number

  const localeOptions = {
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits,
  }

  if (number < 1) {
    const numberString = toLocaleString(number, options.locale, localeOptions)
    return `${prefix + numberString} ${UNITS[0]}`
  }

  const exponent = Math.min(Math.floor(options.binary ? Math.log(number) / Math.log(1024) : Math.log10(number) / 3), UNITS.length - 1)
  // eslint-disable-next-line no-param-reassign
  number /= (options.binary ? 1024 : 1000) ** exponent

  const _number = !localeOptions ? number.toPrecision(3) : number

  const numberStr = toLocaleString(Number(_number), options.locale, localeOptions)

  const unit = UNITS[exponent]

  return `${prefix + numberStr} ${unit}`
}

export default prettyBytes
