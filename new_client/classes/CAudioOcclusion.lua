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

---@type CAudioOcclusionNode
local CNode = require 'new_client.classes.CAudioOcclusionNode'

---@type CAudioOcclusionNodePair
local CNodePair = require 'new_client.classes.CAudioOcclusionNodePair'

---@type CAudioOcclusionPath
local CPath = require 'new_client.classes.CAudioOcclusionPath'

---@class CAudioOcclusion : OxClass
---@field nodes CAudioOcclusionNode[]
---@field nodeCount number
---@field nodePairs CAudioOcclusionNodePair[]
---@field pairCount number
---@field paths table<number, CAudioOcclusionPath>
---@field pathKeys table<number, number[]>
---@field new fun(self: CAudioOcclusion, interior: CInterior): CAudioOcclusion
local CAudioOcclusion = lib.class('CAudioOcclusion')

---@param interior CInterior
function CAudioOcclusion:constructor(interior)
    self.nodes = {}
    self.nodeCount = 0
    self.nodePairs = {}
    self.pairCount = 0

    self.paths = {}
    self.pathKeys = {}

    self:generateNodes(interior)
    self:generateNodePairs()
    self:calculatePaths()
end

---@package
---@param interior CInterior
function CAudioOcclusion:generateNodes(interior)
    for roomIndex = 1, interior.roomCount do
        local room = interior.rooms[roomIndex]
        local activePortals = interior:getActivePortalsForRoom(roomIndex - 1)
        local node = CNode:new(room, activePortals)

        self.nodeCount += 1
        self.nodes[self.nodeCount] = node
    end

    for nodeIndex = 1, self.nodeCount do
        local node = self.nodes[nodeIndex]

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
                for edgeNodeIndex = 1, self.nodeCount do
                    local edgeNode = self.nodes[edgeNodeIndex]

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
end

---@package
function CAudioOcclusion:generateNodePairs()
    for fromIndex = 1, #self.nodes do
        local fromNode = self.nodes[fromIndex]

        for toIndex = 1, #self.nodes do
            local toNode = self.nodes[toIndex]

            if fromNode.index ~= toNode.index then
                self.pairCount += 1
                self.nodePairs[self.pairCount] = CNodePair:new(fromNode, toNode)
            end
        end
    end
end

---@package
function CAudioOcclusion:calculatePaths()
    for i = 1, 5 do
        self.pathKeys[i] = {}
        self:calculatePathsForDistance(i)
        table.sort(self.pathKeys[i])
    end
end

---@package
---@param distance number
function CAudioOcclusion:calculatePathsForDistance(distance)
    if distance == 1 then
        for nodeIndex = 1, #self.nodes do
            local node = self.nodes[nodeIndex]

            for edgeIndex = 1, #node.edges do
                local edge = node.edges[edgeIndex]
                local path = CPath:new(node, edge, distance)

                path:addChildrenFromPortals(node, edge, node, node, distance - 1)

                if path.childCount > 0 then
                    self.paths[path.uintKey] = path
                    table.insert(self.pathKeys[distance], path.uintKey)
                end
            end
        end
    else
        for pairIndex = 1, #self.nodePairs do
            local pair = self.nodePairs[pairIndex]
            self:calculateRoutes(pair, distance)
        end
    end
end

---@package
---@param pair CAudioOcclusionNodePair
---@param distance number
function CAudioOcclusion:calculateRoutes(pair, distance)
    local edges = pair.isLimboPair and pair.fromNode.edges or pair.fromNode:getNonLimboEdges()
    -- Because I'll forget, DMO == distance minus one
    local dmoPathKeys = self.pathKeys[distance - 1]

    for keyIndex = 1, #dmoPathKeys do
        local path = self.paths[dmoPathKeys[keyIndex]]

        if distance == 1 or distance == 2 or distance == 3 then
            if path:isRelevant(pair.fromNode, pair.toNode) then
                local curPath, isNew = self:getOrCreatePath(pair.fromNode, pair.toNode, distance)

                curPath:addChildrenFromPortals(pair.fromNode, pair.toNode, pair.fromNode, pair.fromNode, distance - 1)

                if isNew and curPath.childCount > 0 then
                    self.paths[curPath.uintKey] = curPath
                    table.insert(self.pathKeys[distance], curPath.uintKey)
                end
            else
                for edgeIndex = 1, #edges do
                    local edge = edges[edgeIndex]

                    if path:isRelevant(edge, pair.toNode) then
                        local curPath, isNew = self:getOrCreatePath(pair.fromNode, pair.toNode, distance)

                        curPath:addChildrenFromPortals(pair.fromNode, edge, edge, pair.toNode, distance - 1,
                            function(portal, edgeNode)
                                return (edgeNode.index == portal.fromRoomIndex
                                    or (portal.fromRoomIndex ~= 0 and portal.toRoomIndex ~= 0))
                            end
                        )

                        if isNew and curPath.childCount > 0 then
                            self.paths[curPath.uintKey] = curPath
                            table.insert(self.pathKeys[distance], curPath.uintKey)
                        end
                    end
                end
            end
        elseif distance > 3 then
            for edgeIndex = 1, #edges do
                local edge = edges[edgeIndex]

                if path:isRelevant(edge, pair.toNode) then
                    local alreadyFound = self:hasFoundPath(pair.fromNode.key, pair.toNode.key, distance)

                    if not alreadyFound then
                        local curPath, isNew = self:getOrCreatePath(pair.fromNode, pair.toNode, distance)

                        curPath:addChildrenFromPortals(pair.fromNode, edge, edge, pair.toNode, distance - 1,
                            function(portal, edgeNode)
                                return (edgeNode.index == pair.toNode.index
                                    or (portal.fromRoomIndex ~= 0 and portal.toRoomIndex ~= 0))
                            end
                        )

                        if isNew and curPath.childCount > 0 then
                            self.paths[curPath.uintKey] = curPath
                            table.insert(self.pathKeys[distance], curPath.uintKey)
                        end
                    end
                end
            end
        end
    end
end

---@package
---@param fromNode CAudioOcclusionNode
---@param toNode CAudioOcclusionNode
---@param distance number
---@return CAudioOcclusionPath
---@return boolean
function CAudioOcclusion:getOrCreatePath(fromNode, toNode, distance)
    local curPath = self:findPathInList(fromNode.key, toNode.key, distance)
    local isNew = false

    if not curPath then
        curPath = CPath:new(fromNode, toNode, distance)
        isNew = true
    end

    return curPath, isNew
end

---@package
---@param fromNodeKey number
---@param toNodeKey number
---@param distance number
---@return CAudioOcclusionPath | nil
function CAudioOcclusion:findPathInList(fromNodeKey, toNodeKey, distance)
    local nodePairKey = ToUInt32(fromNodeKey - toNodeKey) + distance
    return self.paths[nodePairKey]
end

---@package
---@param fromNodeKey number
---@param toNodeKey number
---@param distance number
---@return boolean
function CAudioOcclusion:hasFoundPath(fromNodeKey, toNodeKey, distance)
    local nodePairKey = ToUInt32(fromNodeKey - toNodeKey)

    for i = 1, distance do
        if self.paths[nodePairKey + i] then
            return true
        end
    end

    return false
end

return CAudioOcclusion
