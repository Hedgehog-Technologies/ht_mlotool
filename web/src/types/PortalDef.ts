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

  constructor(data: PortalDefConstructor | PortalDef) {
    this.isEnabled = data.isEnabled;
    this.mloPortalIndex = data.mloPortalIndex;
    this.fromRoomIndex = data.fromRoomIndex;
    this.toRoomIndex = data.toRoomIndex;
    this.flags = data.flags;
    this.isMirror = data.isMirror;
    this.entities = data.entities.map(entity => new EntityDef(entity));
  }
}
