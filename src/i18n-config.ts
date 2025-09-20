import {getRequestConfig} from 'next-intl/server';
import {defaultLocale} from './i18n';

export default getRequestConfig(async ({requestLocale}) => {
  // Get the locale from the newer API, fallback to default
  let locale = await requestLocale;
  
  // If locale is undefined or not supported, use default
  if (!locale || !['id', 'en'].includes(locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});