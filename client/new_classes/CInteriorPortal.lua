---@type CInteriorPortalEntity
local CEntity = require 'client.new_classes.CInteriorPortalEntity'

---@class CInteriorPortal : OxClass
---@field isEnabled boolean[]
---@field mloPortalIndex number
---@field globalPortalIndices number[]
---@field fromRoomIndex number
---@field toRoomIndex number
---@field flags number
---@field isMirror boolean
---@field entityCount number
---@field entities CInteriorPortalEntity[]
local CInteriorPortal = lib.class('CInteriorPortal')

---@param interiorId number
---@param fromRoomIndex number
---@param toRoomIndex number
---@param mloPortalIndex number
---@param mloLocation vector3
function CInteriorPortal:constructor(interiorId, fromRoomIndex, toRoomIndex, mloPortalIndex, mloLocation)
    -- This direction relates to the listener path to sound origin, ***not*** the path from the sound origin to the listener
    -- [1] = fromRoomIndex -> toRoomIndex; [2] = toRoomIndex -> fromRoomIndex
    self.isEnabled = { true, true }
    self.mloPortalIndex = mloPortalIndex
    self.globalPortalIndices = { -1, -1 } -- [1] = fromRoomIndex -> toRoomIndex; [2] = toRoomIndex -> fromRoomIndex
    self.fromRoomIndex = fromRoomIndex
    self.toRoomIndex = toRoomIndex

    self.flags = GetInteriorPortalFlag(interiorId, mloPortalIndex)
    self.isMirror = (self.flags & 4) == 4

    -- Entities
    self.entityCount = GetInteriorPortalEntityCount(interiorId, mloPortalIndex)
    self.entities = {}
    for entityIndex = 0, self.entityCount - 1 do
        self.entities[entityIndex + 1] = CEntity:new(interiorId, mloPortalIndex, entityIndex, mloLocation)
    end
end

return CInteriorPortal
