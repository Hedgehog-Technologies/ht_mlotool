import { create } from "zustand";
import { BooleanField } from ".";
import { Interior, InteriorPortalEntity } from "@/types";

export interface GeneralStoreState {
  interior: Interior | null;
  enableAudioOcclusion: BooleanField;
  enableDat151: BooleanField;
  enableDebug: BooleanField;

  // Actions
  setPortalEnabled: (portalIndex: number, enabled: [boolean, boolean]) => void;
  setPortalEntity: (portalIndex: number, entityIndex: number, entity: InteriorPortalEntity) => void;
  toggleCheck: (t: "enableAudioOcclusion" | "enableDat151" | "enableDebug") => void;
  updateInteriorSaveName: (newName: string) => void;
};

export const useGeneralStore = create<GeneralStoreState>((set, get) => ({
  interior: null,
  enableAudioOcclusion: true,
  enableDat151: true,
  enableDebug: false,

  // Actions
  setPortalEnabled: (portalIndex, enabled) => {
    var isEnabled = get().interior?.portals?.[portalIndex]?.isEnabled;
    if (!isEnabled) return;
    isEnabled = enabled;
  },
  setPortalEntity: (portalIndex, entityIndex, entity) => get().interior?.portals?.[portalIndex]?.entities?.splice(entityIndex, 1, entity),
  toggleCheck: (t) => set((state) => ({ [t]: !state[t] })),
  updateInteriorSaveName: (newName) => set({ interior: { ...get().interior!, saveName: newName }})
}));
