import { create } from "zustand";
import { BooleanField } from ".";
import { Interior } from "@/types";

export interface GeneralStoreState {
  interior: Interior | null;
  enableAudioOcclusion: BooleanField;
  enableDat151: BooleanField;
  enableDebug: BooleanField;

  // Actions
  toggleCheck: (t: "enableAudioOcclusion" | "enableDat151" | "enableDebug") => void;
  updateInteriorSaveName: (newName: string) => void;
};

export const useGeneralStore = create<GeneralStoreState>((set, get) => ({
  interior: null,
  enableAudioOcclusion: true,
  enableDat151: true,
  enableDebug: false,

  // Actions
  toggleCheck: (t) => set((state) => ({ [t]: !state[t] })),
  updateInteriorSaveName: (newName) => set({ interior: { ...get().interior!, saveName: newName }})
}));
