--- Algorithm based on / translated from pedr0fontoura's audio occlusion tool (https://github.com/pedr0fontoura/gtav-audio-occlusion)

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

---@param pathList table<number, CAudioOcclusionPath>
---@param pathKeys table<number, number[]>
---@param pair CAudioOcclusionNodePair
---@param distance number
local function generateRoutes(pathList, pathKeys, pair, distance)

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
        for pairIndex = 1, #nodePairList do
            local pair = nodePairList[pairIndex]
            generateRoutes(pathList, pathKeys, pair, distance)
        end
    end
end

return CAudioOcclusionPath
