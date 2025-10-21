---@class CInteriorPortalEntity : OxClass
---@field version number
---@field interiorId number
---@field index number
---@field linkType number
---@field maxOcclusion number
---@field modelHashKey number
---@field isDoor boolean
---@field isGlass boolean
---@field modelName string
---@field new fun(self: CInteriorPortalEntity, interiorId: number, interiorPortalIndex: number, entityIndex: number, interiorLocation: vector3): CInteriorPortalEntity
local CInteriorPortalEntity = lib.class('CInteriorPortalEntity')

---@param interiorId number
---@param interiorPortalIndex number
---@param entityIndex number
---@param interiorLocation vector3
function CInteriorPortalEntity:constructor(interiorId, interiorPortalIndex, entityIndex, interiorLocation)
    -- Represents the version of the class structure for save data decoding purposes
    self.version = 2

    self.interiorId = interiorId
    self.index = entityIndex
    -- This is what we need to work with to handle Interior <-> Interior portals
    self.linkType = 1
    self.maxOcclusion = 0.7
    self.modelHashKey = GetInteriorPortalEntityArchetype(interiorId, interiorPortalIndex, entityIndex)
    self.isDoor = false
    self.isGlass = false

    local relativePosition = vec3(GetInteriorPortalEntityPosition(interiorId, interiorPortalIndex, entityIndex))
    local entityPosition = interiorLocation + relativePosition
    local entityInstance = GetClosestObjectOfType(entityPosition.x, entityPosition.y, entityPosition.z, 2.0, self.modelHashKey, false, false, false)
    self.modelName = DoesEntityExist(entityInstance) and GetEntityArchetypeName(entityInstance) or tostring(self.modelHashKey)
end

return CInteriorPortalEntity
