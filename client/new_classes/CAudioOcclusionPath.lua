--- Algorithm based on / translated from pedr0fontoura's audio occlusion tool (https://github.com/pedr0fontoura/gtav-audio-occlusion)

---@type CAudioOcclusionNodePair
local CNodePair = require 'client.new_classes.CAudioOcclusionNodePair'

---@class CAudioOcclusionPath : OxClass
---@field distance number
---@field origin CAudioOcclusionNode
---@field destination CAudioOcclusionNode
---@field key number
---@field uintKey number
---@field childList any[]
local CAudioOcclusionPath = lib.class('CAudioOcclusionPath')

---@param originNode CAudioOcclusionNode
---@param destinationNode CAudioOcclusionNode
---@param distance number
function CAudioOcclusionPath:constructor(originNode, destinationNode, distance)
    self.distance = distance

    self.origin = originNode
    self.destination = destinationNode

    if originNode.index == destinationNode.index then
        self.uintKey = 0
        self.key = 0
    else
        self.uintKey = ToUInt32(originNode.key - destinationNode.key) + distance
        self.key = ToInt32(self.uintKey)
    end

    self.childList = {}
    self.childCount = 0
end

---@param originNode CAudioOcclusionNode
---@param destinationNode CAudioOcclusionNode
---@param distance number
---@param globalPortalIndex number
function CAudioOcclusionPath:addChild(originNode, destinationNode, distance, globalPortalIndex)
    local pathChild = {
        pathNode = CAudioOcclusionPath:new(originNode, destinationNode, distance),
        globalPortalIndex = globalPortalIndex
    }

    self.childCount += 1
    self.childList[self.childCount] = pathChild
end

---@param fromNode CAudioOcclusionNode
---@param childOrigin CAudioOcclusionNode
---@param childDestination CAudioOcclusionNode
---@param distanceMinusOne number
---@param portal CInteriorPortal
---@param extraCondition fun(portal: CInteriorPortal, childOrigin: CAudioOcclusionNode, childDestination: CAudioOcclusionNode): boolean
function CAudioOcclusionPath:tryAddChildFromPortal(fromNode, childOrigin, childDestination, distanceMinusOne, portal, extraCondition)
    if portal.isMirror then return end

    local globalPortalIndex = nil

    if portal.toRoomIndex == childOrigin.index then
        globalPortalIndex = portal.globalPortalIndices[1]
    elseif portal.fromRoomIndex == childOrigin.index then
        globalPortalIndex = portal.globalPortalIndices[2]
    end

    if globalPortalIndex ~= nil
        and (not extraCondition or extraCondition(portal, childOrigin, childDestination))
    then
        self:addChild(childOrigin, childDestination, distanceMinusOne, globalPortalIndex)
    end
end

---@param fromNode CAudioOcclusionNode
---@param toNode CAudioOcclusionNode
---@return boolean
function CAudioOcclusionPath:isRelevant(fromNode, toNode)
    return self.origin.index == fromNode.index
        and self.destination.index == toNode.index
end

---@param pathList table<number, CAudioOcclusionPath>
---@param fromNodeKey number
---@param toNodeKey number
---@param distance number
local function findPathInList(pathList, fromNodeKey, toNodeKey, distance)
    local nodePairKey = ToUInt32(fromNodeKey - toNodeKey) + distance
    return pathList[nodePairKey]
end

---@param pathList table<number, CAudioOcclusionPath>
---@param fromNodeKey number
---@param toNodeKey number
---@param distance number
---@return boolean
local function hasAlreadyBeenFound(pathList, fromNodeKey, toNodeKey, distance)
    local nodePairKey = ToUInt32(fromNodeKey - toNodeKey)

    for i = 1, distance do
        if pathList[nodePairKey + i] then
            return true
        end
    end

    return false
end

---@param pathList table<number, CAudioOcclusionPath>
---@param fromNode CAudioOcclusionNode
---@param toNode CAudioOcclusionNode
---@param distance number
---@return CAudioOcclusionPath
---@return boolean
---@return number
local function getOrCreatePath(pathList, fromNode, toNode, distance)
    local key = 0

    if fromNode.index ~= toNode.index then
        key = ToUInt32(fromNode.key - toNode.key) + distance
    end

    local curPath = pathList[key]
    local created = false

    if not curPath then
        curPath = CAudioOcclusionPath:new(fromNode, toNode, distance)
        created = true
    end

    return curPath, created, key
end

---@param pathList table<number, CAudioOcclusionPath>
---@param pathKeys table<number, number[]>
---@param curPath CAudioOcclusionPath
---@param created boolean
---@param distance number
---@param key number
local function finalizePathInsertion(pathList, pathKeys, curPath, created, distance, key)
    if created and curPath.childList > 0 then
        pathList[key] = curPath
        table.insert(pathKeys[distance], key)
    end
end

