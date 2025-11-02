---@type ClientConstants
local Constants = require 'new_client.helpers.constants'

---@type ClientUtilsApi
local Utils = require 'new_client.helpers.utils'

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
---@field dat151 TRoomDat151Fields
---@field private private { roomKey: number }
---@field new fun(self: CInteriorRoom, interiorId: number, nameHash: number, proxyHash: number, roomIndex: number, roomData: TInteriorRoomData|table|nil): CInteriorRoom
local CInteriorRoom = lib.class('CInteriorRoom')

---@param interiorId number
---@param nameHash number?
---@param proxyHash number?
---@param roomIndex number?
---@param roomData TInteriorRoomData|table|nil
function CInteriorRoom:constructor(interiorId, nameHash, proxyHash, roomIndex, roomData)
    -- Represents the version of the class structure for save data decoding purposes
    self.version = Constants.cInteriorRoomSchemaVersion
    self.interiorId = interiorId

    if roomData then
        return self:parseRoomData(roomData)
    end

    self.index = roomIndex
    self.name = GetInteriorRoomName(interiorId, roomIndex)
    self.displayName = self.name:gsub('^%l', string.upper)
    self.nameHash = self.name == 'limbo' and `outside` or joaat(self.name)
    self.uintNameHash = Utils.toUInt32(self.nameHash)
    self.roomKey = self.name == 'limbo' and self.nameHash or proxyHash ~ self.nameHash
    self.uintRoomKey = Utils.toUInt32(self.roomKey)
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

---@package
---@param roomData TInteriorRoomData|table
function CInteriorRoom:parseRoomData(roomData)
    if roomData.version then
        self:parseRoomDataV2(roomData)
    else
        self:parseRoomDataV1(roomData)
    end
end

---@package
---@param roomData TInteriorRoomData
function CInteriorRoom:parseRoomDataV2(roomData)
    self.index = roomData.index
    self.name = roomData.name
    self.displayName = roomData.displayName
    self.nameHash = roomData.nameHash
    self.uintNameHash = roomData.uintNameHash
    self.roomKey = roomData.roomKey
    self.uintRoomKey = roomData.uintRoomKey
    self.portalCount = roomData.portalCount

    self.private.roomKey = roomData.originalRoomKey

    self.dat151 = table.clone(roomData.dat151)
end

---@package
---@param roomData table
function CInteriorRoom:parseRoomDataV1(roomData)
    self.index = roomData.index
    self.name = roomData.name
    self.displayName = roomData.displayName
    self.nameHash = roomData.nameHash
    self.uintNameHash = roomData.uintNameHash
    self.roomKey = roomData.roomKey
    self.uintRoomKey = roomData.uintRoomKey
    self.portalCount = roomData.portalCount

    self.private.roomKey = self.roomKey

    self.dat151 = {
        occlRoomName = roomData.occlRoomName,
        flags = roomData.flags,
        ambientZone = roomData.zone,
        interiorType = roomData.unk02,
        reverbSmall = roomData.unk03,
        reverbMedium = roomData.reverb,
        reverbLarge = roomData.echo,
        roomToneSound = roomData.sound,
        rainType = roomData.unk07,
        exteriorAudibility = roomData.unk08,
        roomOcclusionDamping = roomData.unk09,
        nonMarkedPortalOcclusion = roomData.unk10,
        distanceFromPortalForOcclusion = roomData.unk11,
        distanceFromPortalFadeDistance = roomData.unk12,
        weaponMetrics = roomData.unk13,
        interiorWallaSoundSet = roomData.soundSet
    }
end

---@param roomData NInteriorRoomData
function CInteriorRoom:update(roomData)
    self.dat151 = table.clone(roomData.dat151)
end

---@param newHash number
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

---@return TInteriorRoomData
function CInteriorRoom:getSaveData()
    local data = {}

    data.version = self.version
    data.index = self.index
    data.name = self.name
    data.displayName = self.displayName
    data.nameHash = self.nameHash
    data.uintNameHash = self.uintNameHash
    data.originalRoomKey = self.private.roomKey
    data.roomKey = self.roomKey
    data.uintRoomKey = self.uintRoomKey
    data.portalCount = self.portalCount
    data.dat151 = table.clone(self.dat151)

    return data --[[@as TInteriorRoomData]]
end

return CInteriorRoom
