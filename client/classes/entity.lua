Entity = {}

function Entity.new(interiorId, mloPortalIndex, entityIndex, mloLocation)
    local entity = {}

    entity.linkType = 1
    entity.maxOcclusion = 0.5
    entity.modelHashKey = GetInteriorPortalEntityArchetype(interiorId, mloPortalIndex, entityIndex)
    entity.isDoor = false
    entity.isGlass = false

    local relativePosition = vec3(GetInteriorPortalEntityPosition(interiorId, mloPortalIndex, entityIndex))
    local entityPosition = mloLocation + relativePosition
    local entityInstance = GetClosestObjectOfType(entityPosition.x, entityPosition.y, entityPosition.z, 1.0, entity.modelHashKey, false, false, false)
    entity.modelName = DoesEntityExist(entityInstance) and GetEntityArchetypeName(entityInstance) or tostring(entity.modelHashKey)

    return entity
end

function Entity.update(entity, newData)
    entity.maxOcclusion = newData.maxOcclusion
    entity.isDoor = newData.isDoor
    entity.isGlass = newData.isGlass
end
