import { create } from "zustand";

export interface SharedStoreState {
  ignoreEscape: boolean;
  opacity: number;

  // actions
  setIgnoreEscape: (val: boolean) => void;
  setOpacity: (val: number) => void;
}

export const useSharedStore = create<SharedStoreState>((set, get) => ({
  ignoreEscape: false,
  opacity: 1,

  // actions
  setIgnoreEscape: (val) => set({ ignoreEscape: val }),
  setOpacity: (val) => set({ opacity: val })
}));