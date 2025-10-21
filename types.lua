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

---@class ServerConstants
---@field systemIsWindows boolean
---@field resourcePath string
---@field savedInteriorDir string
---@field savedInteriorDirPath string
---@field generatedFilesDir string
---@field generatedFilesDirPath string

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
---@field generateInteriorFiles fun(interiorData: table, generateAO: boolean, generateDat151: boolean, debug: boolean)
---@field getInterior fun(interiorId: number): CInterior
---@field updateInteriorData fun(interiorData: table): CInterior

---@class UtilsApi
---@field sendReactMessage fun(action: string, data: any) Client only
---@field toInt32 fun(value: number): number
---@field toUInt32 fun(value: number): number
---@field toXml fun(tbl: [ TXmlTag ], debug: boolean): string[]
