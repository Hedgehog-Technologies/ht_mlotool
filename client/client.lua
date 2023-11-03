local mloCache = {}

local function openMLOInterface(mloData)
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
        if generateAO then
            local paths = MLO.generatePaths(mlo)
            local aoFileName = ('%s.ymt.pso.xml'):format(mlo.uintProxyHash)
            local ymtData = EncodeAudioOcclusion(mlo, paths)
            TriggerLatentServerEvent('ht_mloaudio:outputResultFile', 100000, aoFileName, ymtData, debug)
        end

        if generateDat151 then
            local mloName = mlo.name
            if not mloName then
                return lib.notify({
                    type = 'error',
                    title = 'Missing MLO Archetype Name, cannot generate Dat151 File'
                })
            elseif mlo.name:sub(1, 5) == 'hash_' then
                mloName = mloName:gsub('hash_', '', 1)
            end

            local datFileName = ('%s_game.dat151.rel.xml'):format(mloName)
            local dat151Data = EncodeDat151(mlo)
            TriggerLatentServerEvent('ht_mloaudio:outputResultFile', 100000, datFileName, dat151Data, debug)
        end

        TriggerLatentServerEvent('ht_mloaudio:saveMLOData', 100000, mloData)
    end
end

lib.callback.register('ht_mloaudio:getMLONameHash', function()
    local interiorId = GetInteriorFromEntity(cache.ped)
    local nameHash = nil

    if interiorId ~= 0 and IsValidInterior(interiorId) then
        _, nameHash = GetInteriorLocationAndNamehash(interiorId)
    end

    return nameHash
end)

RegisterNetEvent('ht_mloaudio:openMLO', function(data)
    if IsNuiFocused() then
        return lib.notify({
            type = 'error',
            title = 'Cannot bring up audio menu while NUI has focus somewhere else'
        })
    end

    local interiorId = GetInteriorFromEntity(cache.ped)
    local mlo = data

    if interiorId == 0 or not IsValidInterior(interiorId) then
        return lib.notify({
            type = 'error',
            title = 'Not currently in a recognized MLO interior'
        })
    end

    -- MLO Data was not passed along with the event
    -- Let's check the local client cache
    if mlo == nil then
        mlo = mloCache[interiorId]
    end

    -- MLO Data was not found in the local cache
    -- Let's query the server to see if we have data saved there
    if mlo == nil then
        local _, nameHash = GetInteriorLocationAndNamehash(interiorId)
        local hasData = lib.callback.await('ht_mloaudio:requestMLOSavedData', false, tostring(nameHash))

        -- Data was found, we'll end execution here and handle the soon-to-be-incoming latent net event elsewhere
        -- $TODO - Look into a latent callback for ox_lib 
        if hasData then return end
    end

    if mlo == false then
        mlo = MLO.new(interiorId)
        mloCache[interiorId] = mlo
    end

    if mlo == nil then
        return lib.notify({
            type = 'error',
            title = 'Failed to generate MLO data'
        })
    end

    if mloCache[interiorId] == nil then mloCache[interiorId] = mlo end

    openMLOInterface(mlo)
end)

RegisterNetEvent('ht_mloaudio:saveCurrentMLO', function(name)
    local interiorId = GetInteriorFromEntity(cache.ped)
    local mlo = mloCache[interiorId]

    if interiorId == 0 or not IsValidInterior(interiorId) then
        return lib.notify({ type = 'error', title = 'Not currently in a recognized MLO interior' })
    elseif not mlo then
        mlo = MLO.new(interiorId)
        mloCache[interiorId] = mlo
    end

    if mlo == nil then
        return lib.notify({ type = 'error', title = 'Failed to find a valid MLO'})
    end

    if name ~= nil then mlo.saveName = name end

    TriggerLatentServerEvent('ht_mloaudio:saveMLOData', 100000, mlo)
end)

RegisterNetEvent('ht_mloaudio:loadMLOData', function(mloData, openUI)
    if mloData == nil then return end

    local interiorId = GetInteriorFromEntity(cache.ped)
    if interiorId == 0 or not IsValidInterior(interiorId) then return end

    local _, nameHash = GetInteriorLocationAndNamehash(interiorId)

    if mloData.nameHash == nameHash then
        mloCache[interiorId] = mloData
    end

    if openUI then
        openMLOInterface(mloData)
    end
end)
