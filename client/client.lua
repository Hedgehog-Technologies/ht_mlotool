local mloCache = {}

-- ##### FUNCTIONS ##### --

local function openMLOInterface(mloData)
    if not mloData.interiorId or mloData.interiorId <= 0 then
        mloData.interiorId = GetInteriorFromEntity(cache.ped)
    end

    local currentRoomHash = GetRoomKeyFromEntity(cache.ped)
    local currentRoomIndex = GetInteriorRoomIndexByHash(mloData.interiorId, currentRoomHash)

    OpenMLO(mloData, currentRoomIndex)
end

function UpdateMLOData(mloData)
    local mlo = mloCache[mloData.interiorId]

    if mlo then MLO.update(mlo, mloData) end

    return mlo
end

function GenerateMLOFiles(mloData, generateAO, generateDat151, debug)
    local mlo = UpdateMLOData(mloData)

    if mlo then
        local saveDirName = mlo.saveName ~= '' and mlo.saveName or { mlo.nameHash, mlo.name }
        if generateAO then
            local paths, pathKeys = MLO.generatePaths(mlo)
            local aoFileName = tostring(mlo.uintProxyHash)
            local aoFileType = 'ymt.pso.xml'
            local ymtData = EncodeAudioOcclusion(mlo, paths, pathKeys)
            TriggerLatentServerEvent('ht_mlotool:outputResultFile', 100000, saveDirName, aoFileName, aoFileType, ymtData, debug)
        end

        if generateDat151 then
            local mloName = mlo.name
            if not mloName then
                return lib.notify({
                    type = 'error',
                    title = locale('missing_mlo_archetype_name')
                })
            elseif mlo.name:sub(1, 5) == 'hash_' then
                mloName = mloName:gsub('hash_', '', 1)
            end

            local datFileName = ('%s_game'):format(mloName)
            local datFileType = 'dat151.rel.xml'
            local dat151Data = EncodeDat151(mlo)
            TriggerLatentServerEvent('ht_mlotool:outputResultFile', 100000, saveDirName, datFileName, datFileType, dat151Data, debug)
        end

        TriggerLatentServerEvent('ht_mlotool:saveMLOData', 100000, mlo)
    end
end

-- ##### EVENTS & CALLBACKS ##### --

lib.callback.register('ht_mlotool:getMLONameHash', function()
    local interiorId = GetInteriorFromEntity(cache.ped)
    local nameHash = nil

    if interiorId ~= 0 and IsValidInterior(interiorId) then
        _, nameHash = GetInteriorLocationAndNamehash(interiorId)
    end

    return nameHash
end)

RegisterNetEvent('ht_mlotool:openMLO', function(data)
    if IsNuiFocused() then
        return lib.notify({
            type = 'error',
            title = locale('nui_already_focused')
        })
    end

    local interiorId = GetInteriorFromEntity(cache.ped)
    local mlo = data

    if interiorId == 0 or not IsValidInterior(interiorId) then
        return lib.notify({
            type = 'error',
            title = locale('unrecognized_interior')
        })
    end

    -- MLO Data was not passed along with the event
    -- Let's check the local client cache
    if mlo == nil then
        mlo = mloCache[interiorId]
    end

    -- MLO Data was not found in the local cache
    -- Let's query the server to see if we have data saved there
    local hasData = nil
    if mlo == nil then
        local _, nameHash = GetInteriorLocationAndNamehash(interiorId)
        hasData = lib.callback.await('ht_mlotool:requestMLOSaveData', false, tostring(nameHash))

        -- Data was found, we'll end execution here and handle the soon-to-be-incoming latent net event elsewhere
        -- $TODO - Look into a latent callback for ox_lib 
        if hasData then return end
    end

    if mlo == false or hasData == false then
        mlo = MLO.new(interiorId)
        mloCache[interiorId] = mlo
    end

    if mlo == nil then
        return lib.notify({
            type = 'error',
            title = locale('data_generation_fail')
        })
    end

    if not mlo.globalPortalCount then
        MLO.updateGlobalPortals(mlo)
    end

    if mloCache[interiorId] == nil then mloCache[interiorId] = mlo end

    openMLOInterface(mlo)
end)

RegisterNetEvent('ht_mlotool:saveCurrentMLO', function(name)
    local interiorId = GetInteriorFromEntity(cache.ped)
    local mlo = mloCache[interiorId]

    if interiorId == 0 or not IsValidInterior(interiorId) then
        return lib.notify({ type = 'error', title = locale('unrecognized_interior') })
    elseif not mlo then
        mlo = MLO.new(interiorId)
        mloCache[interiorId] = mlo
    end

    if mlo == nil then
        return lib.notify({ type = 'error', title = locale('save_mlo_fail_invalid') })
    end

    if name ~= nil then mlo.saveName = name end

    TriggerLatentServerEvent('ht_mlotool:saveMLOData', 100000, mlo)
end)

RegisterNetEvent('ht_mlotool:loadMLOData', function(mloData, openUI)
    if mloData == nil then return end

    local interiorId = GetInteriorFromEntity(cache.ped)
    if interiorId == 0 or not IsValidInterior(interiorId) then return end

    local _, nameHash = GetInteriorLocationAndNamehash(interiorId)

    if not mloData.globalPortalCount then
        MLO.updateGlobalPortals(mloData)
    end

    if mloData.nameHash == nameHash then
        mloCache[interiorId] = mloData
    end

    if openUI then
        openMLOInterface(mloData)
    end
end)