---@param pathList table<number, CAudioOcclusionPath>
---@param pathKeys table<number, number[]>
---@param pair CAudioOcclusionNodePair
---@param distance number
local function generateRoutes(pathList, pathKeys, pair, distance)
    local edges = pair.isLimboPair and pair.fromNode.edges or pair.fromNode:getNonLimboEdges()
    -- Because I'll forget, DMO == distance minus one
    local dmoPathKeys = pathKeys[distance - 1]

    for keyIndex = 1, #dmoPathKeys do
        local path = pathList[dmoPathKeys[keyIndex]]

        if distance == 1 or distance == 2 or distance == 3 then
            if path:isRelevant(pair.fromNode, pair.toNode) then
                local curPath = findPathInList(pathList, pair.fromNode.key, pair.toNode.key, distance)

                local new = false
                if not curPath then
                    curPath = CAudioOcclusionPath:new(pair.fromNode, pair.toNode, distance)
                    new = true
                end

                for portalIndex = 1, pair.fromNode.activePortalCount do
                    local portal = pair.fromNode.activePortals[portalIndex]

                    if not portal.isMirror then
                        local globalPortalIndex = nil

                        if portal.toRoomIndex == pair.toNode.index then
                            globalPortalIndex = portal.globalPortalIndices[1]
                        elseif portal.fromRoomIndex == pair.toNode.index then
                            globalPortalIndex = portal.globalPortalIndices[2]
                        end

                        if globalPortalIndex ~= nil then
                            curPath:addChild(pair.fromNode, pair.fromNode, distance - 1, globalPortalIndex)
                        end
                    end
                end

                if new and curPath.childCount > 0 then
                    pathList[curPath.uintKey] = curPath
                    table.insert(pathKeys[distance], curPath.uintKey)
                end
            else
                for edgeIndex = 1, #edges do
                    local edge = edges[edgeIndex]

                    if path:isRelevant(edge, pair.toNode) then
                        local curPath = findPathInList(pathList, pair.fromNode.key, pair.toNode.key, distance)

                        local new = false
                        if not curPath then
                            curPath = CAudioOcclusionPath:new(pair.fromNode, pair.toNode, distance)
                            new = true
                        end

                        for portalIndex = 1, pair.fromNode.activePortalCount do
                            local portal = pair.fromNode.activePortals[portalIndex]

                            if not portal.isMirror then
                                local globalPortalIndex = nil

                                if portal.toRoomIndex == edge.index then
                                    globalPortalIndex = portal.globalPortalIndices[1]
                                elseif portal.fromRoomIndex == edge.index then
                                    globalPortalIndex = portal.globalPortalIndices[2]
                                end

                                if globalPortalIndex ~= nil
                                    and (edge.index == portal.fromRoomIndex
                                        or (portal.fromRoomIndex ~= 0 and portal.toRoomIndex ~= 0))
                                then
                                    curPath:addChild(edge, pair.toNode, distance -1, globalPortalIndex)
                                end
                            end
                        end

                        if new and curPath.childCount > 0 then
                            pathList[curPath.uintKey] = curPath
                            table.insert(pathKeys[distance], curPath.uintKey)
                        end
                    end
                end
            end
        elseif distance > 3 then
            for edgeIndex = 1, #edges do
                local edge = edges[edgeIndex]

                if path:isRelevant(edge, pair.toNode) then
                    local alreadyFound = hasAlreadyBeenFound(pathList, pair.fromNode.key, pair.toNode.key, distance)

                    if not alreadyFound then
                        local curPath = findPathInList(pathList, pair.fromNode.key, pair.toNode.key, distance)

                        local new = false
                        if not curPath then
                            curPath = CAudioOcclusionPath:new(pair.fromNode, pair.toNode, distance)
                            new = true
                        end

                        for portalIndex = 1, pair.fromNode.activePortalCount do
                            local portal = pair.fromNode.activePortals[portalIndex]

                            if not portal.isMirror then
                                local globalPortalIndex = nil

                                if portal.toRoomIndex == edge.index then
                                    globalPortalIndex = portal.globalPortalIndices[1]
                                elseif portal.fromRoomIndex == edge.index then
                                    globalPortalIndex = portal.globalPortalIndices[2]
                                end

                                if globalPortalIndex ~= nil
                                    and (edge.index == pair.toNode.index
                                        or (portal.fromRoomIndex ~= 0 and portal.toRoomIndex ~= 0))
                                then
                                    curPath:addChild(edge, pair.toNode, distance - 1, globalPortalIndex)
                                end
                            end
                        end

                        if new and curPath.childCount > 0 then
                            pathList[curPath.uintKey] = curPath
                            table.insert(pathKeys[distance], curPath.uintKey)
                        end
                    end
                end
            end
        end
    end
end

---@param pathList table<number, CAudioOcclusionPath>
---@param pathKeys table<number, number[]>
---@param nodes CAudioOcclusionNode[]
---@param nodePairList CAudioOcclusionNodePair[]
---@param distance number
function CAudioOcclusionPath.calculateAudioOcclusionPathsForDistance(pathList, pathKeys, nodes, nodePairList, distance)
    -- Shortest distance, list out all one-step direct links and move on
    if distance == 1 then
        for nodeIndex = 1, #nodes do
            local node = nodes[nodeIndex]

            for edgeIndex = 1, #node.edges do
                local edge = node.edges[edgeIndex]
                local path = CAudioOcclusionPath:new(node, edge, distance)

                for portalIndex = 1, node.activePortalCount do
                    local portal = node.activePortals[portalIndex]

                    if not portal.isMirror then
                        local globalPortalIndex = nil

                        if portal.toRoomIndex == edge.index then
                            globalPortalIndex = portal.globalPortalIndices[1]
                        elseif portal.fromRoomIndex == edge.index then
                            globalPortalIndex = portal.globalPortalIndices[2]
                        end

                        if globalPortalIndex ~= nil then
                            path:addChild(node, node, distance - 1, globalPortalIndex)
                        end
                    end
                end

                if path.childCount > 0 then
                    pathList[path.uintKey] = path
                    table.insert(pathKeys[distance], path.uintKey)
                end
            end
        end
    else
        nodePairList = nodePairList or CNodePair.generateNodePairs(nodes)

        for pairIndex = 1, #nodePairList do
            local pair = nodePairList[pairIndex]
            generateRoutes(pathList, pathKeys, pair, distance)
        end
    end
end

return CAudioOcclusionPath
