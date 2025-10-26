---@meta

---@class TXmlTag
---@field tagName string
---@field attr TXmlAttr?
---@field value any?
---@field content TXmlTag[]?
---@field comment any?

---@class TXmlAttr
---@field itemType string?
---@field type string?
---@field ntOffset number?
---@field value any?

---@class TDrawEntityData
---@field entity number?
---@field portalIndex number
---@field entityIndex number
---@field debug boolean
---@field position vector3
---@field archetype number

---@alias DDrawEntityTracking { [string]: TDrawEntityData }

---@alias TPortalCorners table<number, table<number, vector3>>
---@alias TPortalCrossVectors table<number, vector3>
---@alias TPortalConnections table<number, [ number, number ]>

---@class Config
---@field serverToClientBPS number
---@field clientToServerBPS number

---@class ClientConstants
---@field cInteriorSchemaVersion number
---@field cInteriorRoomSchemaVersion number
---@field cInteriorPortalSchemaVersion number
---@field cInteriorPortalEntitySchemaVersion number

---@class ServerConstants
---@field systemIsWindows boolean
---@field resourcePath string
---@field savedInteriorDir string
---@field savedInteriorDirPath string
---@field generatedFilesDir string
---@field generatedFilesDirPath string

---@class TInteriorData
---@field version number?
---@field interiorId number?
---@field location vector3
---@field nameHash number
---@field uintNameHash number
---@field saveName string
---@field name string
---@field originalProxyHash number
---@field proxyHash number
---@field uintProxyHash number
---@field roomCount number
---@field rooms TInteriorRoomData[]
---@field portalCount number
---@field portals TInteriorPortalData[]
---@field globalPortalCount number?

---@class TInteriorRoomData
---@field version number?
---@field index number
---@field name string
---@field displayName string
---@field nameHash number
---@field uintNameHash number
---@field originalRoomKey number
---@field roomKey number
---@field uintRoomKey number
---@field portalCount number
---@field dat151 RoomDat151Fields

---@class TInteriorPortalData
---@field version number?
---@field isEnabled [boolean, boolean]
---@field interiorPortalIndex number
---@field fromRoomIndex number
---@field toRoomIndex number
---@field flags number
---@field isMirror boolean
---@field entityCount number
---@field entities TInteriorPortalEntityData[]

---@class TInteriorPortalEntityData
---@field version number?
---@field index number
---@field linkType number
---@field maxOcclusion number
---@field modelHashKey number
---@field modelName string
---@field isDoor boolean
---@field isGlass boolean

-- ##### APIs ##### --

---@class DebugDrawApi
---@field updateDebugDraw fun(enablePortalInfo: boolean, enablePortalOutline: boolean, enablePortalFill: boolean, navigatedPortal: number)
---@field updateDebugEntities fun(portalIndex: number, entityIndex: number, debug: boolean)

---@class EncodersApi
---@field encodeAudioOcclusion fun(interior: CInterior, audioOcclusion: CAudioOcclusion): [ TXmlTag ]
---@field encodeDat151 fun(interior: CInterior): [ TXmlTag ]

---@class HTFileApi
---@field createDirectory fun(path: string): boolean
---@field getFilesInDirectory fun(path: string, pattern: string): string[]|nil, number
---@field readFile fun(source: number?, filepath: string, filename: string, filetype: string): string|nil
---@field writeFile fun(source: number?, filepath: string, filename: string, filetype: string, data: string): boolean

---@class InteriorCacheApi
---@field addInterior fun(interior: CInterior)
---@field generateInteriorFiles fun(interiorData: table, generateAO: boolean, generateDat151: boolean, debug: boolean)
---@field getInterior fun(interiorId: number): CInterior
---@field updateInteriorData fun(interiorData: table): CInterior

---@class InteriorFileCacheApi
---@field initializeCache fun()
---@field getDataForInterior fun(source: number|string|nil, nameHash: number|string, forceReload: boolean?): TInteriorData?

---@class UtilsApi
---@field toInt32 fun(value: number): number
---@field toUInt32 fun(value: number): number
---@field toXml fun(tbl: [ TXmlTag ], debug: boolean): string[]

---@class ClientUtilsApi : UtilsApi
---@field sendReactMessage fun(action: string, data: any)

---@class ServerUtilsApi : UtilsApi
---@field canUseOpenMloCmd fun(playerId: number|string): boolean
---@field canUseSaveMloCmd fun(playerId: number|string): boolean
