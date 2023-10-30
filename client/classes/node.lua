Node = {}
NodePair = {}

function Node.new(room, portals)
    local node = {}

    node.room = room

    node.index = room.index
    node.name = room.name
    node.key = room.uintRoomKey -- Calculate with unsigned int then convert to signed int later

    node.activePortals = portals
    node.activePortalCount = #portals

    node.edges = {}

    return node
end

function Node.generatePaths(nodes)
    local pathList = {}
    local nodePairList = Node.generateNodePairs(nodes)

    -- local longestShortPathDistance = NodePair.getLongestShortPath(nodePairList)

    for i = 1, 5 do
        Path.generatePathsForDistance(pathList, nodes, nodePairList, i)
    end

    return pathList
end

function Node.getNonLimboEdges(node)
    local nlEdges = {}

    for edgeIndex = 1, #node.edges do
        local edge = node.edges[edgeIndex]

        if edge.index ~= 0 then
            table.insert(nlEdges, edge)
        end
    end

    return nlEdges
end

function Node.generateNodePairs(nodes)
    local nodePairs = {}
    local pairCount = 0

    for fromIndex = 1, #nodes do
        local fromNode = nodes[fromIndex]

        for toIndex = 1, #nodes do
            local toNode = nodes[toIndex]

            if fromNode.index ~= toNode.index then
                pairCount += 1
                nodePairs[pairCount] = NodePair.new(fromNode, toNode)
            end
        end
    end

    return nodePairs
end

function NodePair.new(fromNode, toNode)
    local nodePair = {}

    nodePair.key = fromNode.key - toNode.key

    nodePair.fromNode = fromNode
    nodePair.toNode = toNode

    nodePair.isLimboPair = fromNode.index == 0 or toNode.index == 0

    return nodePair
end

function NodePair.getLongestShortPath(pairs)
    local longestPathDistance = -1

    for pairIndex = 1, #pairs do
        local pair = pairs[pairIndex]
        local distance = -1

        if pair.isLimboPair then
            distance = -1
        else
            local visited = {}
            local queue = {}

            table.insert(queue, { node = pair.fromNode, distance = 0 })

            while #queue > 0 do
                local current = table.remove(queue, 1)

                if current.node.index == pair.toNode.index then
                    distance = current.distance
                    break
                else
                    for edgeIndex = 1, #current.node.edges do
                        local edge = current.node.edges[edgeIndex]
                        if edge.index ~= 0 and not visited[edge.index] then
                            table.insert(queue, { node = edge, distance = current.distance + 1})
                            visited[edge.index] = true
                        end
                    end
                end
            end
        end

        if distance > longestPathDistance then
            longestPathDistance = distance
        end
    end

    return longestPathDistance
end
