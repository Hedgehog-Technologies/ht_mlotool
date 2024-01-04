import { create } from "zustand";
import { SelectData, StringField } from ".";
import { RoomDef } from "../types/RoomDef";

export interface RoomsStoreState {
  // RoomSelect
  roomSelectList: SelectData[];
  selectedRoom: StringField;

  // Room Tracking
  roomList: RoomDef[];
  activeRoom: RoomDef | null;

  // Actions
  setSelectedRoom: (value: StringField) => void;
  setActiveRoom: (value: RoomDef | null) => void;
};

export const useRoomsStore = create<RoomsStoreState>((set) => ({
  // RoomSelect
  roomSelectList: [{ value: '0', label: '0. Room Zero'}, {value: '1', label: '1. Room One'}, {value: '2', label: '2. Room Two'}],
  selectedRoom: null,

  // Room Tracking
  roomList: [],
  activeRoom: null,

  // Actions
  setSelectedRoom: (value) => set({ selectedRoom: value }),
  setActiveRoom: (value) => set({ activeRoom: value })
}));

export const defaultRoomsState = useRoomsStore.getState();
