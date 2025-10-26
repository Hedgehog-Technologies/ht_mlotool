---@type ClientConstants
local Constants = require 'new_client.helpers.constants'

---@type CInteriorPortalEntity
local CEntity = require 'new_client.classes.CInteriorPortalEntity'

---@class CInteriorPortal : OxClass
---@field version number
---@field interiorId number
---@field isEnabled [boolean, boolean]
---@field interiorPortalIndex number
---@field globalPortalIndices [number, number]
---@field fromRoomIndex number
---@field toRoomIndex number
---@field flags number
---@field isMirror boolean
---@field entityCount number
---@field entities CInteriorPortalEntity[]
---@field new fun(self: CInteriorPortal, interiorId: number, fromRoomIndex: number, toRoomIndex: number, interiorPortalIndex: number, interiorLocation: vector3, portalData: TInteriorPortalData|table|nil): CInteriorPortal
local CInteriorPortal = lib.class('CInteriorPortal')

---@param interiorId number
---@param fromRoomIndex number?
---@param toRoomIndex number?
---@param interiorPortalIndex number?
---@param interiorLocation vector3
---@param portalData TInteriorPortalData|table|nil
function CInteriorPortal:constructor(interiorId, fromRoomIndex, toRoomIndex, interiorPortalIndex, interiorLocation, portalData)
    -- Represents the version of the class structure for save data decoding purposes
    self.version = Constants.cInteriorPortalSchemaVersion
    self.interiorId = interiorId

    if portalData then
        return self:parsePortalData(interiorLocation, portalData)
    end

    -- This direction relates to the listener path to sound origin, ***not*** the path from the sound origin to the listener
    -- [1] = fromRoomIndex -> toRoomIndex; [2] = toRoomIndex -> fromRoomIndex
    self.isEnabled = { true, true }
    self.interiorPortalIndex = interiorPortalIndex
    self.globalPortalIndices = { -1, -1 } -- [1] = fromRoomIndex -> toRoomIndex; [2] = toRoomIndex -> fromRoomIndex
    self.fromRoomIndex = fromRoomIndex
    self.toRoomIndex = toRoomIndex

    self.flags = GetInteriorPortalFlag(interiorId, interiorPortalIndex)
    self.isMirror = (self.flags & 4) == 4

    -- Entities
    self.entityCount = GetInteriorPortalEntityCount(interiorId, interiorPortalIndex)
    self.entities = {}
    for entityIndex = 0, self.entityCount - 1 do
        self.entities[entityIndex + 1] = CEntity:new(interiorId, interiorPortalIndex, entityIndex, interiorLocation)
    end
end

---@package
---@param interiorLocation vector3
---@param portalData TInteriorPortalData|table
function CInteriorPortal:parsePortalData(interiorLocation, portalData)
    if portalData.version then
        -- TODO - Parse v2
    else
        self:parsePortalDataV1(interiorLocation, portalData)
    end
end

---@package
---@param interiorLocation vector3
---@param portalData table
function CInteriorPortal:parsePortalDataV1(interiorLocation, portalData)
    self.isEnabled = portalData.isEnabled
    self.interiorPortalIndex = portalData.mloPortalIndex
    self.globalPortalIndices = { -1, -1 }
    self.fromRoomIndex = portalData.fromRoomIndex
    self.toRoomIndex = portalData.toRoomIndex
    self.flags = portalData.flags
    self.isMirror = portalData.isMirror

    self.entityCount = portalData.entityCount
    self.entities = {}
    for i = 1, self.entityCount do
        self.entities[i] = CEntity:new(self.interiorId, nil, nil, nil, portalData)
    end
end

---@return TInteriorPortalData
function CInteriorPortal:getSaveData()
    local data = {}

    data.version = self.version
    data.isEnabled = table.clone(self.isEnabled)
    data.interiorPortalIndex = self.interiorPortalIndex
    data.fromRoomIndex = self.fromRoomIndex
    data.toRoomIndex = self.toRoomIndex
    data.flags = self.flags
    data.isMirror = self.isMirror
    data.entityCount = self.entityCount
    data.entities = {}

    for i = 1, self.entityCount do
        local entity = self.entities[i]
        data.entities[i] = entity:getSaveData()
    end

    return data --[[@as TInteriorPortalData]]
end

return CInteriorPortal
