import create, { GetState, SetState } from "zustand";
import { SelectData } from ".";
import { RoomDef } from "../types/RoomDef";

export interface RoomsStoreState {
  // RoomSelect
  roomSelectList: SelectData[];
  selectedRoom: string | null;

  // Room Tracking
  roomList: RoomDef[];
  activeRoom: RoomDef | null;
};

export interface RoomsStateSetters {
  // RoomSelect
  setSelectedRoom: (value: RoomsStoreState['selectedRoom']) => void;

  // Room Tracking
  setActiveRoom: (value: RoomsStoreState['activeRoom']) => void;
};

export const useRoomsStore = create<RoomsStoreState>(() => ({
  // RoomSelect
  roomSelectList: [{ value: '0', label: '0. Room Zero'}, {value: '1', label: '1. Room One'}, {value: '2', label: '2. Room Two'}],
  selectedRoom: null,

  // Room Tracking
  roomList: [],
  activeRoom: null
}));

export const defaultRoomsState = useRoomsStore.getState();

export const useRoomsSetters = create<RoomsStateSetters>((set: SetState<RoomsStateSetters>, get: GetState<RoomsStateSetters>) => ({
  // RoomSelect
  setSelectedRoom: (value) => useRoomsStore.setState({ selectedRoom: value }),

  // Room Tracking
  setActiveRoom: (value) => useRoomsStore.setState({ activeRoom: value })
}));
