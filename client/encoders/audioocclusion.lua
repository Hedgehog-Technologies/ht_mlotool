function EncodeAudioOcclusion(mlo, paths)
    local ymtLua = {
        {
            tagName = 'naOcclusionInteriorMetadata',
            content = {
                { tagName = 'PortalInfoList', attr = { itemType = 'naOcclusionPortalInfoMetadata' }, content = {} },
                { tagName = 'PathNodeList', attr = { itemType = 'naOcclusionPathNodeMetadata' }, content = {} }
            },
            comment = mlo.archetypeName
        }
    }

    local globalPortalIndex = 0
    for roomIndex = 1, mlo.roomCount do
        local room = mlo.rooms[roomIndex]
        local roomPortalIndex = 0
        for portalIndex = 1, mlo.portalCount do
            local portal = mlo.portals[portalIndex]

            if portal.fromRoomIndex == room.index or portal.toRoomIndex == room.index then
                -- WHY DOES THE TERNARY WAY BREAK?! if portal.toRoomIndex is 0 then it sets the value to portal.fromRoomIndex and I have no idea why
                -- local destRoomIndex = portal.fromRoomIndex == room.Index and portal.toRoomIndex or portal.fromRoomIndex
                local destRoomIndex
                if portal.fromRoomIndex == room.index then
                    destRoomIndex = portal.toRoomIndex
                else
                    destRoomIndex = portal.fromRoomIndex
                end

                local destRoom = mlo.rooms[destRoomIndex + 1]
                local portalItem = {
                    tagName = 'Item',
                    content = {
                        { tagName = 'InteriorProxyHash', attr = { value = mlo.proxyHash } },
                        { tagName = 'PortalIdx', attr = { value = roomPortalIndex } },
                        { tagName = 'RoomIdx', attr = { value = room.index } },
                        { tagName = 'DestInteriorHash', attr = { value = mlo.proxyHash } },
                        { tagName = 'DestRoomIdx', attr = { value = destRoomIndex } }
                    },
                    comment = ('(%s) %s %s -> %s %s'):format(globalPortalIndex, room.index, room.name, destRoom.index, destRoom.name)
                }

                local entityList = { tagName = 'PortalEntityList', attr = { itemType = 'naOcclusionPortalEntityMetadata' } }
                local entityItemList = {}
                for entityIndex = 1, portal.entityCount do
                    local entity = portal.entities[entityIndex]
                    local entityItem = {
                        tagName = 'Item',
                        content = {
                            { tagName = 'LinkType', attr = { value = entity.linkType } },
                            { tagName = 'MaxOcclusion', attr = { value = entity.maxOcclusion } },
                            { tagName = 'EntityModelHashkey', attr = { value = entity.modelHashKey } },
                            { tagName = 'IsDoor', attr = { value = entity.isDoor } },
                            { tagName = 'IsGlass', attr = { value = entity.isGlass } }
                        }
                    }

                    table.insert(entityItemList, entityItem)
                end

                if #entityItemList > 0 then entityList.content = entityItemList end

                table.insert(portalItem.content, entityList)
                table.insert(ymtLua[1].content[1].content, portalItem)

                roomPortalIndex += 1
                globalPortalIndex += 1
            end
        end
    end

    for _, pathNode in ipairs(paths) do
        local fromNodeIndex = pathNode.origin.index
        local toNodeIndex = pathNode.destination.index

        local pathNodeItem = {
            tagName = 'Item',
            content = {
                { tagName = 'Key', attr = { value = pathNode.key } },
                { tagName = 'PathNodeChildList', attr = { itemType = 'naOcclusionPathNodeChildMetadata' }, content = {} }
            },
            comment = ('(%s %s -> %s %s) + %s'):format(fromNodeIndex, pathNode.origin.name, toNodeIndex, pathNode.destination.name, pathNode.distance)
        }

        for _, pathNodeChild in ipairs(pathNode.childList) do
            local childItem = {
                tagName = 'Item',
                content = {
                    { tagName = 'PathNodeKey', attr = { value = pathNodeChild.pathNode.key } },
                    { tagName = 'PortalInfoIdx', attr = { value = pathNodeChild.globalPortalIndex } }
                },
                comment = ('(%s %s -> %s %s) + %s'):format(pathNodeChild.pathNode.origin.index, pathNodeChild.pathNode.origin.name, pathNodeChild.pathNode.destination.index, pathNodeChild.pathNode.destination.name, pathNodeChild.pathNode.distance)
            }
            table.insert(pathNodeItem.content[2].content, childItem)
        end

        if #pathNodeItem.content[2].content > 0 then
            table.insert(ymtLua[1].content[2].content, pathNodeItem)
        end
    end

    return ymtLua
end
