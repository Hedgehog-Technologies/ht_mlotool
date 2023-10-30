--- Algorithm based on / translated from pedr0fontoura's audio occlusion tool (https://github.com/pedr0fontoura/gtav-audio-occlusion)
Path = {}

function Path.new(originNode, destinationNode, distance)
    local path = {}

    path.distance = distance

    path.origin = originNode
    path.destination = destinationNode

    if originNode.index == destinationNode.index then
        path.key = 0
    else
        path.key = ToInt32(originNode.key - destinationNode.key + distance)
    end

    path.childList = {}

    return path
end

function Path.addChild(path, originNode, destinationNode, distance, globalPortalIndex)
    -- if distance > 0 and originNode.index == 0 then return end

    local pathChild = {
        pathNode = Path.new(originNode, destinationNode, distance),
        globalPortalIndex = globalPortalIndex
    }

    table.insert(path.childList, pathChild)
end

function Path.isRelevant(path, originNode, destinationNode)
    return path.origin.index == originNode.index and path.destination.index == destinationNode.index
end

function Path.hasPathAlreadyBeenFound(pathList, fromNode, toNode, distance)
    for pathIndex = 1, #pathList do
        local path = pathList[pathIndex]

        if path.origin.index == fromNode.index
            and path.destination.index == toNode.index
            and path.distance <= distance
        then
            return true
        end
    end

    return false
end

function Path.findPathInList(pathList, fromNodeIndex, toNodeIndex, distance)
    for pathIndex = 1, #pathList do
        local path = pathList[pathIndex]

        if path.origin.index == fromNodeIndex
            and path.destination.index == toNodeIndex
            and path.distance == distance
        then
            return path
        end
    end

    return nil
end

function Path.generatePathsForDistance(pathList, nodes, pairList, distance)
    -- Shortest distance, list out all one step direct links and move on
    if distance == 1 then
        for nodeIndex = 1, #nodes do
            local node = nodes[nodeIndex]

            for edgeIndex = 1, #node.edges do
                local edge = node.edges[edgeIndex]
                local path = Path.new(node, edge, distance)

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
                            Path.addChild(path, node, node, distance - 1, globalPortalIndex)
                        end
                    end
                end

                -- Only add to the list if there are actually children created
                if #path.childList > 0 then
                    table.insert(pathList, path)
                end
            end
        end
    else
        pairList = pairList or Node.generateNodePairs(nodes)

        for pairIndex = 1, #pairList do
            local pair = pairList[pairIndex]
            Path.generateRoutes(pathList, pair, distance)
        end
    end
end

