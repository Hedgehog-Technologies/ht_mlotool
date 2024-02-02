--- Algorithm based on / translated from pedr0fontoura's audio occlusion tool (https://github.com/pedr0fontoura/gtav-audio-occlusion)
Path = {}

function Path.new(originNode, destinationNode, distance)
    local path = {}

    path.distance = distance

    path.origin = originNode
    path.destination = destinationNode

    if originNode.index == destinationNode.index then
        path.uintKey = 0
        path.key = 0
    else
        path.uintKey = ToUInt32(originNode.key - destinationNode.key) + distance
        path.key = ToInt32(path.uintKey)
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

function Path.hasPathAlreadyBeenFound(pathList, fromNodeKey, toNodeKey, distance)
    local nodePairKey = ToUInt32(fromNodeKey - toNodeKey)
    for i = 1, distance do
        if pathList[nodePairKey + i] then
            return true
        end
    end

    return false
end

function Path.findPathInList(pathList, fromNodeKey, toNodeKey, distance)
    local nodePairKey = ToUInt32(fromNodeKey - toNodeKey) + distance
    return pathList[nodePairKey]
end

function Path.generatePathsForDistance(pathList, pathKeys, nodes, pairList, distance)
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
                    pathList[path.uintKey] = path
                    table.insert(pathKeys[distance], path.uintKey)
                end
            end
        end
    else
        pairList = pairList or Node.generateNodePairs(nodes)

        for pairIndex = 1, #pairList do
            local pair = pairList[pairIndex]
            Path.generateRoutes(pathList, pathKeys, pair, distance)
        end
    end
end

function Path.generateRoutes(pathList, pathKeys, pair, distance)
    local edges = pair.isLimboPair and pair.fromNode.edges or Node.getNonLimboEdges(pair.fromNode)
    -- because I'll forget, DMO == distance minus one
    local dmoPathKeys = pathKeys[distance - 1]

    for keyIndex = 1, #dmoPathKeys do
        local path = pathList[dmoPathKeys[keyIndex]]

        if distance == 1 or distance == 2 or distance == 3 then
            if Path.isRelevant(path, pair.fromNode, pair.toNode) then
                local curPath = Path.findPathInList(pathList, pair.fromNode.key, pair.toNode.key, distance)

                local new = false
                if not curPath then
                    curPath = Path.new(pair.fromNode, pair.toNode, distance)
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
                            Path.addChild(curPath, pair.fromNode, pair.fromNode, distance - 1, globalPortalIndex)
                        end
                    end
                end

                if new and #curPath.childList > 0 then
                    pathList[curPath.uintKey] = curPath
                    table.insert(pathKeys[distance], curPath.uintKey)
                end
            else
                for edgeIndex = 1, #edges do
                    local edge = edges[edgeIndex]

                    if Path.isRelevant(path, edge, pair.toNode) then
                        local curPath = Path.findPathInList(pathList, pair.fromNode.key, pair.toNode.key, distance)

                        local new = false
                        if not curPath then
                            curPath = Path.new(pair.fromNode, pair.toNode, distance)
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

                                if globalPortalIndex ~= nil and (edge.index == portal.fromRoomIndex or (portal.fromRoomIndex ~= 0 and portal.toRoomIndex ~= 0)) then
                                    Path.addChild(curPath, edge, pair.toNode, distance - 1, globalPortalIndex)
                                end
                            end
                        end

                        if new and #curPath.childList > 0 then
                            pathList[curPath.uintKey] = curPath
                            table.insert(pathKeys[distance], curPath.uintKey)
                        end
                    end
                end
            end
        elseif distance > 3 then
            for edgeIndex = 1, #edges do
                local edge = edges[edgeIndex]

                if Path.isRelevant(path, edge, pair.toNode) then
                    local alreadyFound = Path.hasPathAlreadyBeenFound(pathList, pair.fromNode.key, pair.toNode.key, distance)

                    if not alreadyFound then
                        local curPath = Path.findPathInList(pathList, pair.fromNode.key, pair.toNode.key, distance)

                        local new = false
                        if not curPath then
                            curPath = Path.new(pair.fromNode, pair.toNode, distance)
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

                                if globalPortalIndex ~= nil and (edge.index == pair.toNode.index or (portal.fromRoomIndex ~= 0 and portal.toRoomIndex ~= 0)) then
                                    Path.addChild(curPath, edge, pair.toNode, distance - 1, globalPortalIndex)
                                end
                            end
                        end

                        if new and #curPath.childList > 0 then
                            pathList[curPath.uintKey] = curPath
                            table.insert(pathKeys[distance], curPath.uintKey)
                        end
                    end
                end
            end
        end
    end
end
