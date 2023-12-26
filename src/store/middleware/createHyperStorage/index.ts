import { PersistStorage } from 'zustand/middleware';
import { StorageValue } from 'zustand/middleware/persist';

import { createKeyMapper } from './keyMapper';
import { HyperStorageOptions } from './type';
import { creatUrlStorage } from './urlStorage';

export const createHyperStorage = <T extends object>(
  options: HyperStorageOptions,
): PersistStorage<T> => {
  const hasUrl = !!options.url;

  const { mapStateKeyToStorageKey, getStateKeyFromStorageKey } = createKeyMapper(options);

  const urlStorage = creatUrlStorage(options.url?.mode);

  const debounceTimers: { [key: string]: number | undefined } = {};

  const debounceSetItem = async (key: string, newValue: StorageValue<T>, delay: number = 3000) => {
    if (debounceTimers[key]) {
      clearTimeout(debounceTimers[key]);
    }
    debounceTimers[key] = window.setTimeout(async () => {
      const response = await fetch('/api/db/chat/set-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: key,
          data: newValue.state,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save data to DynamoDB');
      }

      if (hasUrl) {
        // 转换 key 为目标 key
        const finalEntries = Object.entries(newValue.state)
          .map(([k, v]) => {
            const urlKey = mapStateKeyToStorageKey(k, 'url');
            if (!urlKey) return undefined;
            return [urlKey, v];
          })
          .filter(Boolean) as [string, any][];

        urlStorage.setItem(key, Object.fromEntries(finalEntries));
      }

      delete debounceTimers[key];
    }, delay);
  };

  return {
    getItem: async (name): Promise<StorageValue<T>> => {
      const state: any = {};

      // DynamoDB에서 데이터를 가져오기 위해 API 라우트 호출
      const response = await fetch(`/api/db/chat/get-item?key=${name}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data from DynamoDB');
      }
      const data = await response.json();

      // deleted: true인 항목은 반환하지 않음
      if (data && data.deleted) {
        return { state: {} as T, version: undefined }; // 빈 객체 또는 T 타입의 기본값을 반환
      }

      if (hasUrl) {
        const urlState = urlStorage.getItem();

        if (urlState) {
          for (const [k, v] of Object.entries(urlState.state)) {
            const key = getStateKeyFromStorageKey(k, 'url');
            // 当存在 UrlSelector 逻辑，且 key 有效时，才将状态加入终态 state
            if (hasUrl && key) {
              state[key] = v;
            }
          }
        }
      }

      return { state: data, version: undefined }; // version 관리가 필요하다면 수정
    },

    removeItem: async (key) => {
      // DynamoDB에서 항목을 '삭제됨'으로 표시하기 위해 API 라우트 호출
      const response = await fetch('/api/db/chat/set-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: key,
          data: { deleted: true },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark item as deleted in DynamoDB');
      }

      if (hasUrl) {
        const storageKey = getStateKeyFromStorageKey(key, 'url');

        urlStorage.removeItem(storageKey);
      }
    },

    setItem: async (name, newValue) => {
      await debounceSetItem(name, newValue);
    },

    // getItem: async (name): Promise<StorageValue<T>> => {
    //   const state: any = {};
    //   let version: number | undefined;

    //   // ============== 处理 Local Storage  ============== //
    //   if (!skipLocalStorage) {
    //     let localState: StorageValue<T> | undefined;

    //     // 如果使用 indexedDB，优先从 indexedDB 中获取
    //     if (useIndexedDB) {
    //       localState = await indexedDB.getItem(name);
    //     }
    //     // 如果 indexedDB 中不存在，则再试试 localStorage
    //     if (!localState) localState = localStorage.getItem(name);

    //     if (localState) {
    //       version = localState.version;
    //       for (const [k, v] of Object.entries(localState.state)) {
    //         const key = getStateKeyFromStorageKey(k, 'localStorage');
    //         if (key) state[key] = v;
    //       }
    //     }
    //   }

    //   // ============== 处理 URL Storage  ============== //
    //   // 不从 URL 中获取 version，由于 url 状态是临时态 不作为版本控制的依据
    //   if (hasUrl) {
    //     const urlState = urlStorage.getItem();

    //     if (urlState) {
    //       for (const [k, v] of Object.entries(urlState.state)) {
    //         const key = getStateKeyFromStorageKey(k, 'url');
    //         // 当存在 UrlSelector 逻辑，且 key 有效时，才将状态加入终态 state
    //         if (hasUrl && key) {
    //           state[key] = v;
    //         }
    //       }
    //     }
    //   }

    //   return { state, version };
    // },

    // removeItem: async (key) => {
    //   // ============== 处理 Local Storage  ============== //
    //   if (!skipLocalStorage) {
    //     if (useIndexedDB) {
    //       await indexedDB.removeItem(key);
    //     } else {
    //       localStorage.removeItem(key);
    //     }
    //   }

    //   // ============== 处理 URL Storage  ============== //
    //   if (hasUrl) {
    //     const storageKey = getStateKeyFromStorageKey(key, 'url');

    //     urlStorage.removeItem(storageKey);
    //   }
    // },

    // setItem: async (name, newValue) => {
    //   // ============== 处理 Local Storage  ============== //
    //   const localState: Record<string, any> = {};
    //   for (const [k, v] of Object.entries(newValue.state)) {
    //     const localKey = mapStateKeyToStorageKey(k, 'localStorage');
    //     if (localKey) localState[localKey] = v;
    //   }

    //   if (!skipLocalStorage) {
    //     if (useIndexedDB) {
    //       await indexedDB.setItem(name, localState, newValue.version);
    //     } else {
    //       localStorage.setItem(name, localState, newValue.version);
    //     }
    //   }

    //   // ============== 处理 URL Storage  ============== //
    //   if (hasUrl) {
    //     // 转换 key 为目标 key
    //     const finalEntries = Object.entries(newValue.state)
    //       .map(([k, v]) => {
    //         const urlKey = mapStateKeyToStorageKey(k, 'url');
    //         if (!urlKey) return undefined;
    //         return [urlKey, v];
    //       })
    //       .filter(Boolean) as [string, any][];

    //     urlStorage.setItem(name, Object.fromEntries(finalEntries));
    //   }
    // },
  };
};
