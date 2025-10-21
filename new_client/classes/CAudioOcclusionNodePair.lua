--- Algorithm based on / translated from pedr0fontoura's audio occlusion tool (https://github.com/pedr0fontoura/gtav-audio-occlusion)

---@class CAudioOcclusionNodePair : OxClass
---@field key number
---@field fromNode CAudioOcclusionNode
---@field toNode CAudioOcclusionNode
---@field isLimboPair boolean
---@field new fun(self: CAudioOcclusionNodePair, fromNode: CAudioOcclusionNode, toNode: CAudioOcclusionNode): CAudioOcclusionNodePair
local CAudioOcclusionNodePair = lib.class('CAudioOcclusionNodePair')

---@param fromNode CAudioOcclusionNode
---@param toNode CAudioOcclusionNode
function CAudioOcclusionNodePair:constructor(fromNode, toNode)
    self.key = fromNode.key - toNode.key

    self.fromNode = fromNode
    self.toNode = toNode

    self.isLimboPair = fromNode.index == 0 or toNode.index == 0
end

return CAudioOcclusionNodePair
