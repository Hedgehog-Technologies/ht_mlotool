---@class CInteriorPortalEntity : OxClass
---@field interiorId number
---@field index number
---@field linkType number
---@field maxOcclusion number
---@field modelHashKey number
---@field isDoor boolean
---@field isGlass boolean
---@field modelName string
local CInteriorPortalEntity = lib.class('CInteriorPortalEntity')

---@param interiorId number
---@param mloPortalIndex number
---@param entityIndex number
---@param mloLocation vector3
function CInteriorPortalEntity:constructor(interiorId, mloPortalIndex, entityIndex, mloLocation)
    self.interiorId = interiorId
    self.index = entityIndex
    -- This is what we need to work with to handle Mlo <-> Mlo portals
    self.linkType = 1
    self.maxOcclusion = 0.7
    self.modelHashKey = GetInteriorPortalEntityArchetype(interiorId, mloPortalIndex, entityIndex)
    self.isDoor = false
    self.isGlass = false

    local relativePosition = vec3(GetInteriorPortalEntityPosition(interiorId, mloPortalIndex, entityIndex))
    local entityPosition = mloLocation + relativePosition
    local entityInstance = GetClosestObjectOfType(entityPosition.x, entityPosition.y, entityPosition.z, 2.0, self.modelHashKey, false, false, false)
    self.modelName = DoesEntityExist(entityInstance) and GetEntityArchetypeName(entityInstance) or tostring(self.modelHashKey)
end

return CInteriorPortalEntity
