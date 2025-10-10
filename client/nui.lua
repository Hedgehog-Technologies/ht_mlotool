function OpenMLONui(mloData, currentRoomIndex)
    lib.print.verbose(('Opening MLO NUI for %s'):format(mloData and mloData.saveName or 'nil'))
    SetNuiFocus(true, true)
    SendReactMessage('ht_mlotool:openMLO', { mloData = mloData, roomIndex = currentRoomIndex })
end

---@param debugDrawData DebugDrawData
---@param cb function
local function nuiDebugDrawToggle(debugDrawData, cb)
    cb({})

    lib.print.verbose(('Toggling debug draw: info=%s, outline=%s, fill=%s, navigate=%s'):format(tostring(debugDrawData.info), tostring(debugDrawData.outline), tostring(debugDrawData.fill), tostring(debugDrawData.navigate)))

    UpdateDebugDraw(debugDrawData.info, debugDrawData.outline, debugDrawData.fill, debugDrawData.navigate)
end

---@param debugEntityData DebugEntityData
---@param cb function
local function nuiDebugEntityToggle(debugEntityData, cb)
    cb({})

    lib.print.verbose(('Debug for portal %s entity %s set to %s'):format(debugEntityData.portalIndex, debugEntityData.entityIndex, tostring(debugEntityData.debug)))

    UpdateDebugEntities(debugEntityData.portalIndex, debugEntityData.entityIndex, debugEntityData.debug)
end

---@param mloData MLODef?
---@param cb function
local function nuiExitMLO (mloData, cb)
    cb({})

    SetNuiFocus(false, false)

    lib.print.verbose('Exiting MLO NUI')

    if mloData then
        UpdateMLOData(mloData)
    end
end

---@param _ any
---@param cb function
local function nuiFetchLocales(_, cb)
    local lang = GetConvar('ox:locale', 'en')
    lib.print.verbose(('Fetching locales for language: %s'):format(lang))

    local locales = lib.loadJson('locales.' .. lang)
    lib.print.debug(('Found %s locales: %s'):format(lang, locales and 'true' or 'false'))

    if not locales then
        lib.notify({
            type = 'error',
            title = 'MLO Tool',
            description = ('Locale file for "%s" could not be found, please consider contributing a translation'):format(lang),
            duration = 12500
        })

        if lang ~= 'en' then
            lib.print.warn(('Locale file for "%s" could not be found. Defaulting to "en".\nPlease consider contributing a translation.'):format(lang))
            locales = lib.loadJson('locales.en')
        end
    end

    cb(locales)
end

---@param enabled boolean
---@param cb function
local function nuiFreeMove(enabled, cb)
    cb({})

    lib.print.debug(('Free move mode: %s'):format(enabled and 'enabled' or 'disabled'))

    SetNuiFocusKeepInput(enabled)
end

---@param generateAudioData GenerateAudioData
---@param cb function
local function nuiGenerateAudioFiles(generateAudioData, cb)
    cb({})

    local mloData = generateAudioData.mlo
    local generateAO = generateAudioData.generateOcclusion
    local generateDat151 = generateAudioData.generateDat151
    local debug = generateAudioData.debug

    lib.print.verbose(('Generating audio files for MLO %s (AO: %s, Dat151: %s, Debug: %s)'):format(mloData and mloData.saveName or 'nil', tostring(generateAO), tostring(generateDat151), tostring(debug)))

    GenerateMLOFiles(mloData, generateAO, generateDat151, debug)
end

---@param mloData MLODef
---@param cb function
local function nuiSaveMLO(mloData, cb)
    cb({})

    lib.print.verbose(('Updating data for MLO %s'):format(mloData and mloData.saveName or 'nil'))

    local updatedMLO = UpdateMLOData(mloData)

    if updatedMLO then
        TriggerLatentServerEvent('ht_mlotool:saveMLOData', 100000, updatedMLO)
    end
end

RegisterNUICallback('ht_mlotool:nui:debugDrawToggle', nuiDebugDrawToggle)
RegisterNUICallback('ht_mlotool:nui:debugEntityToggle', nuiDebugEntityToggle)
RegisterNUICallback('ht_mlotool:nui:exitMLO', nuiExitMLO)
RegisterNUICallback('ht_mlotool:nui:fetchLocales', nuiFetchLocales)
RegisterNUICallback('ht_mlotool:nui:freeMove', nuiFreeMove)
RegisterNUICallback('ht_mlotool:nui:generateAudioFiles', nuiGenerateAudioFiles)
RegisterNUICallback('ht_mlotool:nui:saveMlo', nuiSaveMLO)

--- A simple wrapper around SendNUIMessage that you can use to
--- dispatch actions to the React frame.
---
---@param action string The action you wish to target
---@param data any The data you wish to send along with this action
function SendReactMessage(action, data)
    lib.print.debug(('Sending NUI message: [%s] with %s'):format(action, json.encode(data, { indent = true })))

    SendNUIMessage({
        action = action,
        data = data
    })
end
