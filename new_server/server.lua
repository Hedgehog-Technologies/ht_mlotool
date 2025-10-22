---@type ServerConstants
local Constants = require 'new_server.helpers.constants'

---@type HTFileApi
local HTFile = require 'new_server.helpers.fileio'

---@type InteriorFileCacheApi
local FileCache = require 'new_server.helpers.interiorfilecache'

---@type { [string]: string }
local interiorFilenameLookup = {}

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

-- ##### Initialization Thread ##### --

CreateThread(function()
    lib.versionCheck('Hedgehog-Technologies/ht_mlotool')

    FileCache.initializeCache()
end)
