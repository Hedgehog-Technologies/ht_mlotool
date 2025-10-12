--- Algorithm based on / translated from pedr0fontoura's audio occlusion tool (https://github.com/pedr0fontoura/gtav-audio-occlusion)

---@class CAudioOcclusionNodePair : OxClass
---@field key number
---@field fromNode CAudioOcclusionNode
---@field toNode CAudioOcclusionNode
---@field isLimboPair boolean
local CAudioOcclusionNodePair = lib.class('CAudioOcclusionNodePair')

---@param fromNode CAudioOcclusionNode
---@param toNode CAudioOcclusionNode
function CAudioOcclusionNodePair:constructor(fromNode, toNode)
    self.key = fromNode.key - toNode.key

    self.fromNode = fromNode
    self.toNode = toNode

    self.isLimboPair = fromNode.index == 0 or toNode.index == 0
end

---@param nodes CAudioOcclusionNode[]
---@return CAudioOcclusionNodePair[]
function CAudioOcclusionNodePair.generateNodePairs(nodes)
    ---@type CAudioOcclusionNodePair[]
    local nodePairs = {}
    local pairCount = 0

    for fromIndex = 1, #nodes do
        local fromNode = nodes[fromIndex]

        for toIndex = 1, #nodes do
            local toNode = nodes[toIndex]

            if fromNode.index ~= toNode.index then
                pairCount += 1
                nodePairs[pairCount] = CAudioOcclusionNodePair:new(fromNode, toNode)
            end
        end
    end

    return nodePairs
end

return CAudioOcclusionNodePair
