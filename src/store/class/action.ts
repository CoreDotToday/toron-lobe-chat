import { StateCreator } from 'zustand/vanilla';

import { ClassStore } from './store';

export interface ClassStoreAction {
  setClassUid: (uid: string) => void;
}

export const createClassSlice: StateCreator<
  ClassStore,
  [['zustand/devtools', never]],
  [],
  ClassStoreAction
> = (set) => ({
  setClassUid: (classUid) => set({ classUid }), // setUid 액션 구현
});
