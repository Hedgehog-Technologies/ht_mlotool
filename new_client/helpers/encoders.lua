local encodersApi = {}

---@param interior CInterior
---@param audioOcclusion CAudioOcclusion
---@return [ TXmlTag ]
function encodersApi.encodeAudioOcclusion(interior, audioOcclusion)
    ---@type [ TXmlTag ]
    local ymtTag = {
        {
            tagName = 'naOcclusionInteriorMetadata',
            content = {
                { tagName = 'PortalInfoList', attr = { itemType = 'naOcclusionPortalInfoMetadata' }, content = {} },
                { tagName = 'PathNodeList', attr = { itemType = 'naOcclusionPathNodeMetadata' }, content = {} }
            },
            comment = interior.name
        }
    }

    local globalPortalIndex = 0
    for roomIndex = 1, interior.roomCount do
        local room = interior.rooms[roomIndex]
        local roomPortalIndex = 0

        for portalIndex = 1, interior.portalCount do
            local portal = interior.portals[portalIndex]

            if portal.fromRoomIndex == room.index or portal.toRoomIndex == room.index then
                if not portal.isMirror then
                    -- WHY DOES THE TERNARY WAY BREAK?! If portal.toRoomIndex is 0 then it sets the value to portal.fromRoomIndex and I have no idea why since 0 isn't falsey in Lua
                    -- local destRoomIndex = portal.fromRoomIndex == room.index and portal.toRoomIndex or portal.fromRoomIndex
                    local destRoomIndex
                    if portal.fromRoomIndex == room.index then
                        destRoomIndex = portal.toRoomIndex
                    else
                        destRoomIndex = portal.fromRoomIndex
                    end

                    local destRoom = interior.rooms[destRoomIndex + 1]
                    ---@type TXmlTag
                    local portalItemTag = {
                        tagName = 'Item',
                        content = {
                            { tagName = 'InteriorProxyHash', attr = { value = interior.proxyHash } },
                            { tagName = 'PortalIdx', attr = { value = roomPortalIndex } },
                            { tagName = 'RoomIdx', attr = { value = room.index } },
                            { tagName = 'DestInteriorHash', attr = { value = interior.proxyHash } },
                            { tagName = 'DestRoomIdx', attr = { value = destRoomIndex } }
                        },
                        comment = ('(%s) %s %s -> %s %s'):format(
                            globalPortalIndex,
                            room.index,
                            room.name,
                            destRoom.index,
                            destRoom.name
                        )
                    }

                    ---@type TXmlTag
                    local entityListTag = { tagName = 'PortalEntityList', attr = { itemType = 'naOcclusionPortalEntityMetadata' } }
                    ---@type TXmlTag[]
                    local entityItemTagList = {}

                    for entityIndex = 1, portal.entityCount do
                        local entity = portal.entities[entityIndex]
                        ---@type TXmlTag
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

                        entityItemTagList[entityIndex] = entityItem
                    end

                    if portal.entityCount > 0 then entityListTag.content = entityItemTagList end

                    table.insert(portalItemTag.content, entityListTag)
                    table.insert(ymtTag[1].content[1].content, portalItemTag)

                    globalPortalIndex += 1
                end

                roomPortalIndex += 1
            end
        end
    end

    for _, distanceKeys in ipairs(audioOcclusion.pathKeys) do
        for _, key in ipairs(distanceKeys) do
            local pathNode = audioOcclusion.paths[key]
            local fromNodeIndex = pathNode.origin.index
            local toNodeIndex = pathNode.destination.index

            ---@type TXmlTag
            local pathNodeItemTag = {
                tagName = 'Item',
                content = {
                    { tagName = 'Key', attr = { value = pathNode.key } },
                    { tagName = 'PathNodeChildList', attr = { itemType = 'naOcclusionPathNodeChildMetadata' }, content = {} }
                },
                comment = ('(%s %s -> %s %s) + %s'):format(
                    fromNodeIndex,
                    pathNode.origin.name,
                    toNodeIndex,
                    pathNode.destination.name,
                    pathNode.distance
                )
            }

            table.sort(pathNode.childList, function(a, b)
                return a.globalPortalIndex < b.globalPortalIndex
            end)

            for pathNodeIndex = 1, pathNode.childCount do
                local pathNodeChild = pathNode.childList[pathNodeIndex]

                ---@type TXmlTag
                local childItemTag = {
                    tagName = 'Item',
                    content = {
                        { tagName = 'PathNodeKey', attr = { value = pathNodeChild.pathNode.key } },
                        { tagName = 'PortalInfoIdx', attr = { value = pathNodeChild.globalPortalIndex } }
                    },
                    comment = ('(%s %s -> %s %s) + %s'):format(
                        pathNodeChild.pathNode.origin.index,
                        pathNodeChild.pathNode.origin.name,
                        pathNodeChild.pathNode.destination.index,
                        pathNodeChild.pathNode.destination.name,
                        pathNodeChild.pathNode.distance
                    )
                }

                pathNodeItemTag.content[2].content[pathNodeIndex] = childItemTag
            end

            if pathNode.childCount > 0 then
                table.insert(ymtTag[1].content[2].content, pathNodeItemTag)
            end
        end
    end

    return ymtTag
