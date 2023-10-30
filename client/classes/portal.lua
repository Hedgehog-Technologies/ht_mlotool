Portal = {}

function Portal.new(interiorId, fromRoomIndex, toRoomIndex, mloPortalIndex, mloLocation)
    local portal = {}

    -- This direction relates to the listener path to sound origin, ***not*** the path from the sound origin to the listener
    -- [1] = fromRoomIndex -> toRoomIndex; [2] = toRoomIndex -> fromRoomIndex
    portal.isEnabled = { true, true }
    portal.mloPortalIndex = mloPortalIndex
    portal.globalPortalIndices = { -1, -1 } -- [1] = fromRoomIndex -> toRoomIndex; [2] = toRoomIndex -> fromRoomIndex
    portal.fromRoomIndex = fromRoomIndex
    portal.toRoomIndex = toRoomIndex

    portal.flags = GetInteriorPortalFlag(interiorId, mloPortalIndex)
    portal.isMirror = (portal.flags & 4) == 4

    portal.entityCount = GetInteriorPortalEntityCount(interiorId, mloPortalIndex)
    portal.entities = {}
    for entityIndex = 0, portal.entityCount - 1 do
        portal.entities[entityIndex + 1] = Entity.new(interiorId, mloPortalIndex, entityIndex, mloLocation)
    end

    return portal
end

function Portal.update(portal, newData)
    portal.isEnabled = newData.isEnabled

    for entityIndex = 1, #newData.entities do
        Entity.update(portal.entities[entityIndex], newData.entities[entityIndex])
    end
end
