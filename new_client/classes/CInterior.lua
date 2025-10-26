---@type ClientConstants
local Constants = require 'new_client.helpers.constants'

---@type CInteriorRoom
local CRoom = require 'new_client.classes.CInteriorRoom'

---@type CInteriorPortal
local CPortal = require 'new_client.classes.CInteriorPortal'

---@class CInterior : OxClass
---@field version number
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
---@field new fun(self: CInterior, interiorId: number?, interiorData: TInteriorData|table|nil): CInterior
local CInterior = lib.class('CInterior')

---@param interiorId number?
---@param interiorData TInteriorData?
function CInterior:constructor(interiorId, interiorData)
    -- Represents the version of the class structure for save data decoding purposes
    self.version = Constants.cInteriorSchemaVersion

    if interiorData then
        return self:parseInteriorData(interiorData)
    end

    self.interiorId = interiorId
    self.location, self.nameHash = GetInteriorLocationAndNamehash(interiorId)
    self.uintNameHash = ToUInt32(self.nameHash)

    lib.print.debug(('Interior Location: %f, %f, %f'):format(self.location.x, self.location.y, self.location.z))

    self.saveName = ('%X'):format(self.uintNameHash)
    -- Maybe someday we'll be able to query the game for the actual mlo archetype name, until then we can utilize the hash_hex value
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

---@package
---@param interiorData TInteriorData
function CInterior:parseInteriorData(interiorData)
    if interiorData.version then
        -- TODO - Parse v2
    else
        self:parseInteriorDataV1(interiorData)
    end

    self:updateGlobalPortals()
end

---@package
---@param interiorData table
function CInterior:parseInteriorDataV1(interiorData)
    self.interiorId = GetInteriorAtCoords(interiorData.location.x, interiorData.location.y, interiorData.location.z)
    self.location = vec3(interiorData.location.x, interiorData.location.y, interiorData.location.z)
    self.nameHash = interiorData.nameHash
    self.uintNameHash = interiorData.uintNameHash
    self.saveName = interiorData.saveName
    self.name = interiorData.name
    self.proxyHash = interiorData.proxyHash
    self.uintProxyHash = interiorData.uintProxyHash
    self.private.proxyHash = interiorData.proxyHash

    self.roomCount = interiorData.roomCount
    self.rooms = {}
    for i = 1, self.roomCount do
        self.rooms[i] = CRoom:new(self.interiorId, nil, nil, nil, interiorData.rooms[i])
    end

    self.portalCount = interiorData.portalCount
    self.portals = {}
    for i = 1, self.portalCount do
        self.portals[i] = CPortal:new(self.interiorId, nil, nil, nil, self.location, interiorData.portals[i])
    end

    self.globalPortalCount = 0
end

function CInterior:overrideProxyHash(newHash)
    lib.print.info(('Updating interior proxy hash to: %s'):format(newHash))

    self.proxyHash = newHash

    for i = 1, self.roomCount do
        self.rooms[i]:updateRoomKey(newHash)
    end
end

function CInterior:resetProxyHash()
    lib.print.info(('Resetting interior proxy hash to: %s'):format(self.private.proxyHash))

    self.proxyHash = self.private.proxyHash

    for i = 1, self.roomCount do
        self.rooms[i]:resetRoomKey()
    end
end

---@return TInteriorData
function CInterior:getSaveData()
    local data = {}

    data.version = self.version
    data.location = self.location
    data.nameHash = self.nameHash
    data.uintNameHash = self.uintNameHash
    data.saveName = self.saveName
    data.name = self.name
    data.originalProxyHash = self.private.proxyHash
    data.proxyHash = self.proxyHash
    data.uintProxyHash = self.uintProxyHash
    data.roomCount = self.roomCount
    data.rooms = {}
    data.portalCount = self.portalCount
    data.portals = {}

    for i = 1, self.roomCount do
        local room = self.rooms[i]
        data.rooms[i] = room:getSaveData()
    end

    for i = 1, self.portalCount do
        local portal = self.portals[i]
        data.portals[i] = portal:getSaveData()
    end

    return data --[[@as TInteriorData]]
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

return CInterior
