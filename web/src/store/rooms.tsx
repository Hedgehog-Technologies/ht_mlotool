import { create } from "zustand";
import { SelectData, StringField } from ".";
import { InteriorRoom, RoomDat151Fields } from "@/types";

export interface RoomsStoreState {
  // RoomSelect
  roomSelectList: SelectData[];
  selectedRoom: StringField;

  // Room Tracking
  roomList: InteriorRoom[];
  activeRoom: InteriorRoom | null;
  // roomList: RoomDef[];
  // activeRoom: RoomDef | null;

  // Actions
  setDat151Fields: (fieldState: RoomDat151Fields) => void;
  setActiveRoom: (value: InteriorRoom | null) => void;
  setSelectedRoom: (value: StringField) => void;
};

export const useRoomsStore = create<RoomsStoreState>((set, get) => ({
  // RoomSelect
  roomSelectList: [{ value: '0', label: '0. Room Zero'}, {value: '1', label: '1. Room One'}, {value: '2', label: '2. Room Two'}],
  selectedRoom: null,

  // Room Tracking
  roomList: [],
  activeRoom: null,

  // Actions
  setDat151Fields: (fieldState) => {
    var room = get().activeRoom;
    if (!room) return;
    room.dat151 = fieldState;
  },
  setActiveRoom: (value) => set({ activeRoom: value }),
  setSelectedRoom: (value) => set({ selectedRoom: value }),
}));
