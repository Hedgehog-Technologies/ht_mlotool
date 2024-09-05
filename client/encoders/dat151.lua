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
                                { tagName = 'InteriorReflections' },
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

    print(mlo.staticEmitters, mlo.staticEmitterCount)
    if mlo.staticEmitters and mlo.staticEmitterCount > 0 then
        table.insert(datLua[1].content[2].content, {
            tagName = 'Item',
            attr = { type = 'StaticEmitterList', ntOffset = 0 },
            content = {
                { tagName = 'Name', value = ('%s_emitter_list'):format(mlo.name:gsub('hash_', '')) },
                { tagName = 'Emitters', content = {} }
            }
        })

        local emitterListIndex = #datLua[1].content[2].content

        for name, emitter in pairs(mlo.staticEmitters) do
            local emitterName = ('%s_%s'):format(mlo.name:gsub('hash_', ''), name)
            local pos = StrSplit(emitter.position, ', ')

            table.insert(
                datLua[1].content[2].content[emitterListIndex].content[2].content,
                { tagName = 'Item', value = emitterName })

            table.insert(datLua[1].content[2].content, {
                tagName = 'Item',
                attr = { type = 'StaticEmitter', ntOffset = 0 },
                content = {
                    { tagName = 'Name', value = emitterName },
                    { tagName = 'Flags', attr = { value = emitter.flags } },
                    { tagName = 'ChildSound', value = emitter.childSound },
                    { tagName = 'RadioStation', value = emitter.radioStation },
                    { tagName = 'Position', attr = { x = pos[1], y = pos[2], z = pos[3] } },
                    { tagName = 'MinDistance', attr = { value = emitter.minDistance } },
                    { tagName = 'MaxDistance', attr = { value = emitter.maxDistance } },
                    { tagName = 'EmittedVolume', attr = { value = emitter.emittedVolume } },
                    { tagName = 'LPFCutoff', attr = { value = emitter.lpfCutoff } },
                    { tagName = 'HPFCutoff', attr = { value = emitter.hpfCutoff } },
                    { tagName = 'RolloffFactor', attr = { value = emitter.rolloffFactor } },
                    { tagName = 'Interior', value = emitter.interior },
                    { tagName = 'Room', value = emitter.room },
                    { tagName = 'RadioStationForScore', value = emitter.radioStationForScore },
                    { tagName = 'MaxLeakage', attr = { value = emitter.maxLeakage } },
                    { tagName = 'MinLeakageDistance', attr = { value = emitter.minLeakageDistance } },
                    { tagName = 'MaxLeakageDistance', attr = { value = emitter.maxLeakageDistance } },
                    { tagName = 'Alarm', value = emitter.alarm },
                    { tagName = 'OnBreakOneShot', value = emitter.onBreakOneShot },
                    { tagName = 'MaxPathDepth', attr = { value = emitter.maxPathDepth } },
                    { tagName = 'SmallReverbSend', attr = { value = emitter.smallReverbSend } },
                    { tagName = 'MediumReverbSend', attr = { value = emitter.mediumReverbSend } },
                    { tagName = 'LargeReverbSend', attr = { value = emitter.largeReverbSend } },
                    { tagName = 'MinTimeMinutes', attr = { value = emitter.minTimeMinutes } },
                    { tagName = 'MaxTimeMinutes', attr = { value = emitter.maxTimeMinutes } },
                    { tagName = 'BrokenHealth', attr = { value = emitter.brokenHealth } },
                    { tagName = 'UndamagedHealth', attr = { value = emitter.undamagedHealth } }
                }
            })
        end
    end

    return datLua
end
