import create, { GetState, SetState } from "zustand";
import { BooleanField } from ".";

export interface PortalsDebugStoreState {
  enablePortalOutline: BooleanField;
  enablePortalFill: BooleanField;
  enablePortalInfo: BooleanField;
};

interface PortalsDebugStateSetters {
  toggleSwitch: (type: 'enablePortalOutline' | 'enablePortalFill' | 'enablePortalInfo') => void;
};

export const usePortalsDebugStore = create<PortalsDebugStoreState>(() => ({
  enablePortalOutline: false,
  enablePortalFill: false,
  enablePortalInfo: false
}));

export const defaultPortalsDebugState = usePortalsDebugStore.getState();

export const usePortalsDebugSetters = create<PortalsDebugStateSetters>((set: SetState<PortalsDebugStateSetters>, get: GetState<PortalsDebugStateSetters>) => ({
  // @ts-ignore
  toggleSwitch: (toggleType) => usePortalsDebugStore.setState((state) => ({ [toggleType]: !state[toggleType] }))
}));
