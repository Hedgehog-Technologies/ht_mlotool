import { create } from "zustand";
import { useGeneralStore } from "@/store/general";
import { fetchNui } from "@/utils/fetchNui";

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
    fetchNui("ht_mlotool:nui:exitTool", useGeneralStore.getState().interior);
  }
}));
