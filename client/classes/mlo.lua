MLO = {}

local function round_sig_math(x, sig)
    sig = sig or 6
    if x == 0 or x ~= x or x == math.huge or x == -math.huge then return x end
    local sign = x < 0 and -1 or 1
    x = math.abs(x)
    local exp = math.floor(math.log10(x))
    local factor = 10 ^ (sig - 1 - exp)
    return sign * (math.floor(x * factor + 0.5) / factor)
end

local function round_sig_fmt(x, sig)
    if x == 0 or not x then return 0 end
    return tonumber(string.format("%." .. (sig or 6) .. "g", x))
end

function MLO.new(interiorId)
    local mlo = {}

    mlo.interiorId = interiorId
    mlo.location, mlo.nameHash = GetInteriorLocationAndNamehash(interiorId)
    mlo.uintNameHash = ToUInt32(mlo.nameHash)

    lib.print.debug('pos', GetInteriorPosition(interiorId))
    lib.print.debug('loc', mlo.location.x, mlo.location.y, mlo.location.z)

    mlo.saveName = string.format('%X', mlo.uintNameHash)
    -- Maybe someday we'll be able to query the game for the actual mlo archetype name, until then we can utilize the hash_hex value
    mlo.name = string.format('hash_%s', mlo.saveName)

    -- lib.print.debug('fmt', round_sig_fmt(mlo.location.x, 6), round_sig_fmt(mlo.location.y, 6), round_sig_fmt(mlo.location.z, 6))
    -- lib.print.debug('math', vector3(round_sig_math(mlo.location.x, 6), round_sig_math(mlo.location.y, 6), round_sig_math(mlo.location.z, 6)))
    
    -- local x, y, z = round_sig_math(mlo.location.x, 6), round_sig_math(mlo.location.y, 6), round_sig_math(mlo.location.z, 6)
    -- lib.print.debug('rounded1', x, y, z)

    -- mlo.location = vec3(round_sig_fmt(mlo.location.x, 6), round_sig_fmt(mlo.location.y, 6), round_sig_fmt(mlo.location.z, 6))
    -- x, y, z = x * 100, y * 100, z * 100
    local x, y, z = mlo.location.x * 100, mlo.location.y * 100, mlo.location.z * 100

    lib.print.debug(mlo.nameHash)
    lib.print.debug('Location: ', mlo.location)
    lib.print.debug('saved', x, y, z)

    x = x > 0 and math.floor(x) or math.ceil(x)
    y = y > 0 and math.floor(y) or math.ceil(y)
    z = z > 0 and math.floor(z) or math.ceil(z)
    -- x = math.floor(x)
    -- y = math.floor(y)
    -- z = math.floor(z)

    lib.print.debug('rounded', x, y, z)
    -- lib.print.debug('old', xo, yo, zo)

    mlo.proxyHash = mlo.nameHash ~ x ~ y ~ z    -- Signed Hash
    mlo.uintProxyHash = ToUInt32(mlo.proxyHash) -- Unsigned Hash
    -- local proxyHashOld = mlo.nameHash ~ xo ~ yo ~ zo
    -- local uintProxyHashOld = ToUInt32(proxyHashOld)

    lib.print.debug('proxy hash', mlo.proxyHash, mlo.uintProxyHash)
    -- lib.print.debug('old proxy hash', proxyHashOld, uintProxyHashOld)

    -- MLO Rooms
    mlo.roomCount = GetInteriorRoomCount(interiorId)
    mlo.rooms = {}
    for roomIndex = 0, mlo.roomCount - 1 do
        mlo.rooms[roomIndex + 1] = Room.new(interiorId, mlo.saveName, mlo.proxyHash, roomIndex)
    end

    -- MLO Portals
    mlo.portalCount = GetInteriorPortalCount(interiorId)
    mlo.portals = {}
    for portalIndex = 0, mlo.portalCount - 1 do
        local fromRoomIndex = GetInteriorPortalRoomFrom(interiorId, portalIndex)
        local fromRoom = mlo.rooms[fromRoomIndex + 1]
        local toRoomIndex = GetInteriorPortalRoomTo(interiorId, portalIndex)
        local toRoom = mlo.rooms[toRoomIndex + 1]

        mlo.portals[portalIndex + 1] = Portal.new(interiorId, fromRoomIndex, toRoomIndex, portalIndex, mlo.location)
        fromRoom.portalCount += 1
        toRoom.portalCount += 1
    end

    -- MLO Global Portals
    MLO.updateGlobalPortals(mlo)

    return mlo
end

-- Not the best performance... but problem for future me I suppose
function MLO.updateGlobalPortals(mlo)
    mlo.globalPortalCount = 0

    for roomIndex = 1, mlo.roomCount do
        local room = mlo.rooms[roomIndex]

        for portalIndex = 1, mlo.portalCount do
            local portal = mlo.portals[portalIndex]

            if not portal.isMirror then
                local matchDirection = portal.fromRoomIndex == room.index and 1
                    or portal.toRoomIndex == room.index and 2
                    or nil

                if matchDirection then
                    portal.globalPortalIndices[matchDirection] = mlo.globalPortalCount
                    mlo.globalPortalCount += 1
                end
            end
        end
    end
end

function MLO.update(mlo, newData)
    mlo.saveName = newData.saveName ~= '' and newData.saveName:gsub(' ', '_') or mlo.name:gsub('hash_', '')

    for roomIndex = 1, #newData.rooms do
        Room.update(mlo.rooms[roomIndex], newData.rooms[roomIndex])
    end

    for portalIndex = 1, #newData.portals do
        Portal.update(mlo.portals[portalIndex], newData.portals[portalIndex])
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

function MLO.generatePaths(mlo)
    local nodes = MLO.generateNodes(mlo)
    local paths, pathKeys = Node.generatePaths(nodes)
    return paths, pathKeys
end

function MLO.generateNodes(mlo)
    local nodes = {}
    local nodeCount = 0

    for roomIndex = 1, mlo.roomCount do
        local room = mlo.rooms[roomIndex]
        local activePortals = MLO.getActivePortalsForRoom(mlo, roomIndex - 1)
        local node = Node.new(room, activePortals)

        nodeCount += 1
        nodes[nodeCount] = node
    end

    for nodeIndex = 1, nodeCount do
        local node = nodes[nodeIndex]

        local edges = {}
        local edgeCount = 0
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

                    if not addedIndices[edgeNode.index] and edgeNode.index == checkIndex then
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

-- active portal = what can I hear from where I am currently standing
function MLO.getActivePortalsForRoom(mlo, roomIndex)
    local activePortals = {}
    local portalCount = 0

    for portalIndex = 1, mlo.portalCount do
        local portal = mlo.portals[portalIndex]

        if not portal.isMirror and (portal.fromRoomIndex == roomIndex and portal.isEnabled[2])
            or (portal.toRoomIndex == roomIndex and portal.isEnabled[1])
        then
            portalCount += 1
            activePortals[portalCount] = portal
        end
    end

    return activePortals
end
