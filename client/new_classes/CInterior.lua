---@type CInteriorRoom
local CRoom = require 'client.new_classes.CInteriorRoom'

---@type CInteriorPortal
local CPortal = require 'client.new_classes.CInteriorPortal'

---@type CAudioOcclusionNode
local CNode = require 'client.new_classes.CAudioOcclusionNode'

---@class CInterior : OxClass
---@field private private { proxyHash: number }
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

--[[
    The following algorithm to generate nodes and paths is originally sourced and translated from pedr0fontoura's gtav-audio-occlusion tool.
    https://github.com/pedr0fontoura/gtav-audio-occlusion

    MIT License

    Copyright (c) 2021 snakewiz

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
]]--

---@return table<number, CAudioOcclusionPath>
---@return table<number, number[]>
function CInterior:calculateAudioOcclusionPaths()
    local nodes = self:calculateAudioOcclusionNodes()
    local paths, pathKeys = CNode.calculateAudioOcclusionPaths(nodes)
    return paths, pathKeys
end

---@return CAudioOcclusionNode[]
function CInterior:calculateAudioOcclusionNodes()
    ---@type CAudioOcclusionNode[]
    local nodes = {}
    local nodeCount = 0

    for roomIndex = 1, self.roomCount do
        local room = self.rooms[roomIndex]
        local activePortals = self:getActivePortalsForRoom(roomIndex - 1)
        local node = CNode:new(room, activePortals)

        nodeCount += 1
        nodes[nodeCount] = node
    end

    for nodeIndex = 1, nodeCount do
        local node = nodes[nodeIndex]

        ---@type CAudioOcclusionNode[]
        local edges = {}
        local edgeCount = 0
        ---@type table<number, boolean>
        local addedIndices = {}

        for nodePortalIndex = 1, node.activePortalCount do
            local portal = node.activePortals[nodePortalIndex]
            local fromIndex = portal.fromRoomIndex
            local toIndex = portal.toRoomIndex

            local checkIndex = nil
            if fromIndex == node.index then
                checkIndex = toIndex
            elseif toIndex == node.index then
                checkIndex = fromIndex
            end

            if checkIndex then
                for edgeNodeIndex = 1, nodeCount do
                    local edgeNode = nodes[edgeNodeIndex]

                    if not addedIndices[edgeNode.index]
                        and edgeNode.index == checkIndex
                    then
                        addedIndices[edgeNode.index] = true

                        edgeCount += 1
                        edges[edgeCount] = edgeNode
                        break
                    end
                end
            end
        end

        node.edges = edges
    end

    return nodes
end

-- Get all active portals for a given room
-- Active Portal = what can I hear if I were standing in this room
---@param roomIndex number
---@return CInteriorPortal[]
function CInterior:getActivePortalsForRoom(roomIndex)
    ---@type CInteriorPortal[]
    local activePortals = {}
    local portalCount = 0

    for portalIndex = 1, self.portalCount do
        local portal = self.portals[portalIndex]

        if not portal.isMirror and (portal.fromRoomIndex == roomIndex and portal.isEnabled[2])
            or (portal.toRoomIndex == roomIndex and portal.isEnabled[1])
        then
            portalCount += 1
            activePortals[portalCount] = portal
        end
    end

    return activePortals
end

return CInterior
