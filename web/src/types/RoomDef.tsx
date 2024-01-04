export interface Dat151Fields {
  flags: string;
  zone: string;
  unk02: number;
  unk03: number;
  reverb: number;
  echo: number;
  sound: string;
  unk07: number;
  unk08: number;
  unk09: number;
  unk10: number;
  unk11: number;
  unk12: number;
  unk13: string;
  soundSet: string;  
}

export interface RoomDefConstructor {
  index: number;
  name: string;
  displayName: string;
  nameHash: number;
  uintNameHash: number;
  roomKey: number;
  uintRoomKey: number;
  portalCount: number;

  // Dat151 Fields
  occlRoomName: string;
  flags: string;
  zone: string;
  unk02: number;
  unk03: number;
  reverb: number;
  echo: number;
  sound: string;
  unk07: number;
  unk08: number;
  unk09: number;
  unk10: number;
  unk11: number;
  unk12: number;
  unk13: string;
  soundSet: string;
}

export class RoomDef {
  public index: number;
  public name: string;
  public displayName: string;
  public nameHash: number;
  public uintNameHash: number;
  public roomKey: number;
  public uintRoomKey: number;
  public portalCount: number;

  // Dat151 fields
  public occlRoomName: string;
  public flags: string;
  public zone: string;
  public unk02: number;
  public unk03: number;
  public reverb: number;
  public echo: number;
  public sound: string;
  public unk07: number;
  public unk08: number;
  public unk09: number;
  public unk10: number;
  public unk11: number;
  public unk12: number;
  public unk13: string;
  public soundSet: string;

  constructor(data: RoomDefConstructor | RoomDef) {
    this.index = data.index;
    this.name = data.name;
    this.displayName = data.displayName
    this.nameHash = data.nameHash;
    this.uintNameHash = data.uintNameHash;
    this.roomKey = data.roomKey;
    this.uintRoomKey = data.uintRoomKey;
    this.portalCount = data.portalCount;

    // Dat151 Fields
    this.occlRoomName = data.occlRoomName;
    this.flags = data.flags;
    this.zone = data.zone;
    this.unk02 = data.unk02;
    this.unk03 = data.unk03;
    this.reverb = data.reverb;
    this.echo = data.echo;
    this.sound = data.sound;
    this.unk07 = data.unk07;
    this.unk08 = data.unk08;
    this.unk09 = data.unk09;
    this.unk10 = data.unk10;
    this.unk11 = data.unk11;
    this.unk12 = data.unk12;
    this.unk13 = data.unk13;
    this.soundSet = data.soundSet;
  }

  SetDat151Fields(data: Dat151Fields) {
    this.flags = data.flags;
    this.zone = data.zone;
    this.unk02 = data.unk02;
    this.unk03 = data.unk03;
    this.reverb = data.reverb;
    this.echo = data.echo;
    this.sound = data.sound;
    this.unk07 = data.unk07;
    this.unk08 = data.unk08;
    this.unk09 = data.unk09;
    this.unk10 = data.unk10;
    this.unk11 = data.unk11;
    this.unk12 = data.unk12;
    this.unk13 = data.unk13;
    this.soundSet = data.soundSet;
  }
}
