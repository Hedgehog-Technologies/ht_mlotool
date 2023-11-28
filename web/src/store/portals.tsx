import create, { GetState, SetState } from "zustand";
import { BooleanField, NumberField } from ".";

export interface PortalsStoreState {
  // DebugToggles
  enablePortalOutline: BooleanField;
  enablePortalFill: BooleanField;
  enablePortalInfo: BooleanField;

  // PortalToggles
  navigatedPortal: NumberField;
};

interface PortalsStateSetters {
  // DebugToggles
  toggleSwitch: (type: 'enablePortalOutline' | 'enablePortalFill' | 'enablePortalInfo') => void;

  // PortalToggles
  setNavigatedPortal: (portal: PortalsStoreState['navigatedPortal']) => void;
};

export const usePortalsStore = create<PortalsStoreState>(() => ({
  // DebugToggles
  enablePortalOutline: false,
  enablePortalFill: false,
  enablePortalInfo: false,

  // PortalToggles
  navigatedPortal: null
}));

export const defaultPortalsState = usePortalsStore.getState();

export const usePortalsSetters = create<PortalsStateSetters>((set: SetState<PortalsStateSetters>, get: GetState<PortalsStateSetters>) => ({
  // DebugToggles
  // @ts-ignore
  toggleSwitch: (toggleType) => usePortalsStore.setState((state) => ({ [toggleType]: !state[toggleType] })),

  // PortalToggles
  setNavigatedPortal: (portal) => usePortalsStore.setState({ navigatedPortal: portal })
}));
