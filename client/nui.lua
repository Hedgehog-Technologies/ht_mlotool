function OpenMLO(mloData, currentRoomIndex)
    SetNuiFocus(true, true)
    SendReactMessage('ht_mlotool:openMLO', { mloData = mloData, roomIndex = currentRoomIndex })
end

RegisterNUICallback('ht_mlotool:exitMLO', function(data, cb)
    SetNuiFocus(false, false)
    cb({})
    if data and data.mloData then
        UpdateMLOData(data.mloData)
    end
end)

RegisterNUICallback('ht_mlotool:generateAudioFiles', function(data, cb)
    cb({})

    local mloData = data.mlo
    local generateAO = data.generateOcclusion
    local generateDat151 = data.generateDat151
    local debug = data.debug

    GenerateMLOFiles(mloData, generateAO, generateDat151, debug)
end)

RegisterNUICallback('ht_mlotool:debugDrawToggle', function(data, cb)
    cb({})

    UpdateDebugDraw(data.info, data.outline, data.fill, data.navigate)
end)

RegisterNUICallback('ht_mlotool:fetchLocales', function(_, cb)
    local lang = GetConvar('ox:locale', 'en')
    local locales = json.decode(LoadResourceFile(cache.resource, ('locales/%s.json'):format(lang)))

    if not locales then
        lib.notify({
            type = 'error',
            title = 'MLO Tool',
            description = ('Locale file for "%s" could not be found, please consider contributing with a translation'),
            duration = 12500
        })

        if lang ~= 'en' then
            print('WARNING: Locale file for "%s" could not be found. Defaulting to "en"')
            locales = json.decode(LoadResourceFile(cache.resource, 'locales/en.json'))
        end
    end

    cb(locales)
end)

RegisterNUICallback('ht_mlotool:freeMove', function(enabled, cb)
    cb({})
    SetNuiFocusKeepInput(enabled)
end)

--- A simple wrapper around SendNUIMessage that you can use to
--- dispatch actions to the React frame.
---
---@param action string The action you wish to target
---@param data any The data you wish to send along with this action
function SendReactMessage(action, data)
    SendNUIMessage({
        action = action,
        data = data
    })
end
