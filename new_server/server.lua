---@type Config
local Config = require 'shared.config'

---@type ServerConstants
local Constants = require 'new_server.helpers.constants'

---@type InteriorFileCacheApi
local FileCache = require 'new_server.helpers.interiorfilecache'

---@type HTFileApi
local HTFile = require 'new_server.helpers.fileio'

---@type ServerUtilsApi
local Utils = require 'new_server.helpers.utils'

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

---@param outputDirName string|[string, string]
---@param filename string
---@param filetype string
---@param data [ TXmlTag ]
---@param debug boolean
RegisterNetEvent('ht_mlotool:outputResultFile', function(outputDirName, filename, filetype, data, debug)
    local source = source
    if not Utils.canUseOpenMloCmd(source) then
        lib.print.warn(locale('incorrect_perms', source, GetPlayerName(source), 'ht_mlotool:outputResultFile'))
        return
    end

    local interiorDirName = type(outputDirName) ~= 'table'
        and outputDirName
        or FileCache.getFilenameForInterior(outputDirName.nameHash)
        or outputDirName.nameHash

    local outputDirPath = ('%s/%s'):format(Constants.generatedFilesDirPath, interiorDirName)
    local success = HTFile.createDirectory(outputDirPath)
    success = success and HTFile.writeFile(source, outputDirPath, filename, filetype, Utils.toXml(data), debug)

    local type = success and 'success' or 'error'
    local title = success and locale('file_save_success') or locale('file_save_fail')
    local fileString = ('%s.%s'):format(filename, filetype)
    local msg = ('%s: %s'):format(title, fileString)
    local printFunc = success and lib.print.info or lib.print.error

    printFunc(msg)

    TriggerClientEvent('ox_lib:notify', source, {
        type = type,
        title = title,
        description = fileString
    })
end)

---@param interiorData TInteriorData
RegisterNetEvent('ht_mlotool:saveInteriorData', function(interiorData)
    local source = source
    if not Utils.canUseOpenMloCmd(source) and not Utils.canUseSaveMloCmd(source) then
        lib.print.warn(locale('incorrect_perms', source, GetPlayerName(source), 'ht_mlotool:saveInteriorData'))
        return
    end

    -- This value changes across sessions, we'll need to regrab it when we reload
    -- This shouldn't be a problem anymore, more of a JIC situation
    interiorData.interiorId = nil

    local filename = interiorData.saveName ~= ''
        and interiorData.saveName
        or FileCache.getFilenameForInterior(interiorData.nameHash)
        or interiorData.name:gsub('hash_', '')

    FileCache.addFilenameForInterior(interiorData.nameHash, filename)

    local outputPath = Constants.savedInteriorDirPath
    local success = HTFile.createDirectory(outputPath)
    success = success and HTFile.writeFile(source, outputPath, filename, 'json', json.encode(interiorData, { sort_keys = true, indent = true }))

    local type = success and 'success' or 'error'
    local title = success and locale('save_mlo_success') or locale('save_mlo_fail')
    local fileString = ('%s/%s.json'):format(Constants.savedInteriorDir, filename)
    local msg = ('%s: %s'):format(title, fileString)
    local printFunc = success and lib.print.info or lib.print.error

    printFunc(msg)

    TriggerClientEvent('ox_lib:notify', source, {
        type = type,
        title = title,
        description = fileString
    })
end)

-- ##### Initialization Thread ##### --

CreateThread(function()
    lib.versionCheck('Hedgehog-Technologies/ht_mlotool')

    FileCache.initializeCache()
end)
