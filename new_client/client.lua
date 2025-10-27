---@type Config
local Config = require 'shared.config'

---@type ClientUtilsApi
local Utils = require 'new_client.helpers.utils'

---@type InteriorCacheApi
local InteriorCache = require 'new_client.helpers.interiorcache'

---@type CInterior
local CInterior = require 'new_client.classes.CInterior'

---@param interior CInterior
local function openToolInterface(interior)
    if not interior.interiorId or interior.interiorId <= 0 then
        interior.interiorId = GetInteriorFromEntity(cache.ped)
    end

    local currentRoomHash = GetRoomKeyFromEntity(cache.ped)
    local currentRoomIndex = GetInteriorRoomIndexByHash(interior.interiorId, currentRoomHash)

    if IsNuiFocused() then
        lib.print.warn(locale('nui_already_focused'))
        return lib.notify({
            type = 'error',
            title = locale('nui_already_focused')
        })
    else
        lib.print.verbose(('Opening Tool NUI for %s'):format(interior and interior.saveName or interior.nameHash))
        SetNuiFocus(true, true)
        Utils.sendReactMessage('ht_mlotool:openTool', { interiorData = interior, roomIndex = currentRoomIndex })
    end
end

---@return number?
lib.callback.register('ht_mlotool:getInteriorNameHash', function()
    local interiorId = GetInteriorFromEntity(cache.ped)
    local nameHash = nil

    if interiorId ~= 0 and IsValidInterior(interiorId) then
        _, nameHash = GetInteriorLocationAndNamehash(interiorId)
    end

    return nameHash
end)

---@param interiorData TInteriorData|table
---@param shouldOpenUI boolean?
RegisterNetEvent('ht_mlotool:loadInteriorData', function(interiorData, shouldOpenUI)
    if interiorData == nil then return end

    InteriorCache.addInterior(CInterior:new(nil, interiorData))

    if shouldOpenUI then
        local interiorId = GetInteriorFromEntity(cache.ped)
        if interiorId == 0 or not IsValidInterior(interiorId) then return end

        local interior = InteriorCache:getInterior(interiorId)
        openToolInterface(interior)
    end
end)

---@param name string?
RegisterNetEvent('ht_mlotool:saveCurrentInterior', function(name)
    local interiorId = GetInteriorFromEntity(cache.ped)
    local interior = InteriorCache.getInterior(interiorId)

    if interiorId == 0 or not IsValidInterior(interiorId) then
        return lib.notify({
            type = 'error',
            title = locale('unrecognized_interior')
        })
    elseif not interior then
        interior = CInterior:new(interiorId)
        InteriorCache.addInterior(interior)
    end

    if interior == nil then
        return lib.notify({
            type = 'error',
            title = locale('save_mlo_fail_invalid')
        })
    end

    if name ~= nil then interior.saveName = name end

    TriggerLatentServerEvent('ht_mlotool:saveInteriorData', Config.clientToServerBPS, interior:getSaveData())
end)

---@param interiorData TInteriorData|false|nil
RegisterNetEvent('ht_mlotool:openInterior', function(interiorData)
    if IsNuiFocused() then
        lib.print.warn(locale('nui_already_focused'))
        return lib.notify({
            type = 'error',
            title = locale('nui_already_focused')
        })
    end

    local interiorId = GetInteriorFromEntity(cache.ped)
    local interior = interiorData

    if interiorId == 0 or not IsValidInterior(interiorId) then
        return lib.notify({
            type = 'error',
            title = locale('unrecognized_interior')
        })
    end

    -- Interior data was not passed along
    -- Let's check for cached value
    if interior == nil then
        interior = InteriorCache.getInterior(interiorId)
    end

    -- Interior data was not found in the cache
    -- Let's query the server to see if we have data saved there
    local hasData = nil
    if interior == nil then
        local _, nameHash = GetInteriorLocationAndNamehash(interiorId)
        hasData = lib.callback.await('ht_mlotool:requestInteriorSaveData', false, nameHash)

        -- Data was found, we'll end execution here and handle the soon-to-be-incoming latent net event elsewhere
        -- TODO - Look into a latent callback for ox_lib
        if hasData then return end
    end

    if interior == false or hasData == false then
        interior = CInterior:new(interiorId)
        InteriorCache.addInterior(interior)
    end

    if interior == nil then
        return lib.notify({
            type = 'error',
            title = locale('data_generation_fail')
        })
    end

    if not interior.globalPortalCount then
        interior:updateGlobalPortals()
    end

    if InteriorCache.getInterior(interiorId) == nil then
        InteriorCache.addInterior(interior)
    end

    openToolInterface(interior)
end)
