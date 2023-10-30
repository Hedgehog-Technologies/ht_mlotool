interface EntityDefConstructor {
  linkType: number;
  maxOcclusion: number;
  modelHashKey: number;
  isDoor: boolean;
  isGlass: boolean;
  modelName: string;
}

export class EntityDef {
  public linkType: number;
  public maxOcclusion: number;
  public modelHashKey: number;
  public modelName: string;
  public isDoor: boolean;
  public isGlass: boolean;

  constructor({ linkType, maxOcclusion, modelHashKey, isDoor, isGlass, modelName }: EntityDefConstructor) {
    this.linkType = linkType;
    this.maxOcclusion = maxOcclusion;
    this.modelHashKey = modelHashKey;
    this.isDoor = isDoor;
    this.isGlass = isGlass;
    this.modelName = modelName;
  }
}
