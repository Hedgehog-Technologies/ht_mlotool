---@type CInteriorRoom
local CRoom = require 'client.new_classes.CInteriorRoom'

---@type CInteriorPortal
local CPortal = require 'client.new_classes.CInteriorPortal'

---@class CInterior : OxClass
---@field interiorId number
---@field location vector3
---@field nameHash number
---@field uintNameHash number
---@field saveName string
---@field name string
---@field proxyHash number
---@field uintProxyHash number
---@field roomCount number
---@field rooms CInteriorRoom[]
---@field portalCount number
---@field portals CInteriorPortal[]
---@field globalPortalCount number
---@field private private { proxyHash: number }
local CInterior = lib.class('CInterior')

---@param interiorId number
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

    self.private.proxyHash = self.proxyHash

    lib.print.debug(('Interior Proxy Hash: %s - %s'):format(self.proxyHash, self.uintProxyHash))

    -- Rooms
    self.roomCount = GetInteriorRoomCount(interiorId)
    self.rooms = {}
    for roomIndex = 0, self.roomCount - 1 do
        self.rooms[roomIndex + 1] = CRoom:new(interiorId, self.saveName, self.proxyHash, roomIndex)
    end

    -- Portals
    self.portalCount = GetInteriorPortalCount(interiorId)
    self.portals = {}
    for portalIndex = 0, self.portalCount - 1 do
        local fromRoomIndex = GetInteriorPortalRoomFrom(interiorId, portalIndex)
        local fromRoom = self.rooms[fromRoomIndex + 1]
        local toRoomIndex = GetInteriorPortalRoomTo(interiorId, portalIndex)
        local toRoom = self.rooms[toRoomIndex + 1]

        self.portals[portalIndex + 1] = CPortal:new(interiorId, fromRoomIndex, toRoomIndex, portalIndex, self.location)
        fromRoom.portalCount += 1
        toRoom.portalCount += 1
    end

    self.globalPortalCount = 0
    self:updateGlobalPortals()
end

function CInterior:overrideProxyHash(newHash)
    lib.print.info(('Updating Interior Proxy Hash to: %s'):format(newHash))

    self.proxyHash = newHash

    for i = 1, self.roomCount do
        self.rooms[i]:updateRoomKey(newHash)
    end
end

function CInterior:resetProxyHash()
    lib.print.info(('Resetting Interior Proxy hash to: %s'):format(self.private.proxyHash))

    self.proxyHash = self.private.proxyHash

    for i = 1, self.roomCount do
        self.rooms[i]:resetRoomKey()
    end
end

function CInterior:updateGlobalPortals()
    self.globalPortalCount = 0

    for roomIndex = 1, self.roomCount do
        local room = self.rooms[roomIndex]

        for portalIndex = 1, self.portalCount do
            local portal = self.portals[portalIndex]

            if not portal.isMirror then
                local matchDirection = portal.fromRoomIndex == room.index and 1
                    or portal.toRoomIndex == room.index and 2
                    or nil

                if matchDirection then
                    portal.globalPortalIndices[matchDirection] = self.globalPortalCount
                    self.globalPortalCount += 1
                end
            end
        end
    end
end

---@param roomIndex number
---@return CInteriorPortal[]
function CInterior:getActivePortalsForRoom(roomIndex)
    local activePortals = {}
    local portalCount = 0

    for portalIndex = 1, self.portalCount do
        local portal = self.portals[portalIndex]

        if not portal.isMirror
            and (portal.fromRoomIndex == roomIndex and portal.isEnabled[2]
                or portal.toRoomIndex == roomIndex and portal.isEnabled[1])
        then
            portalCount += 1
            activePortals[portalCount] = portal
        end
    end

    return activePortals
end

---@param interiorId number
---@return CInterior
function CInterior.create(interiorId)
    return CInterior:new(interiorId)
end

return CInterior.create
