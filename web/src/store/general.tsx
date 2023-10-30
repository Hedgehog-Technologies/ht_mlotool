import create, { GetState, SetState } from 'zustand';
import { BooleanField, } from '.';
import { MLODef } from '../types/MLODef';

export interface GeneralStoreState {
  mlo: MLODef | null;
  batchEdit: BooleanField;
  enableAudioOcclusion: BooleanField;
  enableDat151: BooleanField;
  enableDebug: BooleanField;
};

interface GeneralStateSetters {
  setMLO: (value: GeneralStoreState['mlo']) => void;
  setBatchEdit: (value: GeneralStoreState['batchEdit']) => void;
  setEnableDebug: (value: GeneralStoreState['enableDebug']) => void;
  toggleSwitch: (type: 'batchEdit' | 'enableDebug' | 'enableAudioOcclusion' | 'enableDat151') => void;
};

export const useGeneralStore = create<GeneralStoreState>(() => ({
  mlo: null,
  batchEdit: false,
  enableAudioOcclusion: true,
  enableDat151: true,
  enableDebug: false,
}));

export const defaultGeneralState = useGeneralStore.getState();

export const useGeneralSetters = create<GeneralStateSetters>((set: SetState<GeneralStateSetters>, get: GetState<GeneralStateSetters>) => ({
  setMLO: (value) => useGeneralStore.setState({ mlo: value }),
  setBatchEdit: (value) => useGeneralStore.setState({ batchEdit: value }),
  setEnableDebug: (value) => useGeneralStore.setState({ enableDebug: value }),
  // @ts-ignore
  toggleSwitch: (toggleType) => useGeneralStore.setState((state) => ({ [toggleType]: !state[toggleType] })),
}));
