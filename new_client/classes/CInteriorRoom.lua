---@class RoomDat151Fields
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

---@class CInteriorRoom : OxClass
---@field version number
---@field interiorId number
---@field index number
---@field name string
---@field displayName string
---@field namehash number
---@field uintNameHash number
---@field roomKey number
---@field uintRoomKey number
---@field portalCount number
---@field dat151 RoomDat151Fields
---@field private private { roomKey: number }
---@field new fun(self: CInteriorRoom, interiorId: number, nameHash: number, proxyHash: number, roomIndex: number): CInteriorRoom
local CInteriorRoom = lib.class('CInteriorRoom')

---@param interiorId number
---@param nameHash number
---@param proxyHash number
---@param roomIndex number
function CInteriorRoom:constructor(interiorId, nameHash, proxyHash, roomIndex)
    -- Represents the version of the class structure for save data decoding purposes
    self.version = 2

    self.interiorId = interiorId
    self.index = roomIndex
    self.name = GetInteriorRoomName(interiorId, roomIndex)
    self.displayName = self.name:gsub('^%l', string.upper)
    self.nameHash = self.name == 'limbo' and `outside` or joaat(self.name)
    self.uintNameHash = ToUInt32(self.nameHash)
    self.roomKey = self.name == 'limbo' and self.nameHash or proxyHash ~ self.nameHash
    self.uintRoomKey = ToUInt32(self.roomKey)
    self.portalCount = 0

    self.private.roomKey = self.roomKey

    self.dat151 = {
        occlRoomName = ('%s_%s'):format(nameHash, self.name),
        flags = '0xAAAAAAAA',                   -- Pre-CodeWalker 47 names
        ambientZone = '',                       -- zone
        interiorType = 0,                       -- unk02
        reverbSmall = 0.35,                     -- unk03
        reverbMedium = 0.0,                     -- reverb
        reverbLarge = 0.0,                      -- echo
        roomToneSound = 'null_sound',           -- sound
        rainType = 0,                           -- unk07
        exteriorAudibility = 0,                 -- unk08
        roomOcclusionDamping = 0,               -- unk09
        nonMarkedPortalOcclusion = 0.7,         -- unk10
        distanceFromPortalForOcclusion = 0,     -- unk11
        distanceFromPortalFadeDistance = 50,    -- unk12
        weaponMetrics = '',                     -- unk13
        interiorWallaSoundSet = 'hash_D4855127' -- soundSet
    }
end

function CInteriorRoom:updateRoomKey(newHash)
    if self.name == 'limbo' then return end

    self.roomKey = newHash ~ self.nameHash
    self.uintRoomKey = ToUInt32(self.roomKey)

    lib.print.info(('Updated Room [%s] key: %s (%s)'):format(self.name, self.roomKey, self.uintRoomKey))
end

function CInteriorRoom:resetRoomKey()
    if self.name == 'limbo' then return end

    self.roomKey = self.private.roomKey
    self.uintRoomKey = ToUInt32(self.roomKey)

    lib.print.info(('Reset Room [%s] key: %s (%s)'):format(self.name, self.roomKey, self.uintRoomKey))
end

return CInteriorRoom
