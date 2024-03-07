import { create } from "zustand";

export interface IRP {
  isDefault: boolean;
  name: string;
  unk01: number;
  unk02: number;
  unk03: number;
  unk04: number;
  unk05: number;
  [index: string]: string | number | boolean;
}

export interface IRPStoreState {
  params: IRP[];

  // actions
  addParam: (val: IRP) => void;
}

const defaultParams: IRP[] = [
  {
    name: "hash_43BD9A63",
    unk01: 0.8,
    unk02: 0.15,
    unk03: 24000,
    unk04: 0,
    unk05: 0.18,
    isDefault: true
  },
  {
    name: "hash_C3967E5B",
    unk01: 0.8,
    unk02: 0.15,
    unk03: 3000,
    unk04: 0,
    unk05: 0.15,
    isDefault: true
  },
  {
    name: "hash_790FC876",
    unk01: 0.9,
    unk02: 0.15,
    unk03: 24000,
    unk04: 0,
    unk05: 0.25,
    isDefault: true
  },
  {
    name: "hash_E9387973",
    unk01: 0.8,
    unk02: 0.15,
    unk03: 3000,
    unk04: 0,
    unk05: 0.2,
    isDefault: true
  },
  {
    name: "hash_3AF191C8",
    unk01: 1.0,
    unk02: 1.0,
    unk03: 24000,
    unk04: 0,
    unk05: 0.0,
    isDefault: true
  },
  {
    name: "hash_76A27681",
    unk01: 0.8,
    unk02: 1.0,
    unk03: 24000,
    unk04: 60,
    unk05: 0.6,
    isDefault: true
  },
  {
    name: "hash_D8D37FA8",
    unk01: 0.8,
    unk02: 0.15,
    unk03: 3000,
    unk04: 10,
    unk05: 0.25,
    isDefault: true
  },
  {
    name: "hash_F39F0E9F",
    unk01: 0.9,
    unk02: 0.15,
    unk03: 24000,
    unk04: 20,
    unk05: 2.5,
    isDefault: true
  },
  {
    name: "hash_DA331087",
    unk01: 0.8,
    unk02: 0.15,
    unk03: 3000,
    unk04: 35,
    unk05: 0.8,
    isDefault: true
  },
  {
    name: "hash_A0B9C68F",
    unk01: 0.8,
    unk02: 0.15,
    unk03: 24000,
    unk04: 35,
    unk05: 0.8,
    isDefault: true
  },
  {
    name: "hash_56D77920",
    unk01: 0.8,
    unk02: 0.15,
    unk03: 3000,
    unk04: 0,
    unk05: 0.0,
    isDefault: true
  },
  {
    name: "hash_45582E60",
    unk01: 0.8,
    unk02: 0.15,
    unk03: 24000,
    unk04: 0,
    unk05: 0.0,
    isDefault: true
  },
  {
    name: "hash_D3E5522A",
    unk01: 0.8,
    unk02: 0.15,
    unk03: 24000,
    unk04: 0,
    unk05: 0.4,
    isDefault: true
  },
  {
    name: "hash_164E6019",
    unk01: 1.0,
    unk02: 1.0,
    unk03: 24000,
    unk04: 0,
    unk05: 0.15,
    isDefault: true
  },
  {
    name: "hash_2EACAD78",
    unk01: 0.9,
    unk02: 1.0,
    unk03: 24000,
    unk04: 35,
    unk05: 0.8,
    isDefault: true
  },
  {
    name: "hash_F8B69D6D",
    unk01: 1.0,
    unk02: 0.6,
    unk03: 24000,
    unk04: 0,
    unk05: 0.15,
    isDefault: true
  },
  {
    name: "hash_40ABC5BA",
    unk01: 0.5,
    unk02: 0.15,
    unk03: 8000,
    unk04: 0,
    unk05: 0.25,
    isDefault: true
  },
  {
    name: "hash_2EACAD78",
    unk01: 0.9,
    unk02: 1.0,
    unk03: 24000,
    unk04: 35,
    unk05: 0.8,
    isDefault: true
  },
  {
    name: "hash_F8B69D6D",
    unk01: 1.0,
    unk02: 0.6,
    unk03: 24000,
    unk04: 0,
    unk05: 0.15,
    isDefault: true
  },
  {
    name: "hash_40ABC5BA",
    unk01: 0.5,
    unk02: 0.15,
    unk03: 8000,
    unk04: 0,
    unk05: 0.25,
    isDefault: true
  }
];

export const useIRPStore = create<IRPStoreState>((set) => ({
  params: [...defaultParams],

  // actions
  addParam: (val) => set((prev) => ({ params: [val, ...prev.params] }))
}));
