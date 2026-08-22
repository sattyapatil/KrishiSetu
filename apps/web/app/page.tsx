import { redirect } from 'next/navigation';
import { localeRegistry } from '@krishisetu/i18n';

export default function RootPage(): never {
  redirect(`/${localeRegistry.defaultLocale}`);
}
