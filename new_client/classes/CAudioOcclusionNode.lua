--- Algorithm based on / translated from pedr0fontoura's audio occlusion tool (https://github.com/pedr0fontoura/gtav-audio-occlusion)

---@class CAudioOcclusionNode : OxClass
---@field room CInteriorRoom
---@field index number
---@field name string
---@field key number
---@field activePortals CInteriorPortal[]
---@field activePortalCount number
---@field edges CAudioOcclusionNode[]
---@field new fun(self: CAudioOcclusionNode, room: CInteriorRoom, activePortals: CInteriorPortal[]): CAudioOcclusionNode
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

---@return CAudioOcclusionNode[]
function CAudioOcclusionNode:getNonLimboEdges()
    local nlEdges = {}
    local nlEdgeCount = 0

    for edgeIndex = 1, #self.edges do
        local edge = self.edges[edgeIndex]

        if edge.index ~= 0 then
            nlEdgeCount += 1
            nlEdges[nlEdgeCount] = edge
        end
    end

    return nlEdges
end

return CAudioOcclusionNode
