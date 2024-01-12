import { Vector3 } from ".";
import { EntityDef } from "./EntityDef";
import { PortalDef } from "./PortalDef";
import { RoomDef } from "./RoomDef";

export interface MLODefConstructor {
  interiorId: number;
  saveName: string;
  nameHash: number;
  uintNameHash: number;
  location: Vector3;
  proxyHash: number;
  uintProxyHash: number;
  rooms: [];
  portals: [];
}

export class MLODef {
  public interiorId: number;
  public saveName: string = "";
  public nameHash: number;
  public uintNameHash: number;
  public location: Vector3;
  public locationString: string;
  public proxyHash: number;
  public uintProxyHash: number;
  public rooms: RoomDef[];
  public portals: PortalDef[];

  constructor(data: MLODefConstructor | MLODef) {
    this.interiorId = data.interiorId;
    this.nameHash = data.nameHash;
    this.uintNameHash = data.uintNameHash;
    this.location = data.location;
    this.locationString = `${data.location.x.toFixed(4)}, ${data.location.y.toFixed(4)}, ${data.location.z.toFixed(4)}`;
    this.proxyHash = data.proxyHash;
    this.uintProxyHash = data.uintProxyHash;

    this.saveName = data.saveName;
    this.rooms = data.rooms.map(room => new RoomDef(room));
    this.portals = data.portals.map(portal => new PortalDef(portal));
  }

  SetPortalEnabled(portalIndex: number, enabled: boolean[]) {
    this.portals[portalIndex].isEnabled = enabled;
  }

  SetPortalEntity(portalIndex: number, entityIndex: number, entity: EntityDef) {
    this.portals[portalIndex].entities[entityIndex] = entity;
  }

  SetSaveName(newName: string) {
    this.saveName = newName;
  }
}
