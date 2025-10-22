---@type ServerConstants
local Constants = require 'new_server.helpers.constants'

---@type HTFileApi
local HTFile = require 'new_server.helpers.fileio'

---@type { [string]: CInterior }
local _interiorDataCache = {}

---@type { [string]: string }
local _interiorFilenameLookup = {}

-- ##### API ##### --

local InteriorFileCacheApi = {}

function InteriorFileCacheApi.initializeCache()
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
                local nameHashString = tostring(interiorData.nameHash)
                _interiorFilenameLookup[nameHashString] = filename
                _interiorDataCache[nameHashString] = interiorData
            end
        end
    end
end

---@param nameHash number | string
---@param forceReload boolean?
---@return CInterior?
function InteriorFileCacheApi.getDataForInterior(nameHash, forceReload)

end

return InteriorFileCacheApi --[[@as InteriorFileCacheApi]]
