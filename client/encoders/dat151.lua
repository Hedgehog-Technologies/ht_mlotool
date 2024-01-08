function EncodeDat151(mlo)
    local datLua = {
        {
            tagName = 'Dat151',
            content = {
                { tagName = 'Version', attr = { value = '35636732' } },
                {
                    tagName = 'Items',
                    content = {
                        {
                            tagName = 'Item',
                            attr = { type = 'Interior', ntOffset = 0 },
                            content = {
                                { tagName = 'Name', value = mlo.name },
                                { tagName = 'Flags', attr = { value = '0xAAAAA044' } },
                                { tagName = 'Walla', value = '0xD4855127' },
                                { tagName = 'Tunnel', value = '0x00000000' },
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
                    { tagName = 'Name', value = occlRoomName  },
                    { tagName = 'Flags0', attr = { value = room.flags } },
                    { tagName = 'MloRoom', value = string.lower(room.name) },
                    { tagName = 'Zone', value = (room.zone ~= '' and room.zone or nil) },
                    { tagName = 'Unk02', attr = { value = room.unk02 } },
                    { tagName = 'Unk03', attr = { value = room.unk03 } },
                    { tagName = 'Reverb', attr = { value = room.reverb } },
                    { tagName = 'Echo', attr = { value = room.echo } },
                    { tagName = 'Sound', value = room.sound },
                    { tagName = 'Unk07', attr = { value = room.unk07 } },
                    { tagName = 'Unk08', attr = { value = room.unk08 } },
                    { tagName = 'Unk09', attr = { value = room.unk09 } },
                    { tagName = 'Unk10', attr = { value = room.unk10 } },
                    { tagName = 'Unk11', attr = { value = room.unk11 } },
                    { tagName = 'Unk12', attr = { value = room.unk12 } },
                    { tagName = 'Unk13', value = (room.unk13 ~= '' and room.unk13 or nil) },
                    { tagName = 'SoundSet', value = room.soundSet }
                }
            }

            table.insert(datLua[1].content[2].content[1].content[5].content, roomItem)
            table.insert(datLua[1].content[2].content, interiorRoom)
        end
    end

    return datLua
end
