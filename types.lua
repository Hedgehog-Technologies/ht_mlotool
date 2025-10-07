---@meta

---@class DebugDrawData
---@field info? boolean
---@field outline? boolean
---@field fill? boolean
---@field navigate? number

---@class DebugEntityData
---@field portalIndex number
---@field entityIndex number
---@field debug boolean

---@class MLODef
---@field interiorId number
---@field saveName string
---@field nameHash number
---@field uintNameHash number
---@field location vector3
---@field locationString string
---@field proxyHash number
---@field uintProxyHash number
---@field rooms RoomDef[]
---@field portals PortalDef[]

---@class Data151Def
---@field occlRoomName string
---@field flags string
---@field zone string
---@field unk02 number
---@field unk03 number
---@field reverb number
---@field echo number
---@field sound string
---@field unk07 number
---@field unk08 number
---@field unk09 number
---@field unk10 number
---@field unk11 number
---@field unk12 number
---@field unk13 string
---@field soundSet string

---@class RoomDef: Data151Def
---@field index number
---@field name string
---@field displayName string
---@field nameHash number
---@field uintNameHash number
---@field roomKey number
---@field uintRoomKey number
---@field portalCount number

---@class PortalDef
---@field mloPortalIndex number
---@field fromRoomIndex number
---@field toRoomIndex number
---@field flags number
---@field isMirror boolean
---@field isEnabled boolean[]
---@field entities EntityDef[]

---@class EntityDef
---@field index number
---@field linkType number
---@field maxOcclusion number
---@field modelHashKey number
---@field modelName string
---@field isDoor boolean
---@field isGlass boolean

---@class GenerateAudioData
---@field mlo MLODef
---@field generateOcclusion boolean
---@field generateDat151 boolean
---@field debug boolean
