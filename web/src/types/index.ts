export type SelectData = { value: string, label: string };
export type StringField = string | null | undefined;
export type NumberField = number | null | undefined;
export type BooleanField = boolean | null | undefined;

export type Vector3 = {
  x: number;
  y: number;
  z: number;
}

export type LuaEntity = {
  entityModelHashKey: number;
  entityModelName?: string;
}

export type LuaPortal = {
   fromRoom: number;
   toRoom: number;
   roomPortalIndex: number;
   mloPortalIndex: number;
   globalPortalIndex: number;
   flags: number;
   entities?: LuaEntity[];
}

export type LuaRoom = {
  index: number;
  name: string;
  nameHash: number;
  uintNameHash: number;
  roomKey: number;
  uintRoomKey: number;
  portals?: LuaPortal[];
}

export type LuaMLO = {
  interiorId: number;
  location: Vector3;
  saveName: string;
  nameHash: number;
  uintNameHash: number;
  proxyHash: number;
  uintProxyHash: number;
  rooms?: LuaRoom[];
  portals?: LuaPortal[];
}

export * from "./EntityDef";
export * from "./MLODef";
export * from "./PortalDef";
export * from "./RoomDef";
