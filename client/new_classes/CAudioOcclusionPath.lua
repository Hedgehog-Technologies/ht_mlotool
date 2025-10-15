--- Algorithm based on / translated from pedr0fontoura's audio occlusion tool (https://github.com/pedr0fontoura/gtav-audio-occlusion)

---@class PathChild
---@field pathNode CAudioOcclusionPath
---@field globalPortalIndex number

---@class CAudioOcclusionPath : OxClass
---@field distance number
---@field origin CAudioOcclusionNode
---@field destination CAudioOcclusionNode
---@field key number
---@field uintKey number
---@field childList PathChild[]
---@field childCount number
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
    ---@type PathChild
    local pathChild = {
        pathNode = CAudioOcclusionPath:new(originNode, destinationNode, distance),
        globalPortalIndex = globalPortalIndex
    }

    self.childCount += 1
    self.childList[self.childCount] = pathChild
end

---@param curPath CAudioOcclusionPath
---@param fromNode CAudioOcclusionNode
---@param edgeNode CAudioOcclusionNode
---@param childOrigin CAudioOcclusionNode
---@param childDestination CAudioOcclusionNode
---@param distanceMinusOne number
---@param predicate (fun(portal: CInteriorPortal, edgeNode: CAudioOcclusionNode): boolean) | nil
function CAudioOcclusionPath:addChildrenFromPortals(fromNode, edgeNode, childOrigin, childDestination, distanceMinusOne, predicate)
    for portalIndex = 1, fromNode.activePortalCount do
        local portal = fromNode.activePortals[portalIndex]

        if not portal.isMirror then
            local globalPortalIndex = nil

            if portal.toRoomIndex == edgeNode.index then
                globalPortalIndex = portal.globalPortalIndices[1]
            elseif portal.fromRoomIndex == edgeNode.index then
                globalPortalIndex = portal.globalPortalIndices[2]
            end

            if globalPortalIndex ~= nil and (not predicate or predicate(portal, edgeNode)) then
                self:addChild(childOrigin, childDestination, distanceMinusOne, globalPortalIndex)
            end
        end
    end
end

---@param fromNode CAudioOcclusionNode
---@param toNode CAudioOcclusionNode
---@return boolean
function CAudioOcclusionPath:isRelevant(fromNode, toNode)
    return self.origin.index == fromNode.index
        and self.destination.index == toNode.index
end

return CAudioOcclusionPath
