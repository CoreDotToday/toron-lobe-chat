import { cookies } from 'next/headers';
import { PropsWithChildren } from 'react';

import { LOBE_LOCALE_COOKIE } from '@/const/locale';
import {
  LOBE_THEME_APPEARANCE,
  LOBE_THEME_NEUTRAL_COLOR,
  LOBE_THEME_PRIMARY_COLOR,
} from '@/const/theme';
import Layout from '@/layout/GlobalLayout';

export default function ChatLayout({ children }: PropsWithChildren) {
  const cookieStore = cookies();
  const lang = cookieStore.get(LOBE_LOCALE_COOKIE);
  const appearance = cookieStore.get(LOBE_THEME_APPEARANCE);
  const neutralColor = cookieStore.get(LOBE_THEME_NEUTRAL_COLOR);
  const primaryColor = cookieStore.get(LOBE_THEME_PRIMARY_COLOR);
  return (
    <Layout
      defaultAppearance={appearance?.value}
      defaultLang={lang?.value}
      defaultNeutralColor={neutralColor?.value as any}
      defaultPrimaryColor={primaryColor?.value as any}
    >
      {children}
    </Layout>
  );
}
