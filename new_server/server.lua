---@type ServerConstants
local Constants = require 'new_server.helpers.constants'

---@type HTFileApi
local HTFile = require 'new_server.helpers.fileio'

---@type InteriorFileCacheApi
local FileCache = require 'new_server.helpers.interiorfilecache'

-- ##### Initialization Thread ##### --

CreateThread(function()
    lib.versionCheck('Hedgehog-Technologies/ht_mlotool')

    FileCache.initializeCache()
end)
