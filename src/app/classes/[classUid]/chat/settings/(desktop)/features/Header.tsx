import { ChatHeader, ChatHeaderTitle } from '@lobehub/ui';
import { useRouter } from 'next/navigation';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import HeaderContent from '@/app/classes/[classUid]/chat/settings/features/HeaderContent';
import { useClassStore } from '@/store/class';
import { pathString } from '@/utils/url';

const Header = memo(() => {
  const { t } = useTranslation('setting');
  const router = useRouter();
  const [classUid] = useClassStore((s) => [s.classUid]);

  return (
    <ChatHeader
      left={<ChatHeaderTitle title={t('header.session')} />}
      onBackClick={() =>
        router.push(pathString(`/classes/${classUid}/chat`, { hash: location.hash }))
      }
      right={<HeaderContent />}
      showBackButton
    />
  );
});

export default Header;
