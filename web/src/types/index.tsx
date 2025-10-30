export type Vector3 = {
  x: number;
  y: number;
  z: number;
}

export type InteriorPortalEntity = {
  index: number;
  linkType: number;
  maxOcclusion: number;
  modelHashKey: number;
  modelName: string;
  isDoor: boolean;
  isGlass: boolean;
}

export type InteriorPortal = {
  isEnabled: [boolean, boolean];
  interiorPortalIndex: number;
  globalPortalIndices: [number, number];
  fromRoomIndex: number;
  toRoomIndex: number;
  flags: number;
  isMirror: boolean;
  entityCount: number;
  entities: InteriorPortalEntity[];
}

export type RoomDat151Fields = {
  occlRoomName: string;
  flags: string;
  ambientZone: string;
  interiorType: number;
  reverbSmall: number;
  reverbMedium: number;
  reverbLarge: number;
  roomToneSound: string;
  rainType: number;
  exteriorAudibility: number;
  roomOcclusionDamping: number;
  nonMarkedPortalOcclusion: number;
  distanceFromPortalForOcclusion: number;
  distanceFromPortalFadeDistance: number;
  weaponMetrics: string;
  interiorWallaSoundSet: string;
}

export type InteriorRoom = {
  index: number;
  name: string;
  displayName: string;
  nameHash: number;
  uintNameHash: number;
  roomKey: number;
  uintRoomKey: number;
  portalCount: number;
  dat151: RoomDat151Fields;
}

export type Interior = {
  interiorId: number;
  location: Vector3;
  nameHash: number;
  uintNameHash: number;
  saveName: string;
  name: string;
  proxyHash: number;
  uintProxyHash: number;
  roomCount: number;
  rooms: InteriorRoom[];
  portalCount: number;
  portals: InteriorPortal[];
  globalPortalCount: number;
}
