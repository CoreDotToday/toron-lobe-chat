import { devtools } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { isDev } from '@/utils/env';

import { ClassStoreAction, createClassSlice } from './action';
import { ClassStoreState, initialState } from './initialState';

//  ===============  聚合 createStoreFn ============ //

export type ClassStore = ClassStoreAction & ClassStoreState;

const createStore: StateCreator<ClassStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...createClassSlice(...parameters),
});

//  ===============  实装 useStore ============ //

export const useClassStore = createWithEqualityFn<ClassStore>()(
  devtools(createStore, {
    name: 'Class' + (isDev ? '_DEV' : ''),
  }),
  shallow,
);
