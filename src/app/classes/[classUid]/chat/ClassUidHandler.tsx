'use client';

import { useEffect } from 'react';

import { useClassStore } from '@/store/class';

const useClassUidFromUrl = () => {
  const setClassUid = useClassStore((state) => state.setClassUid);

  useEffect(() => {
    // URL에서 classUid 경로 파라미터 추출
    const handleLocationChange = () => {
      const pathSegments = window.location.pathname.split('/');
      // URL 경로 구조에 따라 인덱스를 조정해야 할 수 있음
      // 예를 들어, URL이 /classes/[classUid]]/chat 형태라면 인덱스는 2이 될 것임
      const classUid = pathSegments[2];

      if (classUid) {
        setClassUid(classUid);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange();

    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [setClassUid]);
};

const ClassUidHandler = () => {
  useClassUidFromUrl();

  return null; // UI를 렌더링하지 않음
};

export default ClassUidHandler;
