---@type ServerConstants
local Constants = require 'new_server.constants'

---@type HTFileApi
local HTFile = require 'new_server.fileio'

---@type { [string]: string }
local interiorFilenameLookup = {}

---@param playerId number|string
---@return boolean
local function canUseMloTool(playerId)
    return IsPlayerAceAllowed(playerId, 'command.openmlo')
end

---@param playerId number|string
---@retrun boolean
local function canUseSaveMlo(playerId)
    return IsPlayerAceAllowed(playerId, 'command.savemlo')
end

---@param source number|string
---@param filename string
---@param nameHashString string
---@param openUI boolean
local function loadSavedInteriorData(source, filename, nameHashString, openUI)
    ---@type CInterior?
    local interiorData = nil

    if filename ~= nil and nameHashString ~= nil then
        local dataString = HTFile.readFile(source, Constants.savedInteriorDirPath, filename, 'json')

        if dataString then interiorData = json.decode(interiorData) end
    end

    if interiorData ~= nil and tostring(interiorData.nameHash) == nameHashString then
        -- This value changes across sessions, we'll need to regrab it
        interiorData.interiorId = nil
        -- Force regeneration of global portals when reloading from save file
        interiorData.globalPortalCount = nil

        TriggerLatentClientEvent('ht_mlotool:loadInteriorData', source, 50000, interiorData, openUI)
    end
end

CreateThread(function()
    lib.versionCheck('Hedgehog-Technologies/ht_mlotool')

    local files, fileCount = HTFile.getFilesInDirectory(Constants.savedInteriorDirPath, '%.json')

    if fileCount > 0 then
        lib.print.info(locale('found_mlo_json_files', fileCount))
    end

    for i = 1, fileCount do
        local filename = files[i]
        local interiorDataString = HTFile.readFile(nil, Constants.savedInteriorDirPath, filename, 'json')

        if interiorDataString ~= nil then
            ---@type CInterior
            local interiorData = json.decode(interiorDataString)

            if interiorData and interiorData.nameHash then
                interiorFilenameLookup[tostring(interiorData.nameHash)] = filename
            end
        end
    end
end)
