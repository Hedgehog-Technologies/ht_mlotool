--- Algorithm based on / translated from pedr0fontoura's audio occlusion tool (https://github.com/pedr0fontoura/gtav-audio-occlusion)

---@type CAudioOcclusionNodePair
local CNodePair = require 'client.new_classes.CAudioOcclusionNodePair'

---@type CAudioOcclusionPath
local CPath = require 'client.new_classes.CAudioOcclusionPath'

---@class CAudioOcclusionNode : OxClass
---@field room CInteriorRoom
---@field index number
---@field name string
---@field key number
---@field activePortals CInteriorPortal[]
---@field activePortalCount number
---@field edges CAudioOcclusionNode[]
local CAudioOcclusionNode = lib.class('CAudioOcclusionNode')

---@param room CInteriorRoom
---@param activePortals CInteriorPortal[]
function CAudioOcclusionNode:constructor(room, activePortals)
    self.room = room
    self.index = room.index
    self.name = room.name
    self.key = room.uintRoomKey

    self.activePortals = activePortals
    self.activePortalCount = #activePortals

    self.edges = {}
end

---@param nodes CAudioOcclusionNode[]
---@return table<number, CAudioOcclusionPath>
---@return number[][]
function CAudioOcclusionNode.calculateAudioOcclusionPaths(nodes)
    ---@type table<number, CAudioOcclusionPath>
    local pathList = {}
    ---@type table<number, number[]>
    local pathKeys = {}
    local nodePairList = CNodePair.generateNodePairs(nodes)

    for i = 1, 5 do
        pathKeys[i] = {}
        CPath.calculateAudioOcclusionPathsForDistance(pathList, pathKeys, nodes, nodePairList, i)
        table.sort(pathKeys[i])
    end

    return pathList, pathKeys
end

return CAudioOcclusionNode
