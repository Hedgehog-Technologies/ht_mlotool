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

---@alias PortalCornerIndex 0|1|2|3
---@alias TPortalCornerCoordinates table<PortalCornerIndex, vector3>
---@alias TPortalCorners table<number, TPortalCornerCoordinates>
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
---@field savedMloDir string
---@field savedMloDirPath string
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
---@field dat151 TRoomDat151Fields

---@class TRoomDat151Fields
---@field occlRoomName string
---@field flags string
---@field ambientZone string
---@field interiorType number
---@field reverbSmall number
---@field reverbMedium number
---@field reverbLarge number
---@field roomToneSound string
---@field rainType number
---@field exteriorAudibility number
---@field roomOcclusionDamping number
---@field nonMarkedPortalOcclusion number
---@field distanceFromPortalForOcclusion number
---@field distanceFromPortalFadeDistance number
---@field weaponMetrics string
---@field interiorWallaSoundSet string

---@class TInteriorPortalData
---@field version number?
---@field isEnabled [boolean, boolean]
---@field interiorPortalIndex number
---@field fromRoomIndex number
---@field toRoomIndex number
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

---@class NInteriorData
---@field saveName string
---@field rooms NInteriorRoomData[]
---@field portals NInteriorPortalData[]

---@class NInteriorRoomData
---@field dat151 TRoomDat151Fields

---@class NInteriorPortalData
---@field isEnabled [boolean, boolean]
---@field entities NInteriorPortalEntityData[]

---@class NInteriorPortalEntityData
---@field maxOcclusion number
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
---@field quatMult fun(a: quat|{ w: number, x: number, y: number, z: number }, b: vector3|{ x: number, y: number, z: number }): vector3

---@class ClientUtilsApi : UtilsApi
---@field sendReactMessage fun(action: string, data: any)

---@class ServerUtilsApi : UtilsApi
---@field canUseOpenMloCmd fun(playerId: number|string): boolean
---@field canUseSaveMloCmd fun(playerId: number|string): boolean

-- ##### Other Custom Types ##### --

---@alias PortalFlags
---| 0 # null
---| 1 # One-Way
---| 2 # Link Interiors Together
---| 4 # Mirror
---| 8 # Disable Timecycle Modifier
---| 16 # Mirror Using Expensive Shaders
---| 32 # Low LOD Only
---| 64 # Hide When Door Closed
---| 128 # Mirror Can See Directional
---| 256 # Mirror Using Portal Traversal
---| 512 # Mirror Floor
---| 1024 # Mirror Can See Exterior View
---| 2048 # Water Surface
---| 4096 # Water Surface Extend To Horizon
---| 8192 # Use Light Bleed
