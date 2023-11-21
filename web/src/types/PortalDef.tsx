import { EntityDef } from "./EntityDef";

interface PortalDefConstructor {
  isEnabled: boolean[];
  mloPortalIndex: number;
  fromRoomIndex: number;
  toRoomIndex: number;
  flags: number;
  isMirror: boolean;
  entities: [];
};

export class PortalDef {
  public mloPortalIndex: number;
  public fromRoomIndex: number;
  public toRoomIndex: number;
  public flags: number;
  public isMirror: boolean;
  public isEnabled: boolean[];
  public entities: EntityDef[];

  constructor({ isEnabled, mloPortalIndex, fromRoomIndex, toRoomIndex, flags, isMirror, entities }: PortalDefConstructor) {
    this.isEnabled = isEnabled;
    this.mloPortalIndex = mloPortalIndex;
    this.fromRoomIndex = fromRoomIndex;
    this.toRoomIndex = toRoomIndex;
    this.flags = flags;
    this.isMirror = isMirror;
    this.entities = entities.map(entity => new EntityDef(entity));
  }
}
