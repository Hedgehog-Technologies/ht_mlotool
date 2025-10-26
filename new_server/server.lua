---@type Config
local Config = require 'shared.config'

---@type InteriorFileCacheApi
local FileCache = require 'new_server.helpers.interiorfilecache'

---@param source string|number
---@param nameHash number?
---@return boolean
lib.callback.register('ht_mlotool:requestInteriorSaveData', function(source, nameHash)
    if nameHash == nil then return false end

    local data = FileCache.getDataForInterior(nameHash)
    if not data then return false end

    TriggerLatentClientEvent('ht_mlotool:loadInteriorData', source, Config.serverToClientBPS, data, true)
    return true
end)

-- ##### Initialization Thread ##### --

CreateThread(function()
    lib.versionCheck('Hedgehog-Technologies/ht_mlotool')

    FileCache.initializeCache()
end)
