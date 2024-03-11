import { create } from "zustand";
import { BooleanField, NumberField } from "@/types";

export interface PortalsStoreState {
  // DebugToggles
  enablePortalOutline: BooleanField;
  enablePortalFill: BooleanField;
  enablePortalInfo: BooleanField;

  // PortalToggles
  navigatedPortal: NumberField;

  // EntityToggles
  debugEntities: { [index: string]: boolean }

  // Scroll Area State
  scrollPosition: { x: number, y: number };

  // Actions
  setNavigatedPortal: (portal: NumberField) => void;
  addDebugEntity: (key: string, value: boolean) => void;
  resetDebugEntities: () => void;
  toggleSwitch: (t: "enablePortalOutline" | "enablePortalFill" | "enablePortalInfo") => void;
  setScrollPosition: (pos: { x: number, y: number }) => void;
};

export const usePortalsStore = create<PortalsStoreState>((set, get) => ({
  // DebugToggles
  enablePortalOutline: false,
  enablePortalFill: false,
  enablePortalInfo: false,

  // PortalToggles
  navigatedPortal: null,

  // EntityToggles
  debugEntities: {},

  // Scroll Area State
  scrollPosition: { x: 0, y: 0 },

  // Actions
  setNavigatedPortal: (portal) => set({ navigatedPortal: portal }),
  toggleSwitch: (t) => set((state) => ({ [t]: !state[t] })),
  setScrollPosition: (pos) => set({ scrollPosition: pos }),

  addDebugEntity: (key, value) => set({ debugEntities: { ...get().debugEntities, [key]: value } }),
  resetDebugEntities: () => set({ debugEntities: {} })
}));
