import i18n from '../../i18n'

export const formatDate = (
  date: Date,
  options?: Intl.DateTimeFormatOptions,
) => {
  const formatter = new Intl.DateTimeFormat(i18n.language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  })

  return formatter.format(new Date(date))
}
