import { create } from "zustand";

export interface SharedStoreState {
  ignoreEscape: boolean;

  // actions
  setIgnoreEscape: (val: boolean) => void;
}

export const useSharedStore = create<SharedStoreState>((set, get) => ({
  ignoreEscape: false,

  // actions
  setIgnoreEscape: (val) => set({ ignoreEscape: val })
}));