'use client';

import { useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';

import { messageService } from '@/services/message';
import { sessionService } from '@/services/session';
import { useClassStore } from '@/store/class';
import { useSessionStore } from '@/store/session';

const checkHasConversation = async () => {
  const hasMessages = await messageService.hasMessages();
  const hasAgents = await sessionService.hasSessions();
  return hasMessages || hasAgents;
};

const Redirect = memo(() => {
  const router = useRouter();
  const [switchSession] = useSessionStore((s) => [s.switchSession]);
  const [classUid] = useClassStore((s) => [s.classUid]);

  useEffect(() => {
    checkHasConversation().then((hasData) => {
      if (hasData) {
        router.push(`/classes/${classUid}/chat`);

        switchSession();
      } else {
        router.push('/welcome');
      }
    });
  }, []);

  return null;
});

export default Redirect;
