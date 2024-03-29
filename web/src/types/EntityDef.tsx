interface EntityDefConstructor {
  index: number;
  linkType: number;
  maxOcclusion: number;
  modelHashKey: number;
  isDoor: boolean;
  isGlass: boolean;
  modelName: string;
}

export class EntityDef {
  public index: number;
  public linkType: number;
  public maxOcclusion: number;
  public modelHashKey: number;
  public modelName: string;
  public isDoor: boolean;
  public isGlass: boolean;

  constructor(data: EntityDefConstructor | EntityDef) {
    this.index = data.index;
    this.linkType = data.linkType;
    this.maxOcclusion = data.maxOcclusion;
    this.modelHashKey = data.modelHashKey;
    this.isDoor = data.isDoor;
    this.isGlass = data.isGlass;
    this.modelName = data.modelName;
  }
}
