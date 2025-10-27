---@type Config
local Config = require 'shared.config'

---@type DebugDrawApi
local DebugDraw = require 'new_client.helpers.debugdraw'

---@type InteriorCacheApi
local InteriorCache = require 'new_client.helpers.interiorcache'

---@param debugDrawData table
---@param cb function
local function nuiDebugDrawToggle(debugDrawData, cb)
    cb({})

    lib.print.verbose(('Toggling debug draw: info=%s, outline=%s, fill=%s, navigate=%s'):format(
        tostring(debugDrawData.info),
        tostring(debugDrawData.outline),
        tostring(debugDrawData.fill),
        tostring(debugDrawData.navigate)
    ))

    DebugDraw.updateDebugDraw(
        debugDrawData.info,
        debugDrawData.outline,
        debugDrawData.fill,
        debugDrawData.navigate
    )
end

---@param debugEntityData table
---@param cb function
local function nuiDebugEntityToggle(debugEntityData, cb)
    cb({})

    lib.print.verbose(('Debug for portal %s entity %s set to %s'):format(
        debugEntityData.portalIndex,
        debugEntityData.entityIndex,
        tostring(debugEntityData.debug)
    ))

    DebugDraw.updateDebugEntities(
        debugEntityData.portalIndex,
        debugEntityData.entityIndex,
        debugEntityData.debug
    )
end

---@param interiorData table
---@param cb function
local function nuiExitTool(interiorData, cb)
    cb({})

    SetNuiFocus(false, false)

    lib.print.verbose('Exiting MLO NUI')

    if interiorData then
        InteriorCache.updateInteriorData(interiorData)
    end
end

---@param _ any
---@param cb fun(locales: table)
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
local function nuiToggleFreeMove(enabled, cb)
    cb({})

    lib.print.debug(('Free move mode: %s'):format(enabled and 'enabled' or 'disabled'))

    SetNuiFocusKeepInput(enabled)
end

---@param generateAudioData table
---@param cb function
local function nuiGenerateAudioFiles(generateAudioData, cb)
    cb({})

    local interiorData = generateAudioData.interior
    local generateAO = generateAudioData.generateOcclusion
    local generateDat151 = generateAudioData.generateDat151
    local debug = generateAudioData.debug

    lib.print.verbose(('Generating audio files for Interior %s (AO: %s, Dat151: %s, Debug: %s)'):format(
        interiorData and interiorData.saveName or 'nil',
        tostring(generateAO),
        tostring(generateDat151),
        tostring(debug)
    ))

    InteriorCache.generateInteriorFiles(interiorData, generateAO, generateDat151, debug)
end

---@param interiorData table
---@param cb function
local function nuiSaveInterior(interiorData, cb)
    cb({})

    lib.print.verbose(('Updating data for Interior %s'):format(interiorData and interiorData.saveName or 'nil'))

    local interior = InteriorCache.updateInteriorData(interiorData)

    if interior then
        TriggerLatentServerEvent('ht_mlotool:saveInteriorData', Config.clientToServerBPS, interior:getSaveData())
    end
end

RegisterNUICallback('ht_mlotool:nui:debugDrawToggle', nuiDebugDrawToggle)
RegisterNUICallback('ht_mlotool:nui:debugEntityToggle', nuiDebugEntityToggle)
RegisterNUICallback('ht_mlotool:nui:exitTool', nuiExitTool)
RegisterNUICallback('ht_mlotool:nui:fetchLocales', nuiFetchLocales)
RegisterNUICallback('ht_mlotool:nui:toggleFreeMove', nuiToggleFreeMove)
RegisterNUICallback('ht_mlotool:nui:generateAudioFiles', nuiGenerateAudioFiles)
RegisterNUICallback('ht_mlotool:nui:saveInterior', nuiSaveInterior)
