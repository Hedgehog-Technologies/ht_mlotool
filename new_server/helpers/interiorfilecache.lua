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
    -- Check for old schema files

    local files, fileCount = HTFile.getFilesInDirectory(Constants.savedMloDirPath, '%.json')

    if fileCount > 0 then
        lib.print.info(locale('found_mlo_json_files', fileCount, Constants.savedMloDirPath))
        lib.print.warn('It is safe to delete the files in the "saved_mlos" directory. Saved files are now located in the "saved_interiors" directory.')
    end

    for i = 1, fileCount do
        local filename = files[i]
        local interiorDataString = HTFile.readFile(nil, Constants.savedMloDirPath, filename, 'json')

        if interiorDataString ~= nil then
            ---@type TInteriorData
            local interiorData = json.decode(interiorDataString)

            if interiorData and interiorData.nameHash then
                local nameHashString = tostring(interiorData.nameHash)
                _interiorFilenameLookup[nameHashString] = filename
                _interiorDataCache[nameHashString] = interiorData

                if not HTFile.readFile(nil, Constants.savedInteriorDirPath, filename, 'json') then
                    HTFile.writeFile(nil, Constants.savedInteriorDirPath, filename, 'json', interiorDataString)
                end
            end
        end
    end

    -- Read new schema files

    files, fileCount = HTFile.getFilesInDirectory(Constants.savedInteriorDirPath, '%.json')

    if fileCount > 0 then
        lib.print.info(locale('found_mlo_json_files', fileCount, Constants.savedInteriorDirPath))
    end

    for i = 1, fileCount do
        local filename = files[i]
        local interiorDataString = HTFile.readFile(nil, Constants.savedInteriorDirPath, filename, 'json')

        if interiorDataString ~= nil then
            ---@type TInteriorData
            local interiorData = json.decode(interiorDataString)

            if interiorData and interiorData.nameHash then
                local nameHashString = tostring(interiorData.nameHash)
                _interiorFilenameLookup[nameHashString] = filename
                _interiorDataCache[nameHashString] = interiorData
            end
        end
    end
end

---@param source number|string|nil
---@param filename string
---@return TInteriorData?
function InteriorFileCacheApi.loadDataFromFile(source, filename)
    if filename == nil then return nil end

    ---@type TInteriorData?
    local data = nil

    local dataString = HTFile.readFile(source, Constants.savedInteriorDirPath, filename, 'json')

    if dataString then
        data = json.decode(dataString)

        -- This value changes across sessions, we'll need to regrab it
        data.interiorId = nil
        -- Force regeneration of global portals when reloading from save file
        data.globalPortalCount = nil

        if data.nameHash then
            local nameHash = type(data.nameHash) == 'number' and tostring(data.nameHash) or data.nameHash

            _interiorDataCache[nameHash] = data
            _interiorFilenameLookup[nameHash] = filename
        end
    end

    return data
end

---@param source number|string|nil
---@param nameHash number|string
---@param forceReload boolean?
---@return TInteriorData?
function InteriorFileCacheApi.getDataForInterior(source, nameHash, forceReload)
    if type(nameHash) == 'number' then nameHash = tostring(nameHash) end

    local filename = _interiorFilenameLookup[nameHash]

    if filename == nil then
        local msg = locale('no_filename_name_hash', nameHash)

        lib.print.warn(msg)
        TriggerClientEvent('ox_lib:notify', source, {
            type = 'warning',
            title = locale('warning'),
            description = msg
        })

        return nil
    end

    ---@type TInteriorData?
    local data = nil

    if forceReload then
        data = InteriorFileCacheApi.loadDataFromFile(source, filename)
    else
        data = _interiorDataCache[nameHash]
    end

    return data
end

---@param nameHash string|number
function InteriorFileCacheApi.getFilenameForInterior(nameHash)
    if type(nameHash) == 'number' then nameHash = tostring(nameHash) end

    return _interiorFilenameLookup[nameHash]
end

---@param nameHash string|number
---@param filename string
function InteriorFileCacheApi.addFilenameForInterior(nameHash, filename)
    if type(nameHash) == 'number' then nameHash = tostring(nameHash) end

    _interiorFilenameLookup[nameHash] = filename
end

return InteriorFileCacheApi --[[@as InteriorFileCacheApi]]
