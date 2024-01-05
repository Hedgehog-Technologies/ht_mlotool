import { create } from "zustand";
import { fetchNui } from "../utils/fetchNui";
import { useGeneralStore } from "../store/general";

interface VisibilityState {
  // State
  visible: boolean;

  // Actions
  setVisible: (value: boolean) => void;
  exitUI: () => void;
}

export const useVisibility = create<VisibilityState>((set, get) => ({
  // State
  visible: false,

  // Actions
  setVisible: (value) => set({ visible: value }),
  exitUI: () => {
    get().setVisible(false);
    fetchNui("ht_mlotool:exitMLO", { mloData: useGeneralStore.getState().mlo });
  }
}));
