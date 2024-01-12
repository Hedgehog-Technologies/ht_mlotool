import { create } from "zustand";
import { BooleanField, NumberField } from ".";

export interface PortalsStoreState {
  // DebugToggles
  enablePortalOutline: BooleanField;
  enablePortalFill: BooleanField;
  enablePortalInfo: BooleanField;

  // PortalToggles
  navigatedPortal: NumberField;

  // Scroll Area State
  scrollPosition: { x: number, y: number };

  // Actions
  setNavigatedPortal: (portal: NumberField) => void;
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

  // Scroll Area State
  scrollPosition: { x: 0, y: 0 },

  // Actions
  setNavigatedPortal: (portal) => set({ navigatedPortal: portal }),
  toggleSwitch: (t) => set((state) => ({ [t]: !state[t] })),
  setScrollPosition: (pos) => set({ scrollPosition: pos })
}));
