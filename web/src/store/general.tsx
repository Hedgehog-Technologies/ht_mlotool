import { create } from "zustand";
import { BooleanField } from ".";
import { MLODef } from "../types/MLODef";

export interface GeneralStoreState {
  mlo: MLODef | null;
  enableAudioOcclusion: BooleanField;
  enableDat151: BooleanField;
  enableDebug: BooleanField;

  // Actions
  toggleCheck: (t: "enableAudioOcclusion" | "enableDat151" | "enableDebug") => void;
  updateMLOSaveName: (newName: string) => void;
};

export const useGeneralStore = create<GeneralStoreState>((set, get) => ({
  mlo: null,
  enableAudioOcclusion: true,
  enableDat151: true,
  enableDebug: false,

  // Actions
  toggleCheck: (t) => set((state) => ({ [t]: !state[t] })),
  updateMLOSaveName: (newName) => {
    let oldMLO = get().mlo;

    if (oldMLO !== null)
    {
      let newMLO = new MLODef(oldMLO);
      newMLO.saveName = newName;
      set({ mlo: newMLO });
    }
  }
}));
