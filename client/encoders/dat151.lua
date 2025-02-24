function EncodeDat151(mlo)
    local datLua = {
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
                                { tagName = 'Name', value = mlo.name },
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

    for _, room in ipairs(mlo.rooms) do
        if room.index ~= 0 then
            local occlRoomName = room.occlRoomName
            if occlRoomName:sub(1, 5) == 'hash_' then
                occlRoomName = occlRoomName:gsub('hash_', '', 1)
            end

            local roomItem = { tagName = 'Item', value = occlRoomName }
            local interiorRoom = {
                tagName = 'Item',
                attr = { type = 'InteriorRoom', ntOffset = 0 },
                content = {
                    -- * These are the names that Codewalker is expecting as of release dev47
                    { tagName = 'Name', value = occlRoomName  },
                    { tagName = 'Flags', attr = { value = room.flags } },
                    { tagName = 'RoomName', value = string.lower(room.name) },
                    { tagName = 'AmbientZone', value = (room.zone ~= '' and room.zone or nil) },
                    { tagName = 'InteriorType', attr = { value = room.unk02 } },
                    { tagName = 'ReverbSmall', attr = { value = room.unk03 } },
                    { tagName = 'ReverbMedium', attr = { value = room.reverb } },
                    { tagName = 'ReverbLarge', attr = { value = room.echo } },
                    { tagName = 'RoomToneSound', value = room.sound },
                    { tagName = 'RainType', attr = { value = room.unk07 } },
                    { tagName = 'ExteriorAudibility', attr = { value = room.unk08 } },
                    { tagName = 'RoomOcclusionDamping', attr = { value = room.unk09 } },
                    { tagName = 'NonMarkedPortalOcclusion', attr = { value = room.unk10 } },
                    { tagName = 'DistanceFromPortalForOcclusion', attr = { value = room.unk11 } },
                    { tagName = 'DistanceFromPortalFadeDistance', attr = { value = room.unk12 } },
                    { tagName = 'WeaponMetrics', value = (room.unk13 ~= '' and room.unk13 or nil) },
                    { tagName = 'InteriorWallaSoundSet', value = room.soundSet }
                }
            }

            table.insert(datLua[1].content[2].content[1].content[5].content, roomItem)
            table.insert(datLua[1].content[2].content, interiorRoom)
        end
    end

    return datLua
end
