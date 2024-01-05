import { create }from "zustand";
import { BooleanField, NumberField } from ".";

export interface PortalsStoreState {
  // DebugToggles
  enablePortalOutline: BooleanField;
  enablePortalFill: BooleanField;
  enablePortalInfo: BooleanField;

  // PortalToggles
  navigatedPortal: NumberField;

  // Actions
  setNavigatedPortal: (portal: NumberField) => void;
  toggleSwitch: (t: "enablePortalOutline" | "enablePortalFill" | "enablePortalInfo") => void;
};

export const usePortalsStore = create<PortalsStoreState>((set) => ({
  // DebugToggles
  enablePortalOutline: false,
  enablePortalFill: false,
  enablePortalInfo: false,

  // PortalToggles
  navigatedPortal: null,

  // Actions
  setNavigatedPortal: (portal) => set({ navigatedPortal: portal }),
  toggleSwitch: (t) => set((state) => ({ [t]: !state[t] }))
}));

export const defaultPortalsState = usePortalsStore.getState();
