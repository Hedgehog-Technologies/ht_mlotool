import { Vector3 } from ".";
import { EntityDef } from "./EntityDef";
import { PortalDef } from "./PortalDef";
import { RoomDef } from "./RoomDef";

interface MLODefConstructor {
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
  public saveName: string = '';
  public nameHash: number;
  public uintNameHash: number;
  public location: Vector3;
  public locationString: string;
  public proxyHash: number;
  public uintProxyHash: number;
  public rooms: RoomDef[];
  public portals: PortalDef[];

  constructor({ interiorId, saveName, nameHash, uintNameHash, location, proxyHash, uintProxyHash, rooms, portals }: MLODefConstructor) {
    this.interiorId = interiorId;
    this.nameHash = nameHash;
    this.uintNameHash = uintNameHash;
    this.location = location;
    this.locationString = `${location.x.toFixed(4)}, ${location.y.toFixed(4)}, ${location.z.toFixed(4)}`;
    this.proxyHash = proxyHash;
    this.uintProxyHash = uintProxyHash;

    this.saveName = saveName;
    this.rooms = rooms.map(room => new RoomDef(room));
    this.portals = portals.map(portal => new PortalDef(portal));
  }

  SetPortalEnabled(portalIndex: number, enabled: boolean[]) {
    this.portals[portalIndex].isEnabled = enabled;
  }

  SetPortalEntity(portalIndex: number, entityIndex: number, entity: EntityDef) {
    this.portals[portalIndex].entities[entityIndex] = entity;
  }
}
