export const formatDate = (
  value?: string | null,
  langCode?: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!value) return '';
  try {
    const cleanLang = (langCode || 'uz').split('-')[0].split('_')[0].toLowerCase();
    const locale = cleanLang === 'en' ? 'en-US' : cleanLang === 'ru' ? 'ru-RU' : 'uz-UZ';
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return value; // If it's already formatted or not a parseable date, return as-is
    }
    return date.toLocaleDateString(locale, options);
  } catch (e) {
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return value;
      }
      return date.toLocaleDateString('uz-UZ', options);
    } catch {
      return value;
    }
  }
};
