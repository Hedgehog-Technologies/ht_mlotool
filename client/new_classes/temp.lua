local function generateRoutes(pathList, pathKeys, pair, distance)
    local edges = pair.isLimboPair and pair.fromNode.edges or pair.fromNode:getNonLimboEdges()
    local dmoPathKeys = pathKeys[distance - 1]

    for keyIndex = 1, #dmoPathKeys do
        local path = pathList[dmoPathKeys[keyIndex]]

        if distance == 1 or distance == 2 or distance == 3 then
            if path:isRelevant(pair.fromNode, pair.toNode) then
                local curPath, created, key = getOrCreatePath(pathList, pair.fromNode, pair.toNode, distance)

                for portalIndex = 1, pair.fromNode.activePortalCount do
                    local portal = pair.fromNode.activePortals[portalIndex]
                    -- direct link to same room (origin used as child origin)
                    tryAddChildFromPortal(curPath, pair.fromNode, pair.fromNode, pair.toNode, distance - 1, portal,
                        function(portal) return true end)
                end

                finalizePathInsertion(pathList, pathKeys, curPath, created, distance, key)
            else
                for edgeIndex = 1, #edges do
                    local edge = edges[edgeIndex]

                    if path:isRelevant(edge, pair.toNode) then
                        local curPath, created, key = getOrCreatePath(pathList, pair.fromNode, pair.toNode, distance)

                        for portalIndex = 1, pair.fromNode.activePortalCount do
                            local portal = pair.fromNode.activePortals[portalIndex]

                            tryAddChildFromPortal(curPath, pair.fromNode, edge, pair.toNode, distance - 1, portal,
                                function(portal, edge)
                                    return (edge.index == portal.fromRoomIndex)
                                        or (portal.fromRoomIndex ~= 0 and portal.toRoomIndex ~= 0)
                                end)
                        end

                        finalizePathInsertion(pathList, pathKeys, curPath, created, distance, key)
                    end
                end
            end
        elseif distance > 3 then
            for edgeIndex = 1, #edges do
                local edge = edges[edgeIndex]

                if path:isRelevant(edge, pair.toNode) then
                    local alreadyFound = hasAlreadyBeenFound(pathList, pair.fromNode.key, pair.toNode.key, distance)

                    if not alreadyFound then
                        local curPath, created, key = getOrCreatePath(pathList, pair.fromNode, pair.toNode, distance)

                        for portalIndex = 1, pair.fromNode.activePortalCount do
                            local portal = pair.fromNode.activePortals[portalIndex]

                            tryAddChildFromPortal(curPath, pair.fromNode, edge, pair.toNode, distance - 1, portal,
                                function(portal, edge, toNode)
                                    return (edge.index == pair.toNode.index)
                                        or (portal.fromRoomIndex ~= 0 and portal.toRoomIndex ~= 0)
                                end)
                        end

                        finalizePathInsertion(pathList, pathKeys, curPath, created, distance, key)
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

                local curPath, created, key = getOrCreatePath(pathList, node, edge, distance)

                for portalIndex = 1, node.activePortalCount do
                    local portal = node.activePortals[portalIndex]
                    -- for direct one-step routes the child origin/destination are the node itself (matches original behavior)
                    curPath:tryAddChildFromPortal(node, node, node, distance - 1, portal)
                end

                finalizePathInsertion(pathList, pathKeys, curPath, created, distance, key)
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