import { create } from "zustand";
import { Vector3 } from "@/types";

export interface StaticEmitter {
  // <Name>hash_B217FE2C</Name>
  name: string;
  //  <Flags value="0xAA040001" />
  flags: string;
  //  <ChildSound>hash_13E33FE0</ChildSound>
  childSound: string;
  //  <RadioStation />
  radioStation: string;
  //  <Position x="1823.44" y="2571.38" z="48.09" />
  position: string;
  //  <MinDistance value="0" />
  minDistance: number;
  //  <MaxDistance value="600" />
  maxDistance: number;
  //  <EmittedVolume value="0" />
  emittedVolume: number;
  //  <LPFCutoff value="23900" />
  lpfCutoff: number;
  //  <HPFCutoff value="0" />
  hpfCutoff: number;
  //  <RolloffFactor value="100" />
  rolloffFactor: number;
  //  <Interior />
  interior: string;
  //  <Room />
  room: string;
  //  <RadioStationForScore />
  radioStationForScore: string;
  //  <MaxLeakage value="1" />
  maxLeakage: number;
  //  <MinLeakageDistance value="0" />
  minLeakageDistance: number;
  //  <MaxLeakageDistance value="0" />
  maxLeakageDistance: number;
  //  <Alarm>hash_C90764DC</Alarm>
  alarm: string;
  //  <OnBreakOneShot>null_sound</OnBreakOneShot>
  onBreakOneShot: string;
  //  <MaxPathDepth value="3" />
  maxPathDepth: number;
  //  <SmallReverbSend value="0" />
  smallReverbSend: number;
  //  <MediumReverbSend value="0" />
  mediumReverbSend: number;
  //  <LargeReverbSend value="0" />
  largeReverbSend: number;
  //  <MinTimeMinutes value="0" />
  minTimeMinutes: number;
  //  <MaxTimeMinutes value="1440" />
  maxTimeMinutes: number;
  //  <BrokenHealth value="0.94" />
  brokenHealth: number;
  //  <UndamagedHealth value="0.99" />
  undamagedHealth: number;
};

export const DefaultStaticEmitter: StaticEmitter = {
  name: "",
  flags: "AA041401",
  childSound: "null_sound",
  radioStation: "0",
  position: "0.0, 0.0, 0.0",
  minDistance: 0,
  maxDistance: 50,
  emittedVolume: 0,
  lpfCutoff: 23900,
  hpfCutoff: 0,
  rolloffFactor: 100,
  interior: "",
  room: "",
  radioStationForScore: "",
  maxLeakage: 1.0,
  minLeakageDistance: 0,
  maxLeakageDistance: 0,
  alarm: "0",
  onBreakOneShot: "null_sound",
  maxPathDepth: 3,
  smallReverbSend: 0,
  mediumReverbSend: 0,
  largeReverbSend: 0,
  minTimeMinutes: 0,
  maxTimeMinutes: 1440,
  brokenHealth: 0.94,
  undamagedHealth: 0.99
};

export interface EmitterStoreState {
  modalIndex: number;

  // actions
  setModalIndex: (val: number) => void;
};

export const useEmitterStore = create<EmitterStoreState>((set, get) => ({
  modalIndex: -1,

  // actions
  setModalIndex: (val) => set({ modalIndex: val })
}));
