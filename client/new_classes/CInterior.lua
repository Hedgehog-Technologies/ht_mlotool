---@class CRoom : OxClass
local CRoom = require 'new_classes/CRoom'

---@class CInterior : OxClass
local CInterior = lib.class('CInterior')

function CInterior:constructor(interiorId)
    self.interiorId = interiorId
    self.location, self.nameHash = GetInteriorLocationAndNamehash(interiorId)
    self.uintNameHash = ToUInt32(self.nameHash)

    lib.print.debug(('Interior Location: %f, %f, %f'):format(self.location.x, self.location.y, self.location.z))

    self.saveName = ('%X'):format(self.uintNameHash)
    self.name = ('hash_%s'):format(self.saveName)

    local x, y, z = self.location.x * 100, self.location.y * 100, self.location.z * 100

    x = x > 0 and math.floor(x) or math.ceil(x)
    y = y > 0 and math.floor(y) or math.ceil(y)
    z = z > 0 and math.floor(z) or math.ceil(z)

    self.proxyHash = self.nameHash ~ x ~ y ~ z    -- Signed Hash
    self.uintProxyHash = ToUInt32(self.proxyHash) -- Unsigned Hash

    lib.print.debug(('Interior Proxy Hash: %s - %s'):format(self.proxyHash, self.uintProxyHash))

    -- Rooms
    self.roomCount = GetInteriorRoomCount(interiorId)
    self.rooms = {}
    for roomIndex = 0, self.roomCount - 1 do
        self.rooms[roomIndex + 1] = CRoom:new(interiorId, self.saveName, self.proxyHash, roomIndex)
    end

    -- Portals
    self.portalCount = GetInteriorPortalCount(interiorId)
end

return CInterior
