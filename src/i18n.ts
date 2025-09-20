// Can be imported from a shared config
export const locales = ['id', 'en'] as const;
export const defaultLocale = 'id' as const;
export type Locale = (typeof locales)[number];