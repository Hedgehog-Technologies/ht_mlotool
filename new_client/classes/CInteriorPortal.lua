---@type ClientConstants
local Constants = require 'new_client.helpers.constants'

---@type CInteriorPortalEntity
local CEntity = require 'new_client.classes.CInteriorPortalEntity'

---@type ClientUtilsApi
local Utils = require 'new_client.helpers.utils'

---@class CInteriorPortal : OxClass
---@field version number
---@field interiorId number
---@field isEnabled [boolean, boolean]
---@field interiorPortalIndex number
---@field globalPortalIndices [number, number]
---@field fromRoomIndex number
---@field toRoomIndex number
---@field connectedInteriorId number|nil
---@field flags PortalFlags|integer
---@field isMirror boolean
---@field isInteriorConnector boolean
---@field cornerPositions TPortalCornerCoordinates
---@field centroid vector3
---@field normal vector3
---@field entityCount number
---@field entities CInteriorPortalEntity[]
---@field new fun(self: CInteriorPortal, interiorId: number, fromRoomIndex: number, toRoomIndex: number, interiorPortalIndex: number, interiorLocation: vector3, portalData: TInteriorPortalData|table|nil): CInteriorPortal
local CInteriorPortal = lib.class('CInteriorPortal')

---@param interiorId number
---@param fromRoomIndex number?
---@param toRoomIndex number?
---@param interiorPortalIndex number?
---@param interiorLocation vector3?
---@param portalData TInteriorPortalData|table|nil
function CInteriorPortal:constructor(interiorId, fromRoomIndex, toRoomIndex, interiorPortalIndex, interiorLocation, portalData)
    -- Represents the version of the class structure for save data decoding purposes
    self.version = Constants.cInteriorPortalSchemaVersion
    self.interiorId = interiorId

    if portalData then
        return self:parsePortalData(portalData)
    end

    -- This direction relates to the listener path to sound origin, ***not*** the path from the sound origin to the listener
    -- [1] = fromRoomIndex -> toRoomIndex; [2] = toRoomIndex -> fromRoomIndex
    self.isEnabled = { true, true }
    self.interiorPortalIndex = interiorPortalIndex
    self.globalPortalIndices = { -1, -1 } -- [1] = fromRoomIndex -> toRoomIndex; [2] = toRoomIndex -> fromRoomIndex
    self.fromRoomIndex = fromRoomIndex
    self.toRoomIndex = toRoomIndex
    self.cornerPositions = {}

    self:calculatePortalFields()

    -- Entities
    self.entityCount = GetInteriorPortalEntityCount(interiorId, interiorPortalIndex)
    self.entities = {}
    for entityIndex = 0, self.entityCount - 1 do
        self.entities[entityIndex + 1] = CEntity:new(interiorId, interiorPortalIndex, entityIndex, interiorLocation)
    end
end

---@package
---@param portalData TInteriorPortalData|table
function CInteriorPortal:parsePortalData(portalData)
    if portalData.version == 2 then
        self:parsePortalDataV2(portalData)
    else
        self:parsePortalDataV1(portalData)
    end

    self.globalPortalIndices = { -1, -1 }
    self:calculatePortalFields()
end

---@package
---@param portalData TInteriorPortalData
function CInteriorPortal:parsePortalDataV2(portalData)
    self.isEnabled = table.clone(portalData.isEnabled)
    self.interiorPortalIndex = portalData.interiorPortalIndex
    self.fromRoomIndex = portalData.fromRoomIndex
    self.toRoomIndex = portalData.toRoomIndex

    self.entityCount = portalData.entityCount
    self.entities = {}
    for i = 1, self.entityCount do
        self.entities[i] = CEntity:new(self.interiorId, nil, nil, nil, portalData.entities[i])
    end
end

---@package
---@param portalData table
function CInteriorPortal:parsePortalDataV1(portalData)
    self.isEnabled = table.clone(portalData.isEnabled)
    self.interiorPortalIndex = portalData.mloPortalIndex
    self.fromRoomIndex = portalData.fromRoomIndex
    self.toRoomIndex = portalData.toRoomIndex
    self.flags = portalData.flags
    self.isMirror = portalData.isMirror

    self.entityCount = portalData.entityCount
    self.entities = {}
    for i = 1, self.entityCount do
        self.entities[i] = CEntity:new(self.interiorId, nil, nil, nil, portalData.entities[i])
    end
end

---@param portalData NInteriorPortalData
function CInteriorPortal:update(portalData)
    self.isEnabled = table.clone(portalData.isEnabled)

    for i = 1, self.entityCount do
        self.entities[i]:update(portalData.entities[i])
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
    data.entityCount = self.entityCount
    data.entities = {}

    for i = 1, self.entityCount do
        local entity = self.entities[i]
        data.entities[i] = entity:getSaveData()
    end

    return data --[[@as TInteriorPortalData]]
end

--- Calculates and sets various fields for the current portal
--- NOTE: This is a potentially destructive action
---@package
function CInteriorPortal:calculatePortalFields()
    -- Corners
    if self.cornerPositions == nil then
        self.cornerPositions = {}
    else
        table.wipe(self.cornerPositions)
    end

    local mloPos = vec3(GetInteriorPosition(self.interiorId))
    local mloRotX, mloRotY, mloRotZ, mloRotW = GetInteriorRotation(self.interiorId)
    local mloRot = quat(mloRotW, mloRotX, mloRotY, mloRotZ)

    for cornerIndex = 0, 3 do
        local cornerLocalPos = vec3(GetInteriorPortalCornerPosition(self.interiorId, self.interiorPortalIndex, cornerIndex))
        local cornerPos = mloPos + Utils.quatMult(mloRot, cornerLocalPos)
        self.cornerPositions[cornerIndex] = cornerPos
    end

    -- Centroid
    self.centroid = lib.math.interp(self.cornerPositions[0], self.cornerPositions[2], 0.5)

    -- Normal
    local v0 = self.cornerPositions[0]
    local v1 = self.cornerPositions[1]
    local v2 = self.cornerPositions[2]
    local edge1 = v1 - v0
    local edge2 = v2 - v0
    local normal = vec3(
        edge1.y * edge2.z - edge1.z * edge2.y,
        edge1.z * edge2.x - edge1.x * edge2.z,
        edge1.x * edge2.y - edge1.y * edge2.x
    )

    local normalLen = #normal
    if normalLen > 0.0001 then
        self.normal = normal / normalLen
    else
        self.normal = vec3(0.0, 1.0, 0.0)
    end

    -- Flags
    self.flags = GetInteriorPortalFlag(self.interiorId, self.interiorPortalIndex)
    self.isMirror = (self.flags & 4) ~= 0
    self.isInteriorConnector = (self.flags & 2) ~= 0

    -- Connected Interior
    if self.isInteriorConnector then
        local worldNormal = mloRot * self.normal
        local offsetCoords = self.centroid + (worldNormal * 0.8)
        self.connectedInteriorId = GetInteriorAtCoords(offsetCoords.x, offsetCoords.y, offsetCoords.z)
    end
end

return CInteriorPortal