end

---@param interior CInterior
---@return [ TXmlTag ]
function encodersApi.encodeDat151(interior)
    ---@type [ TXmlTag ]
    local dat151Tag = {
        {
            tagName = 'Dat151',
            content = {
                { tagName = 'Version', attr = { value = '45897013' } },
                {
                    tagName = 'Items',
                    content = {
                        {
                            tagName = 'Item',
                            attr = { type = 'InteriorSettings', ntOffset = 0 },
                            content = {
                                { tagName = 'Name', value = interior.name },
                                { tagName = 'Flags', attr = { value = '0xAAAAA044' } },
                                { tagName = 'InteriorWallaSoundSet', value = '0xD4855127' },
                                { tagName = 'InteriorReflections', value = '0x00000000' },
                                { tagName = 'Rooms', content = {} }
                            }
                        }
                    }
                }
            }
        }
    }

    for roomIndex = 1, interior.roomCount do
        local room = interior.rooms[roomIndex]

        if room.index ~= 0 then
            local roomDat151 = room.dat151
            local occlRoomName = roomDat151.occlRoomName

            if occlRoomName:sub(1, 5) == 'hash_' then
                occlRoomName = occlRoomName:gsub('hash_', '', 1)
            end

            ---@type TXmlTag
            local roomItemTag = { tagName = 'Item', value = occlRoomName }
            ---@type TXmlTag
            local interiorRoomTag = {
                tagName = 'Item',
                attr = { type = 'InteriorRoom', ntOffset = 0 },
                content = {
                    -- * These are the names that Codewalker is expecting as of release dev47
                    { tagName = 'Name', value = occlRoomName },
                    { tagName = 'Flags', attr = { value = roomDat151.flags } },
                    { tagName = 'RoomName', value = string.lower(room.name) },
                    { tagName = 'AmbientZone', value = (roomDat151.ambientZone ~= '' and roomDat151.ambientZone or nil) },
                    { tagName = 'InteriorType', attr = { value = roomDat151.interiorType } },
                    { tagName = 'ReverbSmall', attr = { value = roomDat151.reverbSmall } },
                    { tagName = 'ReverbMedium', attr = { value = roomDat151.reverbMedium } },
                    { tagName = 'ReverbLarge', attr = { value = roomDat151.reverbLarge } },
                    { tagName = 'RoomToneSound', value = roomDat151.roomToneSound },
                    { tagName = 'RainType', attr = { value = roomDat151.rainType } },
                    { tagName = 'ExteriorAudibility', attr = { value = roomDat151.exteriorAudibility } },
                    { tagName = 'RoomOcclusionDamping', attr = { value = roomDat151.roomOcclusionDamping } },
                    { tagName = 'NonMarkedPortalOcclusion', attr = { value = roomDat151.nonMarkedPortalOcclusion } },
                    { tagName = 'DistanceFromPortalForOcclusion', attr = { value = roomDat151.distanceFromPortalForOcclusion } },
                    { tagName = 'DistanceFromPortalFadeDistance', attr = { value = roomDat151.distanceFromPortalFadeDistance } },
                    { tagName = 'WeaponMetrics', value = (roomDat151.weaponMetrics ~= '' and roomDat151.weaponMetrics or nil) },
                    { tagName = 'InteriorWallaSoundSet', value = roomDat151.interiorWallaSoundSet }
                }
            }

            table.insert(dat151Tag[1].content[2].content[1].content[5].content, roomItemTag)
            table.insert(dat151Tag[1].content[2].content, interiorRoomTag)
        end
    end

    return dat151Tag
end

return encodersApi --[[@as EncodersApi]]