function Path.generateRoutes(pathList, pair, distance)
    local edges = pair.isLimboPair and pair.fromNode.edges or Node.getNonLimboEdges(pair.fromNode)

    for pathIndex = 1, #pathList do
        local path = pathList[pathIndex]

        if path.distance == distance - 1 then
            if distance == 1 or distance == 2 or distance == 3 then
                if Path.isRelevant(path, pair.fromNode, pair.toNode) then
                    local existingPath = Path.findPathInList(pathList, pair.fromNode.index, pair.toNode.index, distance)

                    if existingPath then
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
                                    Path.addChild(existingPath, pair.fromNode, pair.fromNode, distance - 1, globalPortalIndex)
                                end
                            end
                        end
                    else
                        local newPath = Path.new(pair.fromNode, pair.toNode, distance)

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
                                    Path.addChild(newPath, pair.fromNode, pair.fromNode, distance - 1, globalPortalIndex)
                                end
                            end
                        end

                        if #newPath.childList > 0 then
                            table.insert(pathList, newPath)
                        end
                    end
                else
                    for edgeIndex = 1, #edges do
                        local edge = edges[edgeIndex]

                        if Path.isRelevant(path, edge, pair.toNode) then
                            local existingPath = Path.findPathInList(pathList, pair.fromNode.index, pair.toNode.index, distance)

                            if existingPath then
                                for portalIndex = 1, pair.fromNode.activePortalCount do
                                    local portal = pair.fromNode.activePortals[portalIndex]

                                    if not portal.isMirror then
                                        local globalPortalIndex = nil
                                        if portal.toRoomIndex == edge.index then
                                            globalPortalIndex = portal.globalPortalIndices[1]
                                        elseif portal.fromRoomIndex == edge.index then
                                            globalPortalIndex = portal.globalPortalIndices[2]
                                        end

                                        if globalPortalIndex ~= nil and (edge.index == pair.toNode.index or (portal.fromRoomIndex ~= 0 and portal.toRoomIndex ~= 0)) then
                                            Path.addChild(existingPath, edge, pair.toNode, distance - 1, globalPortalIndex)
                                        end
                                    end
                                end
                            else
                                local newPath = Path.new(pair.fromNode, pair.toNode, distance)

                                for portalIndex = 1, pair.fromNode.activePortalCount do
                                    local portal = pair.fromNode.activePortals[portalIndex]

                                    if not portal.isMirror then
                                        local globalPortalIndex = nil
                                        if portal.toRoomIndex == edge.index then
                                            globalPortalIndex = portal.globalPortalIndices[1]
                                        elseif portal.fromRoomIndex == edge.index then
                                            globalPortalIndex = portal.globalPortalIndices[2]
                                        end

                                        if globalPortalIndex ~= nil and (edge.index == pair.toNode.index or (portal.fromRoomIndex ~= 0 and portal.toRoomIndex ~= 0)) then
                                            Path.addChild(newPath, edge, pair.toNode, distance - 1, globalPortalIndex)
                                        end
                                    end
                                end

                                if #newPath.childList > 0 then
                                    table.insert(pathList, newPath)
                                end
                            end
                        end
                    end
                end
            elseif distance > 3 then
                for edgeIndex = 1, #edges do
                    local edge = edges[edgeIndex]

                    if Path.isRelevant(path, edge, pair.toNode) then
                        local alreadyFound = Path.hasPathAlreadyBeenFound(pathList, pair.fromNode, pair.toNode, distance)

                        if not alreadyFound then
                            local existingPath = Path.findPathInList(pathList, pair.fromNode, pair.toNode, distance)

                            if existingPath then
                                for portalIndex = 1, pair.fromNode.activePortalCount do
                                    local portal = pair.fromNode.activePortals[portalIndex]

                                    if not portal.isMirror then
                                        local globalPortalIndex = nil
                                        if portal.toRoomIndex == edge.index then
                                            globalPortalIndex = portal.globalPortalIndices[1]
                                        elseif portal.fromRoomIndex == edge.index then
                                            globalPortalIndex = portal.globalPortalIndices[2]
                                        end

                                        if globalPortalIndex ~= nil and (edge.index == pair.toNode.index or (portal.fromRoomIndex ~= 0 and portal.toRoomIndex ~= 0)) then
                                            Path.addChild(existingPath, edge, pair.toNode, distance - 1, globalPortalIndex)
                                        end
                                    end
                                end
                            else
                                local newPath = Path.new(pair.fromNode, pair.toNode, distance)

                                for portalIndex = 1, pair.fromNode.activePortalCount do
                                    local portal = pair.fromNode.activePortals[portalIndex]

                                    if not portal.isMirror then
                                        local globalPortalIndex = nil
                                        if portal.toRoomIndex == edge.index then
                                            globalPortalIndex = portal.globalPortalIndices[1]
                                        elseif portal.fromRoomIndex == edge.index then
                                            globalPortalIndex = portal.globalPortalIndices[2]
                                        end

                                        if globalPortalIndex ~= nil and (edge.index == pair.toNode.index or (portal.fromRoomIndex ~= 0 and portal.toRoomIndex ~= 0)) then
                                            Path.addChild(newPath, edge, pair.toNode, distance - 1, globalPortalIndex)
                                        end
                                    end
                                end

                                if #newPath.childList > 0 then
                                    table.insert(pathList, newPath)
                                end
                            end
                        end
                    end
                end
            end
        end
    end
end
